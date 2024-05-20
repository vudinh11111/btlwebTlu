import React from "react";
import { Close } from "@mui/icons-material";

import { useFilter } from "contexts/";

const ClearFilters = ({ handleChangeShowFilterDrawer }) => {
  const { filterDispatch } = useFilter();
 
  
  const handleClearFilters = (event) => {
    filterDispatch({ filterType: "CLEAR_FILTERS" });
  };

  return (
    <div className="product-filters-head flex-row flex-align-end flex-justify-between mb-1-5 text-underline">
      <h5 className="sidebar-head">Danh mục</h5>
      <div className="flex-row flex-align-center flex-justify-center clear-filters-button-container">
        <button
		style={{ color: "red" }}
          className="btn btn-clear-filters btn-link"
          onClick={handleClearFilters}
        >
         Xóa chọn
        </button>
        <button
          className="btn btn-icon btn-close-filters"
          onClick={() => handleChangeShowFilterDrawer(false)}
        >
          <Close />
        </button>
      </div>
    </div>
  );
};

export { ClearFilters };
