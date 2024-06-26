import React from "react";
import { Link } from "react-router-dom";

import { AddressItem } from "pages";
import { getSellingPrice } from "utils";

const OrderItem = ({ order, page }) => {
	const { orderId, price, selectedCoupon, createdAt, items, address } = order;
	const getFormattedPrice = (price) =>
		price.toLocaleString("en-IN", {
			minimumFractionDigits: 3,
			maximumFractionDigits: 3,
		});

	const getFormattedSellingPrice = (originalPrice, discountPercent) => {
		const sellingPrice = getSellingPrice(originalPrice, discountPercent);

		return getFormattedPrice(sellingPrice);
	};

	return (
		<section
			className={`order-wrapper mx-auto ${
				page === "orders" ? "border-bottom py-3" : "border-none"
			}`}
		>
			{Object.keys(order)?.length ? (
				<div className="order-details mx-auto text-left">
					<div className="order-summary p-0-75 flex-col flex-align-start flex-justify-start">
						<div className="order-id flex-row flex-align-start flex-justify-start">
							<h6 className="text-reg">Id đơn hàng:</h6>
							<p>{orderId}</p>
						</div>

						<div className="order-total flex-row">
							<h6 className="text-reg order-total-head">
							Tổng số đơn đặt hàng:
							</h6>
							<p>{getFormattedPrice(price)} đ</p>
						</div>
						{selectedCoupon ? (
							<div className="selected-coupon flex-row">
								<h6 className="text-reg order-total-head">
								Giảm giá áp dụng:
								</h6>
								<p>{selectedCoupon?.discount}%</p>
							</div>
						) : null}
						<div className="order-total flex-row">
							<h6 className="text-reg order-date-head">
							Ngày đặt hàng:
							</h6>
							<p>{new Date(createdAt).toLocaleString()}</p>
						</div>
						<div className="shipping-address">
							<h6 className="text-reg shipping-address-head">
							Gửi hàng đến
							</h6>
							<AddressItem
								address={address}
								page={"orderSummary"}
							/>
						</div>
					</div>
					<div className="order-items flex-col flex-justify-start flex-align-center">
						{items.map((item) => (
							<Link
								to={`/products/${item?._id}`}
								className="item card card-horizontal p-0-75"
								key={item?.id}
							>
								<div className="card-description flex-col flex-align-start flex-justify-center">
									<div className="flex-col mb-0-75">
										<h6 className="text-reg">
											{item?.title}
										</h6>
										<h6 className="text-xs gray-color">
											{item?.author}
										</h6>
									</div>
									<p className="text-sm flex-row">
										<span>Số lượng:</span>
										<span>{item?.qty}</span>
									</p>
									<p className="text-sm flex-row">
										<span>Giá mặt hàng:</span>
										<span>
											
											<span>
												{getFormattedSellingPrice(
													item?.originalPrice,
													item?.discountPercent
												)} đ
											</span>
										</span>
									</p>
								</div>
								<div className="card-header">
									<img
										src={item?.coverImg[0]}
										alt={`${item?.title} cover`}
									/>
								</div>
							</Link>
						))}
					</div>
				</div>
			) : (
				<div className="text-center mt-2">
					<h4>Không tìm thấy đơn đặt hàng!</h4>
					<Link
						to="/products"
						className="btn btn-primary p-0-25 mx-auto mt-1"
					>
						Mua sắm nhiều hơn!
					</Link>
				</div>
			)}
		</section>
	);
};

export { OrderItem };
