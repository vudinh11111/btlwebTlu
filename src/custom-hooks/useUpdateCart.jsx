import React from "react";

import { useToast } from "./useToast";
import { useCart, useAuth } from "contexts/";
import { updateProductInCart } from "services";

const useUpdateCart = () => {
	const { showToast } = useToast();
	const { cartDispatch } = useCart();
	const {
		authState: { token },
	} = useAuth();

	const callUpdateProductInCart = async (
		_id,
		operation,
		showToastAfterCall = true
	) => {
		try {
			const {
				data: { cart },
			} = await updateProductInCart(_id, token, operation);

			if (showToastAfterCall)
				showToast("Số lượng mặt hàng được cập nhật trong giỏ hàng!", "success");

			cartDispatch({
				type: "SET_CART_ITEMS",
				payload: {
					cartItems: cart,
					error: null,
					loading: false,
				},
			});
			return true;
		} catch (error) {
			showToast(
				"Không thể cập nhật số lượng mặt hàng trong giỏ hàng. Vui lòng thử lại sau.",
				"error"
			);
		}
		return false;
	};

	return { callUpdateProductInCart };
};

export { useUpdateCart };
