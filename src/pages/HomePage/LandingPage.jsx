import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import { Header } from "components/Header/Header";
import { useProduct } from "contexts";
import { useDocumentTitle } from "custom-hooks";
import "./landing-page.css";
import loadingImage from "assets/images/loader.svg";

const LandingPage = () => {
	const {
		products = [],
		productsMessages: { loading: productLoading, error: productError } = {},
		categories = [],
		categoriesMessages: { loading, error } = {},
	} = useProduct();

	const { setDocumentTitle } = useDocumentTitle();

	useEffect(() => {
		setDocumentTitle("Sách | Trang chủ");
	}, []);

	const categoryMapping = categories.map(
		({ categoryImage, categoryName, _id }) => (
			<Link
				to="/products"
				state={categoryName}
				key={_id}
				className="category-product-link category card card-wt-badge"
			>
				<img
					src={categoryImage}
					alt={`${categoryName} Image`}
					className="category-img img-responsive"
				/>
				{categoryName === "Non-Fiction" ? (
					<span className="badge badge-primary py-0-5 my-0-75 mx-0-25 px-0-75">
						Hot Sale
					</span>
				) : null}
				<div className="card-content">
					<h4 className="card-heading mb-1">{categoryName}</h4>
				</div>
			</Link>
		)
	);

	const sampleProducts = products?.slice(0, 4);

	const sampleProductsMapping = sampleProducts.map(
		({ _id, id, title, author, coverImg }) => (
			<Link
				to={`/products/${_id}`}
				className="product-card card card-vertical"
				key={_id}
			>
				<div className="card-header p-0-75">
					<img
						src={coverImg[0]}
						className="book-cover"
						alt={`${title} book cover`}
					/>
				</div>
				<div className="card-body px-0-75 pb-0-75">
					<div className="card-description my-0-25">
						<p className="card-title text-sm">{title}</p>
						<p className="text-xs card-subtitle mt-0-5">{author}</p>
					</div>
				</div>
			</Link>
		)
	);
	return (
		<>
			<Header />
			<main className="main-home my-2 mx-auto py-5 px-3">
				<h4 className="hero-sub-head text-center pt-2">
				Bây giờ, hãy xem sách bạn muốn tìm và trong vòng 24 giờ nó sẽ tới đến cửa!
				</h4>
				<section
					className="section-cateogies my-3 pt-2 pb-3 text-center"
					id="categories"
				>
					<h2 className="section__head">Thể loại phổ biến</h2>
					<p className="section__lead my-2">
					Kiểm tra các thể loại phổ biến chúng tôi cung cấp!
					</p>
					<article className="category-container">
						{loading ? (
							<img
								src={loadingImage}
								alt="Loading svg"
								className="img img-responsive mx-auto loader-img"
							/>
						) : error ? (
							<h3 className="error-color text-center my-2 mx-auto loader-error">
								{error}
							</h3>
						) : (
							categoryMapping
						)}
					</article>
					<Link
						to="/products"
						className="btn btn-primary text-center mx-auto mt-3 py-0-5 px-0-75"
					>
						Khám phá nhiều thể loại hơn!
						<span className="icon">
							<i className="fas fa-chevron-right"></i>
						</span>
					</Link>
				</section>
				<section
					className="top-picks my-3 pt-2 pb-3 text-center"
					id="top-picks"
				>
					<h2 className="section__head">Chọn hàng đầu</h2>
					<p className="section__lead my-2">
					Tìm hiểu những cuốn sách được mọi người yêu thích!
					</p>
					<article className="top-picks-container mx-auto">
						{productLoading ? (
							<img
								src={loadingImage}
								alt="Loading svg"
								className="img img-responsive mx-auto loader-img"
							/>
						) : error ? (
							<h3 className="error-color text-center my-2 mx-auto loader-error">
								{productError}
							</h3>
						) : (
							sampleProductsMapping
						)}
					</article>
					<Link
						to="/products"
						className="btn btn-primary text-center mx-auto mt-3 py-0-5 px-0-75"
					>
						Khám phá thêm sách!
						<span className="icon">
							<i className="fas fa-chevron-right"></i>
						</span>
					</Link>
				</section>
			</main>
		</>
	);
};

export { LandingPage };
