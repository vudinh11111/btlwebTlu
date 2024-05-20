import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { ShoppingCart } from "@mui/icons-material";
import "./productDetail.css";
import { useCart, useAuth, useWishList, useProduct } from "contexts";
import { getSellingPrice } from "utils/";
import {
	postToCart,
	postToWishList,
	deleteProductInWishList,
	getProductItem,
} from "services";
import { useDocumentTitle, useToast } from "custom-hooks";
import loadingImage from "assets/images/loader.svg";
import "./product-page-main.css";

const ProductPageItem = () => {
	const [quantity, setQuantity] = useState(1);

	const handleDecrement = () => {
		if (quantity > 1) {
			setQuantity(quantity - 1);
		}
	};

	const handleIncrement = () => {
		setQuantity(quantity + 1);
	};
	const { productId } = useParams();
	const {
		productItem,
		productItemMessages: { loading, error },
		productDispatch,
	} = useProduct();
	const {
		cartState: { cartItems },
		cartDispatch,
	} = useCart();
	const {
		wishListState: { wishListItems },
		wishListDispatch,
	} = useWishList();
	const {
		authState: { token, isAuth },
	} = useAuth();
	const { showToast } = useToast();
	const navigate = useNavigate();
	const [isOngoingNetworkCall, setIsOngoingNetworkCall] = useState(false);
	const { setDocumentTitle } = useDocumentTitle();

	useEffect(() => {
		setDocumentTitle("Sách");

		(async () => {
			productDispatch({
				type: "SET_PRODUCT_ITEM_MESSAGES",
				payload: {
					productItemMessages: { loading: true, error: null },
				},
			});
			try {
				const {
					data: { product },
				} = await getProductItem(productId);
				productDispatch({
					type: "SET_PRODUCT_ITEM",
					payload: {
						productItem: product,
						productItemMessages: { loading: false, error: null },
					},
				});
			} catch (error) {
				showToast("Không thể truy xuất chi tiết mặt hàng sản phẩm.", "error");
				productDispatch({
					type: "SET_PRODUCT_ITEM_MESSAGES",
					payload: {
						productItemMessages: {
							loading: false,
							error: "Không thể truy xuất chi tiết mặt hàng sản phẩm.",
						},
					},
				});
			}
		})();
	}, []);

	const bookInCart = cartItems?.find((item) => item._id == productId);
	const bookInWishList = wishListItems?.find((item) => item._id == productId);

	if (loading) {
		return (
			<main className="main product-page-main flex-col flex-align-center flex-justify-center">
				<img
					src={loadingImage}
					alt="Loading image"
					className="img-responsive img"
				/>
			</main>
		);
	}
	if (error) {
		return (
			<main className="main product-page-main flex-col flex-align-center flex-justify-center">
				<h2 className="text-center loading-message error-color">
					{error}
				</h2>
			</main>
		);
	}

	const {
		author,
		bookType,
		coverImg,
		discountPercent,
		genres,
		_id,
		id,
		description,
		originalPrice,
		title,
		totalRatings,
		totalStars,
		inStock,
		specifications,
		quantity_sold,
		short_description
	} = productItem;

	const sellingPrice = getSellingPrice(originalPrice, discountPercent);
	const outOfStock = !inStock;

	const localeOriginalPrice = originalPrice.toLocaleString("en-IN", {
		minimumFractionDigits: 3,
		maximumFractionDigits: 3,
	});
	const localeSellingPrice = sellingPrice.toLocaleString("en-IN", {
		minimumFractionDigits: 3,
		maximumFractionDigits: 3,
	});

	const localeTotalRatings = totalRatings.toLocaleString("en-IN");

	{/*const genreMapping = genres.map((genre) => (
		<li
			key={`${_id}-${genre}`}
			className="badge text-xs badge-secondary p-0-25 px-0-5 genre-item"
		>
			{genre}
		</li>
	));*/}

	const productBadge = (
		<h6 className="badge text-xs badge-secondary my-0-5 p-0-25 px-0-5">
			{bookType}
		</h6>
	);

	const handleAddToCart = async () => {
		if (outOfStock) return;
		setIsOngoingNetworkCall(true);

		if (!isAuth) {
			return navigate("/login", { state: { from: `/products/${_id}` } });
		}

		if (bookInCart) {
			return navigate("/cart");
		} else {
			try {
				const {
					data: { cart },
				} = await postToCart(productItem, token);

				showToast("Mặt hàng được thêm vào giỏ hàng", "success");
				cartDispatch({
					type: "SET_CART_ITEMS",
					payload: {
						cartItems: cart,
						error: null,
						loading: false,
					},
				});
			} catch (error) {
				showToast(
					"Không thể thêm mặt hàng vào giỏ hàng. Vui lòng thử lại sau.",
					"error"
				);
			}
		}
		setIsOngoingNetworkCall(false);
	};

	const handleAddToWishList = async () => {
		if (outOfStock) return;
		setIsOngoingNetworkCall(true);

		if (!isAuth) {
			return navigate("/login", { state: { from: `/products/${_id}` } });
		}

		try {
			const {
				data: { wishlist },
			} = bookInWishList
					? await deleteProductInWishList(_id, token)
					: await postToWishList(productItem, token);
			showToast(
				`Sản phẩm ${bookInWishList ? "bị xóa khỏi" : "thêm vào"} danh sách thích`,
				"success"
			);
			wishListDispatch({
				type: "ADD_TO_WISHLIST",
				payload: {
					wishListItems: wishlist,
					error: false,
					loading: false,
				},
			});
		} catch (error) {
			showToast(
				"Không thể xóa mục khỏi danh sách yêu thích. Vui lòng thử lại sau.",
				"error"
			);
		}
		setIsOngoingNetworkCall(false);
	};

	return (
		<main className="main bg-Color-div product-page-main mx-auto px-5 p-2 flex-col flex-align-center flex-justify-start">
			<div style={{ display: "flex" }}>
				<section className="product-page-content">
					{/*productBadge*/}
					<div className="bg-Color-xam product-image-container flex-col flex-justify-start mx-auto mx-auto p-1-5 px-1 magin100px">
						<img
							src={coverImg[0]}
							alt={title}
							className="img product-image boderblue"
						/>
						<div className="img-respon oneSelect">
							{coverImg.slice(0, 5).map((imgSrc, index) => (
								<img
									key={`${title}-${index}`}
									src={imgSrc}
									alt={title}
									className="img-repon img-responsive"
								/>
							))}
							
						</div>
						<div className="offoron-2 magin100px product-offers flex-col flex-align-start flex-justify-center">
							<h6 className="text-sm offer flex-row flex-align-start">
								<CheckCircleOutlineIcon className="check" />
								<span className="offer-text fontKt">
									Kích thước lớn và bìa cứng, tạo cảm giác sang trọng và bền bỉ.
								</span>
							</h6>
							<h6 className="text-sm offer flex-row flex-align-start">
								<CheckCircleOutlineIcon className="check" />
								<span className="offer-text fontKt">
								Hình vẽ ngộ nghĩnh và màu sắc sống động, thu hút sự chú ý của trẻ em.
								</span>
							</h6>
							<h6 className="text-sm offer flex-row flex-align-start">
								<CheckCircleOutlineIcon className="check" />
								<span className="offer-text fontKt">
									Cung cấp thông tin tổng quát về diện tích, dân số và ngôn ngữ của các quốc gia
								</span>
							</h6>

						</div>
					</div>

					<div className="product-details text-left flex-col flex-align-center flex-justify-start p-1">
						<button
							className={`btn btn-primary btn-icon btn-dismiss btn-card-wishlist mx-1 my-0-75 flex-col flex-align-center flex-justify-center ${isOngoingNetworkCall || outOfStock
								? "btn-disabled"
								: ""
								}`}
							onClick={handleAddToWishList}
							disabled={isOngoingNetworkCall}
						>
							{/*<span className="icon flex-col flex-align-center flex-justify-center">
								{bookInWishList ? (
									<i className="fa-solid fa-heart text-reg"></i>
								) : (
									<i className="fa-regular fa-heart text-reg"></i>
								)}
							</span>*/}
						</button>


						<div className="offoron">

							<div className="product-heading pr-2">
								<h6 className="text-lg card-title">{title}</h6>
								<p className="text-sm card-subtitle">{author}</p>
							</div>
							<div className="product-price-ratings-container flex-row flex-justify-between flex-align-start">
								<div className="product-price flex-row flex-align-start flex-justify-start">
									<div className="discounted-price flex-col">
										<p className="price-discounted">
											{localeSellingPrice} đ
										</p>
										<span className="success-color percentage-discount">
											Tiết kiệm {discountPercent} %
										</span>
									</div>
									<p className="price-original" style={{ textDecoration: 'line-through' }}>
										{localeOriginalPrice} đ
									</p>

								</div>
								<div className="product-ratings flex-row flex-align-center flex-justify-end rating-badge">
									<span className="rating-stars text-sm">
										{totalStars}
									</span>
									{/* Render star icons with a loop */}
									{(() => {
										const stars = [];
										for (let i = 0; i < totalStars; i++) {
											stars.push(
												<i key={i} className="fa-solid fa-star ml-0-25 mr-0-5 successColor"></i>
											);
										}
										return stars;
									})()}
									|
									<span className="ml-0-5 rating-count text-sm">
										{localeTotalRatings} đã đánh giá
									</span>
								</div>
							</div>
							{outOfStock ? (
								<div className="badge-out-of-stock p-0-25">
									Hết hàng
								</div>
							) : null}


							<div className="product-footer mt-1 mb-0-75">
								<button
									className={`btn btn-secondary btn-text-icon text-reg px-0-5 py-0-25 ${isOngoingNetworkCall || outOfStock
										? "btn-disabled"
										: ""
										}`}
									disabled={isOngoingNetworkCall}
									onClick={handleAddToCart}
								>
									{bookInCart ? (
										<span>Thêm giỏ hàng</span>
									) : (
										<span>Thêm vào giỏ</span>
									)}
									<span className="icon">
										<ShoppingCart />
									</span>
								</button>
							</div>
						</div>
						<div className="bg-Color-xam">
							<div >
								<div className="offoron-2 product-heading pr-2">
									<div className="chinhhang">
										<CheckCircleOutlineIcon className="check"></CheckCircleOutlineIcon>
										<p className="text-sm spax">Chính hãng</p>

										<p className="text-sm card-subtitle"> Tác giả: {author}</p>
									</div>


									<h6 className="text-lg card-title">{title}</h6>

									<div className="product-ratings flex-row flex-align-center flex-justify-start rating-badge">
										<span className="rating-stars text-sm">
											{totalStars}
										</span>
										{/* Render star icons with a loop */}
										{(() => {
											const stars = [];
											for (let i = 0; i < totalStars; i++) {
												stars.push(
													<i key={i} className="fa-solid fa-star ml-0-25 mr-0-5 successColor"></i>
												);
											}
											return stars;
										})()}
										|
										<span className="ml-0-5 rating-count text-sm">
											{localeTotalRatings} đã đánh giá
										</span>
									</div>
								</div>
								<div className="offoron magin100px product-offers flex-col flex-align-start flex-justify-center">
									<h6 className="text-sm offer flex-row flex-align-start">
										<CheckCircleOutlineIcon className="check" />
										<span className="offer-text fontKt">
											Kích thước lớn và bìa cứng, tạo cảm giác sang trọng và bền bỉ.
										</span>
									</h6>
									<h6 className="text-sm offer flex-row flex-align-start">
										<CheckCircleOutlineIcon className="check" />
										<span className="offer-text fontKt">
											Hình vẽ ngộ nghĩnh và màu sắc sống động, thu hút sự chú ý của trẻ em.
										</span>
									</h6>
									<h6 className="text-sm offer flex-row flex-align-start">
										<CheckCircleOutlineIcon className="check" />
										<span className="offer-text fontKt">
											Cung cấp thông tin tổng quát về diện tích, dân số và ngôn ngữ của các quốc gia
										</span>
									</h6>

								</div>

								<span className="offoron-2 success-color percentage-discount">
									Tiết kiệm {discountPercent} %
								</span>
								<div className="offoron-2 product-price-ratings-container flex-row flex-justify-between flex-align-start">

									<div className="product-price flex-row flex-align-start flex-justify-start">

										<div className="discounted-price flex-col">

											<p className="price-discounted">
												{localeSellingPrice} đ
											</p>

										</div>
										<p className="price-original" style={{ textDecoration: 'line-through', color: "red" }}>
											{localeOriginalPrice} đ
										</p>
									</div>


								</div>
							</div>

							<div className="flex-col flex-justify-start mx-auto mx-auto">
								<div className="details-container">
									<p>Thông tin chi tiết:</p>

									<table className="bg-nau">

										<tbody className="thongtinct">
										
													<tr>
														<td>Phiên bản sách:</td>
														<td>Phiên bản thường</td>
													</tr>
													{specifications[0].attributes.map((attribute, index) => (
														<tr key={index}>
															<td>{attribute.name}</td>
															<td>{attribute.value}</td>
														</tr>
													))}
												
										</tbody>
									</table>
								</div>
								<p className="motasp">Mô tả sản phẩm:</p>
								<img
									src={coverImg[0]}
									alt={title}
									className="img product-image"
								/>
							</div>
							<div className="product-description text-sm">
								{description}
							</div>
							{/*<div className="card-genres">
						<ul className="list list-inline list-style-none flex-row flex-wrap flex-justify-start">
							{genreMapping}
						</ul>
				</div>*/}


						</div>
					</div>
				</section>
				<div className="offoron-2">


					{outOfStock ? (
						<div className="badge-out-of-stock p-0-25">
							Hết hàng
						</div>
					) : null}


					<div className="bg-Color-xam bg-Color-div product-footer mt-1 mb-0-75">
						<div className="offoron-2 discounted-price flex-col magin50px">
							<p className="soluong" style={{ textAlign: "left" }}>Số lượng</p>
							<div className="quantity-selector">

								<button className="btn-decrement" onClick={handleDecrement}>-</button>
								<span className="quantity">{quantity}</span>
								<button className="btn-increment" onClick={handleIncrement}>+</button>
							</div>
							<p className="price-discounted" style={{ textAlign: "left" }}>
								<p className="text-sm">Tạm tính: </p><br /> {localeSellingPrice} đ
							</p>

						</div>
						<button
							className={`btn btn-secondary btn-text-icon text-reg px-0-5 py-0-25 ${isOngoingNetworkCall || outOfStock
								? "btn-disabled"
								: ""
								}`}
							disabled={isOngoingNetworkCall}
							onClick={() => { }}
						>



							<span style={{ paddingRight: "33px" }}>Mua luôn</span>

							<span className="icon">
								<ShoppingCart />
							</span>
						</button>
						<div style={{ margin: "20px" }}></div>
						<button
							className={`buttonThemGio btn btn-text-icon text-reg px-0-5 py-0-25 ${isOngoingNetworkCall || outOfStock
								? "btn-disabled"
								: ""
								}`}
							disabled={isOngoingNetworkCall}
							onClick={handleAddToCart}
						>
							{bookInCart ? (
								<span>Vào giỏ hàng</span>
							) : (
								<span>Thêm vào giỏ</span>
							)}
							<span className="icon">
								<ShoppingCart />
							</span>
						</button>

					</div>
				</div>
			</div>
		</main>
	);
};

export { ProductPageItem };
