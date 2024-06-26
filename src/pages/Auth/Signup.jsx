import React, { useEffect, useReducer, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { initiateSignup } from "services";
import { useToast, useDocumentTitle } from "custom-hooks";
import { useAuth } from "contexts/";
import "./auth.css";
import { isSignupDataValid } from "utils";

const Signup = () => {
	const initialFormData = {
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
	};

	const [formData, setFormData] = useState(initialFormData);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isOngoingNetworkCall, setIsOngoingNetworkCall] = useState(false);

	const navigate = useNavigate();
	const { state } = useLocation();

	const { showToast } = useToast();
	const {
		setAuthState,
		authState: { isAuth },
	} = useAuth();

	const { setDocumentTitle } = useDocumentTitle();

	const initialErrorState = {
		firstNameError: null,
		lastNameError: null,
		usernameError: null,
		passwordError: null,
		confirmPasswordError: null,
	};

	const errorReducer = (state, { type, payload: { error, errorValue } }) => {
		switch (type) {
			case "RESET_ERROR_STATES":
				return { ...initialErrorState };
			case "SET_ERROR":
				return { ...state, [error]: errorValue };
		}
	};
	const [formDataError, setFormDataError] = useReducer(
		errorReducer,
		initialErrorState
	);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (isAuth) {
			navigate(state?.from ? state.from : "/");
		}
		setDocumentTitle("sách | Đăng kí");
	}, []);

	const handleFormDataChange = (event) => {
		const { name, value } = event.target;
		if (name === "password" || name === "confirmPassword") {
			if (name === "confirmPassword") {
				if (password && password !== value) {
					setError("Passwords do not match");
				} else setError(null);
			} else {
				if (name === "password") {
					if (confirmPassword && confirmPassword !== value) {
						setError("Passwords do not match");
					} else setError(null);
				}
			}
		}
		if (formDataError[name + "Error"]) {
			setFormDataError({
				type: "SET_ERROR",
				payload: { error: name + "Error", errorValue: null },
			});
		}
		setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
	};

	const handleFormSubmit = async (event) => {
		event.preventDefault();
		if (
			!isSignupDataValid(
				firstName,
				lastName,
				password,
				confirmPassword,
				setFormDataError,
				setError
			)
		) {
			return;
		}
		if (confirmPassword !== password) {
			return;
		}
		setIsOngoingNetworkCall(true);
		try {
			await initiateSignup(formData);
			showToast("Đăng kí thành công", "success");
			navigate("/login", { replace: true });
		} catch (error) {
			if (error.message.includes("422"))
				showToast("Email đã tồn tại!", "error");
			else showToast("Đăng ký không thành công. Hãy thử lại sau.", "error");
			setIsOngoingNetworkCall(false);
		}
	};

	const handleChangePasswordVisibility = () =>
		setShowPassword((prevShowPassword) => !prevShowPassword);
	const handleChangeConfirmPasswordVisibility = () =>
		setShowConfirmPassword(
			(prevShowConfirmPassword) => !prevShowConfirmPassword
		);

	const showPasswordIcon = showPassword ? (
		<VisibilityOffIcon />
	) : (
		<VisibilityIcon />
	);
	const showConfirmPasswordIcon = showConfirmPassword ? (
		<VisibilityOffIcon />
	) : (
		<VisibilityIcon />
	);

	const { firstName, lastName, email, password, confirmPassword } = formData;
	const {
		firstNameError,
		lastNameError,
		passwordError,
		confirmPasswordError,
	} = formDataError;

	return (
		<section className="auth-main flex-col flex-align-center flex-justify-center mx-auto py-2 px-3">
			<div className="auth-wrapper">
				<article className="auth-container signup-container mx-auto mb-1 px-1-5 py-2">
					<h3 className="text-center text-uppercase auth-head mb-2">
						Đăng kí
					</h3>
					<form
						className="auth-form px-1 flex-col flex-align-center flex-justify-center"
						onSubmit={handleFormSubmit}
					>
						<div className="input-group input-default mx-auto">
							<label
								className="text-label text-reg flex-col mx-auto"
								htmlFor="input-signup-fname"
							>
								Tên
								<input
									type="text"
									id="input-signup-fname"
									className="input-text text-sm px-0-75 py-0-25 mt-0-25"
									placeholder="Vũ"
									name="firstName"
									onChange={handleFormDataChange}
									value={firstName}
									required
								/>
							</label>
							<span className="text-message mt-0-5 error-color">
								{firstNameError}
							</span>
						</div>
						<div className="input-group input-default mx-auto">
							<label
								className="text-label text-reg flex-col mx-auto"
								htmlFor="input-signup-lname"
							>
								Họ
								<input
									type="text"
									id="input-signup-lname"
									className="input-text text-sm px-0-75 py-0-25 mt-0-25"
									placeholder="Đinh"
									name="lastName"
									onChange={handleFormDataChange}
									value={lastName}
									required
								/>
							</label>
							<span className="text-message mt-0-5  error-color">
								{lastNameError}
							</span>
						</div>
						<div className="input-group input-default mx-auto">
							<label
								className="text-label text-reg flex-col mx-auto"
								htmlFor="input-login-email"
							>
								Email
								<input
									type="email"
									id="input-login-email"
									className="input-text text-sm px-0-75 py-0-25 mt-0-25"
									placeholder="dinhvietvu15032004@gmail.com"
									name="email"
									onChange={handleFormDataChange}
									value={email}
									required
								/>
							</label>
							<span className="text-message mt-0-5"></span>
						</div>
						<div className="input-group input-default mx-auto">
							<label
								className="text-label text-reg flex-col mx-auto text-sm"
								htmlFor="input-psd"
							>
								Mật khẩu
								<span className="password-input-toggler">
									<input
										type={`${
											showPassword ? "text" : "password"
										}`}
										id="input-psd"
										className="input-text px-0-75 py-0-25 mt-0-25 text-sm"
										placeholder="********"
										autoComplete="off"
										name="password"
										onChange={handleFormDataChange}
										value={password}
										required
									/>
									<button
										type="button"
										className={`btn btn-icon icon-show-psd ${
											isOngoingNetworkCall &&
											"btn-disabled"
										}`}
										onClick={handleChangePasswordVisibility}
									>
										<span className="icon mui-icon">
											{showPasswordIcon}
										</span>
									</button>
								</span>
							</label>
							<span className="text-message mt-0-5 error-color">
								{passwordError}
							</span>
						</div>
						<div className="input-group input-default mx-auto">
							<label
								className="text-label text-reg flex-col mx-auto text-sm"
								htmlFor="input-psd"
							>
								Nhập lại mật khẩu
								<span className="password-input-toggler">
									<input
										type={`${
											showConfirmPassword
												? "text"
												: "password"
										}`}
										id="input-confirm-psd"
										className="input-text px-0-75 py-0-25 mt-0-25 text-sm"
										placeholder="********"
										autoComplete="off"
										name="confirmPassword"
										onChange={handleFormDataChange}
										value={confirmPassword}
										required
									/>
									<button
										type="button"
										className={`btn btn-icon icon-show-psd ${
											isOngoingNetworkCall &&
											"btn-disabled"
										}`}
										onClick={
											handleChangeConfirmPasswordVisibility
										}
									>
										<span className="icon mui-icon">
											{showConfirmPasswordIcon}
										</span>
									</button>
								</span>
							</label>
							<span className="text-message mt-0-5  error-color">
								{confirmPasswordError}
							</span>
						</div>
						{error ? (
							<div className="error-message text-left error-color text-sm">
								{error}
							</div>
						) : null}
						<div className="psd-mgmt-container flex-row flex-align-center flex-justify-between flex-wrap">
							<label
								htmlFor="checkbox-remember"
								className="flex-row input-checkbox-remember flex-align-center text-sm"
							>
								<input
									type="checkbox"
									className="input-checkbox text-reg"
									id="checkbox-remember"
									required
								/>
								Tôi chấp nhận các điều khoản và điều kiện
							</label>
						</div>

						<div className="auth-button-container mt-0-25 mb-0-5 flex-col flex-align-center">
							<input
								type="submit"
								value="Đăng kí"
								className={`btn btn-primary px-0-75 py-0-25 btn-full-width text-reg ${
									isOngoingNetworkCall && "btn-disabled"
								}`}
							/>
							<Link
								to="/login"
								className={`btn btn-link btn-primary mt-0-75 ${
									isOngoingNetworkCall && "link-disabled"
								}`}
							>
								Bạn đã có tài khoản? Đăng nhập{" "}
								<span className="icon mui-icon icon-chevron-right">
									<ChevronRightIcon />
								</span>
							</Link>
						</div>
					</form>
				</article>
			</div>
		</section>
	);
};

export { Signup };
