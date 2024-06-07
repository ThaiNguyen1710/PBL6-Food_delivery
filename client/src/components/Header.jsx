import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logo, avatar, logo2, shoppingStore } from "../assets";
import {
  gradientStyle,
  isActiveStyles,
  isNotActiveStyles,
} from "../utils/styles";
import { motion } from "framer-motion";
import { buttonClick, slideTop } from "../animations";
import { MdShoppingCart, MdLogout } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
// import { getAuth } from "firebase/auth";
// import { app } from "../config/firebase.config";
import { setUserDetail } from "../context/actions/userActions";
import { setCartOn } from "../context/actions/displayCartAction";
import { baseURL } from "../api";

const Header = () => {
  const user = useSelector((state) => state.user);
  const allUser = useSelector((state) => state.allUsers);
  const cart = useSelector((state) => state.cart);

  const [isMenu, setIsMenu] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signOut = () => {
    localStorage.removeItem("token");
    dispatch(setUserDetail(null));
    navigate("/login", { replace: true });
  };

  const [userCart, setUserCart] = useState([]);
  const [userLogin, setUserLogin] = useState([]);

  useEffect(() => {
    if (cart && user && user.user && user.user.userId && allUser) {
      const filteredCart = cart?cart.filter(
        (item) => item.user && item.user.id === user.user.userId
      ):[];
      setUserCart(filteredCart);
    }
    if ( user && user.user && user.user.userId&& allUser) {
      const filteredUser = allUser?allUser.filter((userLogin)=>userLogin &&userLogin.id === user.user.userId):[]
      setUserLogin(filteredUser);
    }
  }, [cart, user,allUser]);

  return (
    <header className="fixed backdrop-blur-md z-50 inset-x-0 top-0 flex justify-between items-center px-12 md:px-20 sm:px-1 py-2 ">
      <NavLink to={"/"} className="flex items-center justify-center gap-4">
        <img src={logo2} className="w-16 " alt="" />
        <p className="font-semibold text-3xl" style={gradientStyle}>
          EatEase
        </p>
      </NavLink>

      <nav className="flex justify-center items-center  gap-4">
        <ul className="hidden md:flex justify-center items-center sm:flex">
          <NavLink
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
            to={"/"}
          >
            Trang chủ
          </NavLink>
          {user ? (
      user.user && user.user.isStore === true ? (
        <NavLink
          className={({ isActive }) =>
            isActive ? isActiveStyles : isNotActiveStyles
          }
          to={"/my-store/home"}
        >
          <div className="flex items-center">
            <img alt="" src={shoppingStore} className="w-10 h-10 mr-2" />
            My Store
          </div>
        </NavLink>
      ) : (
        <NavLink
        className={({ isActive }) =>
          isActive ? isActiveStyles : isNotActiveStyles
        }
        to={"/menu"}
        onClick={() => {
          const homeSlider = document.getElementById("homeSlider");
          if (homeSlider) {
            homeSlider.scrollIntoView({ behavior: "smooth" });
          }
        }}
      >
        Khám Phá
      </NavLink>
      )
    ) : null}

          <NavLink
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
            to={"/contact/aboutUs"}
          >
            Liên Hệ
          </NavLink>
        </ul>
        <motion.div
          {...buttonClick}
          onClick={() => dispatch(setCartOn())}
          className="relative cursor-pointer"
        >
          <MdShoppingCart className="text-3xl items-center justify-center" />
          {cart?.length > 0 && (
            <div className="rounded-full bg-red-500 w-6 h-6 flex items-center justify-center absolute -top-5 -right-1 ">
              <p className="text-primary text-base font-semibold">
                {userCart.length}
              </p>
            </div>
          )}
        </motion.div>

        {user ? (
          <> 
            <div className="relative cursor-pointer ">
             
              <div className="rounded-full  shadow-md overflow-hidden w-12 h-12 cursor-pointer  flex items-center justify-end">
                <motion.img
                  onMouseEnter={() => setIsMenu(true)}
                  className="w-full h-full object-cover"
                  src={baseURL+userLogin?.[0]?.image ? baseURL+userLogin?.[0]?.image : avatar}
                  whileHover={{ scale: 1.15 }}
                  referrerPolicy="no-referrer"
                ></motion.img>
              
                {isMenu && (
                  <motion.div
                    {...slideTop}
                    onMouseLeave={() => setIsMenu(false)}
                    className="px-4 py-6 bg-cardOverlay absolute top-12 -right-28 rounded-md backdrop-blur-md shadow-sm flex flex-col gap-4"
                  >
                    {user?.user?.userId === "655b5b0af25e95d6494625c5" && (
                      <Link
                        className="hover:text-red-400 text-xl text-textColor"
                        to={"/dashboard/home"}
                      >
                        Dashboard
                      </Link>
                    )}

                    <Link
                      className="hover:text-red-400 text-xl text-textColor"
                      to={"/profile"}
                    >
                      My Profile
                    </Link>
                    <Link
                      className="hover:text-red-400 text-xl text-textColor"
                      to={"/user-orders"}
                    >
                      Orders
                    </Link>
                    {/* {user?.user?.isStore === true && (
                      <Link
                        className="hover:text-red-400 text-xl text-textColor"
                        to={"/my-store/home"}
                      >
                        My Store
                      </Link>
                    )} */}
                    <hr />
                    <motion.div
                      {...buttonClick}
                      onClick={signOut}
                      className="group flex px-3 py-2 items-center justify-center rounded-md shadow-md bg-gray-100 hover:bg-gray-200 gap-3"
                    >
                      <MdLogout className="text-2xl text-textColor group-hover::text-headingColor" />
                      <p className="text-xl text-textColor group-hover:text-headingColor">
                        SignOut
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </div>
            <div className="items-center justify-center  ">
                
          <p className="text-base text-headingColor font-semibold w-12 text-center h-full">{userLogin?.[0]?.name?userLogin?.[0]?.name:null}</p>
            </div>
          </>
        ) : (
          <>
            <NavLink to={"/login"}>
              <motion.div
                {...buttonClick}
                className="px-4 py-2 text-2 rounded-md bg-cardOverlay border border-red-400 cursor-pointer"
              >
                Login
              </motion.div>
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;