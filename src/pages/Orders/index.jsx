import React from "react";
import { Link } from "react-router-dom";

import { useOrders } from "contexts";
import { OrderItem } from "components";
import loadingImage from "assets/images/loader.svg";

const Orders = () => {
	const { orders, ordersLoading, ordersError } = useOrders();

	return (
		<main className="main order-summary-main my-2 mx-auto px-3 py-2">
			{ordersLoading ? (
				<img
					src={loadingImage}
					alt="Loading svg"
					className="img img-responsive mx-auto loader-img"
				/>
			) : ordersError ? (
				<h1 className="error text error-color my-2 text-center loader-error">
					{ordersError}
				</h1>
			) : (
				<>
					<div className="text-center">
						<h2 className="main-head mb-2">Đơn đặt hàng của tôi</h2>
					</div>

					{orders?.length ? (
						<div className="orders-list flex-col flex-justify-start flex-align-center">
							{orders?.map((order) => (
								<OrderItem
									order={order}
									key={order.orderId}
									page={"orders"}
								/>
							))}
						</div>
					) : (
						<div className="mx-auto text-center">
							<h5>Không tìm thấy đơn đặt hàng!</h5>
						</div>
					)}
					<Link
						to="/products"
						className="btn btn-primary p-0-25 mt-1 mx-auto"
					>
						Cửa hàng {orders?.length ? "vào" : "ngay bây giờ"}
					</Link>
				</>
			)}
		</main>
	);
};

export { Orders };
