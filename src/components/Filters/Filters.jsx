import React from "react";

import {
	GenreFilters,
	BookTypeFilters,
	RatingFilters,
	PriceFilters,
	ClearFilters,
	SortingOptions,
} from "components";

const Filters = ({ handleChangeShowFilterDrawer, showFilterDrawer }) => {
	return (
		<aside
			className={`sidebar product-filters ${
				showFilterDrawer ? "show-filters" : "hide-filters"
			}`}
		>
			<ClearFilters
				handleChangeShowFilterDrawer={handleChangeShowFilterDrawer}
			/>
			<SortingOptions />
			<GenreFilters />
			<RatingFilters />
			<BookTypeFilters />
			<PriceFilters />
		</aside>
	);
};

export { Filters };
