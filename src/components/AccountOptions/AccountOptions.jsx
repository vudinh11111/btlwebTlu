import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';
import {
	useAddress,
	useAuth,
	useCart,
	useFilter,
	useOrders,
	useWishList,
} from "contexts";
import { useOutsideClick, useToast } from "custom-hooks";

const AccountOptions = ({}) => {
	const { authState, setAuthState, logoutUser } = useAuth();
	const { isAuth } = authState;
	const { showToast } = useToast();
	const location = useLocation();
	const navigate = useNavigate();
	const [showAccountOptionsDrawer, setShowAccountOptionsDrawer] =
		useState(false);

	useEffect(() => {
		if (showAccountOptionsDrawer) setShowAccountOptionsDrawer(false);
	}, [location?.pathname]);

	const handleShowAccountOptionsChange = (event) => {
		event.stopPropagation();
		setShowAccountOptionsDrawer(
			(prevShowAccountOptions) => !prevShowAccountOptions
		);
	};

	const accountOptionsReference = useRef(null);
	useOutsideClick(accountOptionsReference, () =>
		setShowAccountOptionsDrawer(false)
	);

	const handleAuth = () => {
		if (isAuth) {
			logoutUser();
			showToast("Đăng xuất thành công.", "success");
		}
		navigate("/login");
	};

	return (
		<li
			className="list-item
            flex-col
            flex-align-center
            flex-justify-center"
			ref={accountOptionsReference}
		>
			<button
				className="nav-link btn btn-link flex-col flex-align-center flex-justify-center"
				onClick={handleShowAccountOptionsChange}
			>
				<PersonIcon/>
			</button>
			{showAccountOptionsDrawer ? (
				<ul className="account-details-options list list-style-none">
					<li className="list-item p-0-5">
						<Link className="btn btn-link text-reg" to="/profile">
							Cá nhân
						</Link>
					</li>
					<li className="list-item p-0-5">
						<button
							className="btn btn-link text-reg"
							onClick={handleAuth}
						>
							{isAuth ? "Thoát" : "Đăng nhập"}
						</button>
					</li>
				</ul>
			) : null}
		</li>
	);
};

export { AccountOptions };
