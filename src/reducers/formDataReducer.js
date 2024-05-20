const dummyAddressData = {
	name: "Nguyễn Văn A",
	addressLine: "Lãng Ngâm - Gia Bình - Bắc Ninh",
	city: "Bắc Ninh",
	state: "Việt Nam",
	pincode: "16716",
	phoneNumber: "0123456789",
};

const formDataReducerFunction = (state, { type, payload }) => {
	switch (type) {
		case "SET_FORM_DATA":
			return { ...state, [payload.name]: payload.value };
		case "SET_DUMMY_ADDRESS":
			return { ...dummyAddressData };
	}
};

export { formDataReducerFunction };
