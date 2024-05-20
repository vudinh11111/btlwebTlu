const validateAddressData = (formData, formDataErrorDispatch) => {
	const { name, addressLine, city, state, pincode, phoneNumber } = formData;

	if (name.trim().length < 2) {
		formDataErrorDispatch({
			type: "SET_ERROR",
			payload: {
				name: "nameError",
				value: "Nhập tên hợp lệ. Nên chứa ít nhất 2 ký tự.",
			},
		});
		return false;
	}

	if (!name.trim().length || !/^[\p{L}\p{M}]+(\s*[\p{L}\p{M}]+)*$/u.test(name)) {
		formDataErrorDispatch({
			type: "SET_ERROR",
			payload: {
				name: "nameError",
				value: "Nhập tên hợp lệ. Chỉ nên chứa các chữ cái và dấu.",
			},
		});
		return false;
	}




	if (addressLine.trim().length < 10) {
		formDataErrorDispatch({
			type: "SET_ERROR",
			payload: {
				name: "addressLineError",
				value: "Nhập địa chỉ hợp lệ. Nên chứa ít nhất 10 ký tự.",
			},
		});
		return false;
	}

	if (city.trim().length < 2) {
		formDataErrorDispatch({
			type: "SET_ERROR",
			payload: {
				name: "cityError",
				value: "Nhập tên thành phố hợp lệ. Nên chứa ít nhất 2 ký tự.",
			},
		});
		return false;
	}

	if (!city.trim().length || !/^[A-Za-z]+(\s*[\w*,*])*$/.test(city)) {
		formDataErrorDispatch({
			type: "SET_ERROR",
			payload: {
				name: "cityError",
				value: "Nhập tên thành phố hợp lệ. Chỉ nên chứa các chữ cái.",
			},
		});
		return false;
	}

	if (state.trim().length < 2) {
		formDataErrorDispatch({
			type: "SET_ERROR",
			payload: {
				name: "stateError",
				value: "Nhập tên tiểu bang hợp lệ. Nên chứa ít nhất 2 ký tự.",
			},
		});
		return false;
	}

	if (!state.trim().length || !/^[A-Za-z]+(\s*\w*,*.*)*$/.test(state)) {
		formDataErrorDispatch({
			type: "SET_ERROR",
			payload: {
				name: "stateError",
				value: "Nhập tên tiểu bang hợp lệ. Chỉ nên chứa các chữ cái.",
			},
		});
		return false;
	}

	if (!pincode.toString().trim().length || !/^\d{6}$/.test(pincode)) {
		formDataErrorDispatch({
			type: "SET_ERROR",
			payload: {
				name: "pincodeError",
				value: "Nhập mã pin hợp lệ. Chỉ nên chứa 6 số.",
			},
		});
		return false;
	}

	if (
		!phoneNumber.toString().trim().length ||
		!/^0\d{9}$/.test(phoneNumber)
	) {
		formDataErrorDispatch({
			type: "SET_ERROR",
			payload: {
				name: "phoneNumberError",
				value: "Nhập số điện thoại hợp lệ. Số điện thoại hợp lệ chứa 10 chữ số và bắt đầu bằng 0.",
			},
		});
		return false;
	}


	return true;


	return true;
};

export { validateAddressData };
