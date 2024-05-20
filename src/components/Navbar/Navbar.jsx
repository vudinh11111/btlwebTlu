import React, { useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Close, Search } from "@mui/icons-material";
import HomeIcon from '@mui/icons-material/Home';
import { useAuth, useCart, useFilter, useWishList } from "contexts";
import { getCartItemsTotal } from "utils";
import { useOutsideClick, useToast } from "custom-hooks";
import { AccountOptions } from "components";
import "./navbar.css";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
const Navbar = () => {
	const { authState } = useAuth();
	const { isAuth } = authState;
	const navigate = useNavigate();
	const location = useLocation();
	const {
		wishListState: { wishListItems },
	} = useWishList();
	const {
		cartState: { cartItems },
	} = useCart();

	const {
		filterState: { searchText },
		filterDispatch,
	} = useFilter();

	const drawerReference = useRef(null);

	const [mobileNavbarOpen, setMobileNavbarOpen] = useState(false);
	const [showSearchDrawer, setShowSearchDrawer] = useState(false);

	const handleNavbarStateChange = (e) => {
		e.stopPropagation();
		setMobileNavbarOpen((prevMovileNavbarOpen) => !prevMovileNavbarOpen);
	};

	const handleShowSearchDrawerChange = (isShown) => {
		setShowSearchDrawer(isShown);
	};

	const navigateToProducts = (event) => {
		event.preventDefault();
		if (searchText.trim() !== "" && location.pathName !== "/products") {
			navigate("/products");
		}
		handleShowSearchDrawerChange(false);
	};

	const handleChangeSearchText = (event) => {
		filterDispatch({
			filterType: "SET_SEARCH_TEXT",
			filterPayload: event.target.value,
		});
		if (searchText.trim() !== "" && location.pathName !== "/products") {
			navigate("/products");
		}
	};

	const totalCartItems = isAuth
		? cartItems?.length
			? getCartItemsTotal(cartItems, "TOTAL_ITEMS")
			: 0
		: 0;
	const totalWishListItems = isAuth
		? wishListItems?.length
			? wishListItems.length
			: 0
		: 0;

	useOutsideClick(drawerReference, () => setMobileNavbarOpen(false));

	return (
		<nav className="navbar">
			<div className="navbar-wrapper flex-row flex-align-center mx-auto flex-justify-between">
				<button
					className="hamburger btn btn-link nav-link"
					onClick={handleNavbarStateChange}
				>
					<i className="fa-solid fa-bars fa-icon"></i>
				</button>
				<h4 className="logo flex-col flex-align-center flex-justify-center">
					<Link to="/" className="nav-link btn btn-link">
					<img style={{height:"70px",width:"70px"}} src="https://s3-alpha-sig.figma.com/img/0fc4/c1bd/682eccf8d6c5e3ed3e5df02dab272608?Expires=1716768000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=d5wjLWbPGj0j~9ubT4G0kOPrA9eG8X7~aaURUXFA55fFbSN0MFwua-eoTn6~yoT8W7JnBpD2d3Rl0gTUMqVhtfb6F4rZRnlFcFZI8RrHxt--VigOatw4D99HD0y3SYaHRLc~hjaGDEa~nkPSRWWLbjIl2hXCyT9C3JsXDSFozLEyEqVSa-WEaSjsfYxKW9giY5~LkTX3z19u8cZKDpAzR-sMca03BrdfHKKCO6FS9--ala7QX4zk~xOUpCyFTpITAO04zOyRuig9eR4jkPv3M6r8iifIp9MsI8owh3eRoGosVFZvewgiyaYaYl6wyrKlRvzbQllzr9VEJveIvvNVUg__" alt="User Icon"/>

					</Link>
				</h4>
				
				<div
					className={`mobile-navbar-drawer ${mobileNavbarOpen ? "navbar-open" : "navbar-close"
						}`}
				>
					<ul
						className="navlinks-mobile list-style-none flex-col flex-align-start flex-justify-start py-2 px-2"
						ref={drawerReference}
					>
						<li className="list-item py-1-5">
							<h3 className="flex-col flex-align-start flex-justify-center">
								<Link
									to="/"
									className="logo nav-link btn btn-link"
								>
									Tiki
								</Link>
							</h3>
						</li>
						<li className="list-item py-1-5">
							<NavLink
								to="/"
								className="nav-link main-nav-link btn btn-link flex-col flex-align-center flex-justify-center text-xs"
							>
								Trang chủ
							</NavLink>
						</li>
						<li className="list-item py-1-5">
							<NavLink
								to="/products"
								className="nav-link main-nav-link btn btn-link flex-col flex-align-center flex-justify-center text-xs"
							>
								Shop
							</NavLink>
						</li>
					</ul>
				</div>

				<div
					className={`search-container ${showSearchDrawer
							? "show-search-drawer"
							: "hide-search-drawer"
						}`}
				>
					<button
						className="btn btn-icon"
						onClick={() => handleShowSearchDrawerChange(false)}
					>
						<Close className="close-icon" />
					</button>
					

				</div>

				<ul className="list list-inline flex-align-center">
				<span>
				<div className="list-item flex-col flex-align-center flex-justify-center">
						<form onSubmit={navigateToProducts}>
							
							<div className="input-group input-search-group input-default input-inline">
								<label
									className="text-label flex-row flex-align-center flex-justify-between p-0-5 px-0-5"
									htmlFor="input-inline-search"
								>
									<input 
										type="search"
										id="input-inline-search"
										className="input-text"
										placeholder="Tìm sách"
										value={searchText}
										onChange={handleChangeSearchText}
									/>
									<button
										type="submit"
										className="btn btn-icon btn-search-submit flex-row flex-align-center"
									>
										<Search className="mobile-search-icon" />
									</button>
								</label>
								<span className="text-message"></span>
							</div>
						</form>
					</div>
								</span>
					
					<li className="list-item">
						<NavLink
							to="/"
							className="off nav-link main-nav-link btn btn-link flex-col flex-align-center flex-justify-center"
						>
							<HomeIcon></HomeIcon>
						</NavLink>
					</li>
					
					<li className="list-item badge-container flex-col flex-align-center flex-justify-center">
						<div className="badge-icon">
							<NavLink
								to="/cart"
								className="nav-link btn btn-link flex-col flex-align-center flex-justify-center"
							>
								<ShoppingCartIcon/>
							</NavLink>
						</div>
						
						<span className="badge-status badge-primary badge-notification p-0-25 flex-col flex-align-center flex-justify-center">
							{totalCartItems > 9 ? "9+" : totalCartItems}
						</span>
					</li>

				
					<AccountOptions />
				</ul>
			</div>
			
		</nav>
		
	);
};

export { Navbar };
