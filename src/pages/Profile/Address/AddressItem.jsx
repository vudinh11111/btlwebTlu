import React, { useState } from "react";

import { useAddress, useAuth } from "contexts";
import { deleteAddress } from "services";
import { useToast } from "custom-hooks";
import ProfileCSS from "../Profile.module.css";

const AddressItem = ({ address, page }) => {
	const { addressCityState, addressItem, buttonsContainer } = ProfileCSS;
	const { addressDispatch } = useAddress();
	const { showToast } = useToast();
	const {
		authState: { token },
	} = useAuth();

	const [isOngoingNetworkCall, setIsOngoingNetworkCall] = useState(false);

	const handleAddressEdit = (event) => {
		event.stopPropagation();

		addressDispatch({
			type: "SET_ADDRESS_MODAL_VISIBILITY",
			payload: { modalVisibility: true, addressToEdit: address._id },
		});
	};

	const handleAddressDelete = async (event) => {
		event.stopPropagation();

		setIsOngoingNetworkCall(true);

		try {
			const {
				data: { address: addresses },
			} = await deleteAddress(token, address._id);

			addressDispatch({
				type: "SET_ADDRESSES",
				payload: { addresses },
			});

			showToast("Địa chỉ đã xóa thành công.", "success");
		} catch (error) {
			setIsOngoingNetworkCall(false);
			showToast(
				"Không xóa được địa chỉ. Vui lòng thử lại sau.",
				"error"
			);
		}
	};

	return (
		<div
			className={`${addressItem} ${
				page === "orderSummary" ? "py-0" : "py-2"
			} flex-col flex-align-start flex-justify-center text-left`}
		>
			<span>{address.name}</span>
			<span>{address.addressLine}</span>
			<div
				className={`${addressCityState} flex-row flex-justify-start flex-align-center`}
			>
				<span>{address.city},</span>
				<span>{address.state},</span>
				<span>{address.pincode}</span>
			</div>
			<span>{address.phoneNumber}</span>
			{page === "checkout" || page === "orderSummary" ? null : (
				<div
					className={`${buttonsContainer} mt-1 flex-row flex-align-center flex-justify-start`}
				>
					<button
						className="btn btn-primary p-0-25 text-reg"
						onClick={handleAddressEdit}
					>
						Sửa
					</button>
					<button
						className="btn btn-primary btn-outline p-0-25 text-reg"
						onClick={handleAddressDelete}
						disabled={isOngoingNetworkCall}
					>
						Xóa
					</button>
				</div>
			)}
		</div>
	);
};

export { AddressItem };
