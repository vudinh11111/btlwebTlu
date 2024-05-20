const isSignupDataValid = (
	firstName,
	lastName,
	password,
	confirmPassword,
	setFormDataError,
	setError
) => {
	let isValidData = true;
	const isMinPasswordLength = (password) => password.trim().length >= 7;
	const isMinNameLength = (name) => name.trim().length >= 2;

	const isPasswordValid = (passwordValue) =>
		/^(?=.{7,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!_*@#$%^&+=]).*$/.test(
			passwordValue
		);
	const isNameValid = (name) => /^[A-Za-z]{2,20}$/.test(name);

	if (!isMinNameLength(firstName)) {
		setFormDataError({
			type: "SET_ERROR",
			payload: {
				error: "firstNameError",
				errorValue:
					"Tên không hợp lệ. Tên phải có ít nhất 2 ký tự.",
			},
		});
		isValidData = false;
	}
	if (!isNameValid(firstName)) {
		setFormDataError({
			type: "SET_ERROR",
			payload: {
				error: "firstNameError",
				errorValue:
					"Tên không hợp lệ. Tên chỉ nên chứa các chữ cái.",
			},
		});
		isValidData = false;
	}

	if (!isMinNameLength(lastName)) {
		setFormDataError({
			type: "SET_ERROR",
			payload: {
				error: "lastNameError",
				errorValue:
					"Tên không hợp lệ. Tên phải có ít nhất 2 ký tự.",
			},
		});
		isValidData = false;
	}

	if (!isNameValid(lastName)) {
		setFormDataError({
			type: "SET_ERROR",
			payload: {
				error: "lastNameError",
				errorValue:
					"Tên họ không hợp lệ. Tên chỉ nên chứa các chữ cái.",
			},
		});
		isValidData = false;
	}

	if (!isMinPasswordLength(password)) {
		setFormDataError({
			type: "SET_ERROR",
			payload: {
				error: "passwordError",
				errorValue:
					"Mật khẩu không hợp lệ. Mật khẩu phải có ít nhất 7 ký tự.",
			},
		});
		isValidData = false;
	}

	if (!isPasswordValid(password)) {
		setFormDataError({
			type: "SET_ERROR",
			payload: {
				error: "passwordError",
				errorValue:
					"Mật khẩu không hợp lệ. Mật khẩu phải có ít nhất một chữ hoa, chữ thường, số và ký tự đặc biệt.",
			},
		});
		isValidData = false;
	}

	if (!isMinPasswordLength(confirmPassword)) {
		setFormDataError({
			type: "SET_ERROR",
			payload: {
				error: "confirmPasswordError",
				errorValue:
					"Mật khẩu xác nhận không hợp lệ. Xác nhận mật khẩu phải có ít nhất 7 ký tự.",
			},
		});
		isValidData = false;
	}

	if (!isPasswordValid(confirmPassword)) {
		setFormDataError({
			type: "SET_ERROR",
			payload: {
				error: "confirmPasswordError",
				errorValue:
					"Mật khẩu xác nhận không hợp lệ. Mật khẩu phải có ít nhất một chữ hoa, chữ thường, số và ký tự đặc biệt.",
			},
		});
		isValidData = false;
	}

	if (password.trim() !== confirmPassword.trim()) {
		setError("Mật khẩu không khớp");
		isValidData = false;
	}
	return isValidData;
};

export { isSignupDataValid };
