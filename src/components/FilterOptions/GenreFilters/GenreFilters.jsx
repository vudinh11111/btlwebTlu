import React from "react";
import { v4 as uuid } from "uuid";

import { GenreFilterOption } from "./GenreFilterOption";

const GenreFilters = () => {
	const genreFiltersList = [
		{ id: uuid(), categoryName: "Grammar, vocabulary & skills" },
		{ id: uuid(), categoryName: "Sách tiếng Việt" },
		{ id: uuid(), categoryName: "Sách kỹ năng làm việc" },
		{ id: uuid(), categoryName: "Nhà sách Fahasa" },
		{ id: uuid(), categoryName: "Tác phẩm kinh điển" },
		{ id: uuid(), categoryName: "Sách tư duy - Kỹ năng sống" },
		{ id: uuid(), categoryName: "Minh Long Book" },
		{ id: uuid(), categoryName: "English Books" },
		{ id: uuid(), categoryName: "Fiction - Literature" },
		/*{ id: uuid(), categoryName: "Thriller" },*/
	];

	const genreFilterMapping = genreFiltersList.map(({ id, categoryName }) => (
		<GenreFilterOption key={id} categoryName={categoryName} />
	));

	return (
		<div className="filter-category filter">
			<ul className="list-spaced list-style-none">
				<li className="filter-head py-0-25 mt-0-5">
					Thể loại
				</li>
				{genreFilterMapping}
			</ul>
		</div>
	);
};

export { GenreFilters };
