import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";

import { useAuth, useCart, useOrders } from "contexts";
import ProfileCSS from "pages/Profile/Profile.module.css";
import { clearCartItems, postNewOrder } from "services";
import { useToast } from "custom-hooks";

const CheckoutSummary = () => {
	const {
		cartState: { checkoutData, selectedCoupon },
		cartDispatch,
	} = useCart();

	const navigate = useNavigate();
	const {
		authState: { token, user },
	} = useAuth();

	const { ordersDispatch } = useOrders();
	const { addressCityState, addressItem } = ProfileCSS;
	const { showToast } = useToast();

	const [isOngoingNetworkCall, setIsOngoingNetworkCall] = useState(false);

	const placeOrder = async (order) => {
		let orderId = uuid();
		orderId =
			orderId.split("-")?.length >= 3
				? orderId.split("-").slice(0, 3).join("-")
				: orderId;

		setIsOngoingNetworkCall(true);
		
		
		try {
			const {
				data: { orders },
			} = await postNewOrder(token, {
				...order,
				orderId,
				selectedCoupon,
			});
			
			ordersDispatch({
				type: "SET_ORDERS",
				payload: { orders },
			});
			showToast("Đặt hàng thành công!", "success");

			const {
				data: { cart },
			} = await clearCartItems(token);

			cartDispatch({
				type: "INIT_CART_ITEMS",
				payload: {
					carItems: cart,
					loading: false,
					error: null,
				},
			});

			navigate(`/order-summary/${orderId}`);
		} catch (error) {
			setIsOngoingNetworkCall(false);
			showToast(
				"Không thể đặt hàng. Vui lòng thử lại sau.",
				"error"
			);
		}
	};

	const handlePlaceOrder = () => {
   
    const order = {
        ...checkoutData,
    };
   console.log(order);
    placeOrder(order);
};

	const totalPrice = checkoutData?.price;

	return (
		<section className="checkout-container checkout-order p-2 flex-col flex-align-start flex-justify-start">
			<div className="flex-col mb-1-5 order-details">
				<h6 className="section-head pb-0-5 text-left">Chi tiết đơn hàng</h6>
				<div className="flex-row order-items-head flex-justify-between flex-align-center pt-0-75 pb-0-25">
					<h6 className="item-head">Sản phẩm</h6>
					<h6 className="item-head text-right">Số lượng</h6>
				</div>
				{checkoutData?.items?.map((item) => (
					<div
						className="flex-row order-item flex-justify-between flex-align-start py-0-25"
						key={item.id}
					>
						<p className="text-reg item-head">{item.title}</p>
						<p className="text-reg item-content text-right">
							{item.qty}
						</p>
					</div>
				))}
			</div>
			<div className="flex-col mb-1-5 order-details">
				<h6 className="section-head pb-0-5 text-left">Chi tiết giá cả</h6>
				<div className="flex-row order-items-head flex-justify-between flex-align-center pt-0-75 pb-0-25">
					<h6 className="item-head">Tổng</h6>
					<h6 className="item-head text-right">
						{(parseInt(totalPrice)).toLocaleString("en-IN", {
							minimumFractionDigits: 3,
							maximumFractionDigits: 3,
						})} đ
					</h6>
				</div>
			</div>
			<div className="flex-col order-details">
				<h6 className="section-head text-left pb-0-5">
					Chi tiết giao hàng
				</h6>
				<div className="flex-row order-items-head flex-justify-between flex-align-center pt-0-75 pb-0-25">
					{!checkoutData?.address ? (
						<h6 className="item-head">
							Chi tiết giao hàng không được chọn
						</h6>
					) : (
						<div
							className={`${addressItem} flex-col flex-align-start flex-justify-center text-left`}
						>
							<h6 className="item-head">
								{checkoutData?.address.name}
							</h6>
							<span>{checkoutData?.address.addressLine}</span>
							<div
								className={`${addressCityState} flex-row flex-justify-start flex-align-center`}
							>
								<span>{checkoutData?.address.city},</span>
								<span>{checkoutData?.address.state},</span>
								<span>{checkoutData?.address.pincode}</span>
							</div>
							<span>{checkoutData?.address.phoneNumber}</span>{" "}
						</div>
					)}
				</div>
			</div>
			<button
				className="btn btn-full-width mt-1 py-0-25 px-0-5 text-reg"
				disabled={!checkoutData?.address || isOngoingNetworkCall}
				onClick={handlePlaceOrder}
			>
				Đặt hàng
			</button>
		</section>
	);
};

export { CheckoutSummary };
