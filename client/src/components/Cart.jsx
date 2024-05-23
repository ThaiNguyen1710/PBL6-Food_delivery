import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { buttonClick, slideIn, staggerFadeInOut } from "../animations";
import { BiChevronsRight } from "react-icons/bi";
import { FcClearFilters } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { setCartOff } from "../context/actions/displayCartAction";
import { useState } from "react";
import { FaDongSign } from "react-icons/fa6";
import {
  alertDanger,
  alertNULL,
  alertSuccess,
} from "../context/actions/alertActions";
import {
  baseURL,
  clearAllCart,
  clearItem,
  decrementItemQuantity,
  getAllCartItems,
  incrementItemQuantity,
} from "../api";
import { setCartItems } from "../context/actions/cartAction";

import { useNavigate } from "react-router-dom";
const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const allUser = useSelector((state) => state.allUsers);

  const [total, setTotal] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [userCart, setUserCart] = useState([]);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const stores = allUser
    ? allUser.filter((store) => store.isStore === true)
    : [];

  useEffect(() => {
    let total = 0;
    let totalQuantity = 0;
    const filteredCart = cart
    ? cart.filter((item) => item && item.user && item.user.id === user.user.userId)
    : [];
  setUserCart(filteredCart);
  

    if (filteredCart && filteredCart.length > 0) {
      filteredCart.forEach((data) => {
        total += data.product.price * data.quantity;
        totalQuantity += data.quantity;
      });

      setTotal(total.toLocaleString("vi-VN"));
      setTotalQuantity(totalQuantity);
    }
  }, [cart, user]);

  const storeCarts = [];

  stores.forEach((store) => {
    const storeCart = {
      store,
      cartItems: userCart.filter(
        (cartItem) => cartItem.product.user.id === store.id
      ),
    };
    storeCarts.push(storeCart);
  });

  console.log(userCart);

  const clearAllItems = () => {
    clearAllCart(user?.user?.userId).then((data) => {
      dispatch(alertSuccess("Clear all success"));
      getAllCartItems().then((items) => {
        dispatch(setCartItems(items));
        let totalQuantity = 0;
        setTotalQuantity(totalQuantity);
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
      });
    });
  };
  const checkOut = () => {
    dispatch(setCartOff());
    navigate(`/checkout-success`); 
    
  };

  return (
    <motion.div
      {...slideIn}
      className="fixed z-50 -top-10 right-0 w-300 md:w-508 bg-cardOverlay backdrop-blur-md shadow-md h-screen"
    >
      <div className="w-full flex items-center justify-between py-4 pb-4 px-3">
        <motion.i
          {...buttonClick}
          onClick={() => dispatch(setCartOff())}
          className="cursor-pointer"
        >
          <BiChevronsRight className="text-[50px] text-textColor" />
        </motion.i>
        <p className="text-2xl text-headingColor font-semibold">Giỏ Hàng</p>
        <motion.i
          className="cursor-pointer"
          {...buttonClick}
          onClick={clearAllItems}
        >
          <FcClearFilters className="text-[30px] text-headingColor" />
        </motion.i>
      </div>
      <div className=" flex-1 flex flex-col w-full items-start justify-start rounded-t-3xl bg-zinc-900 h-full py-6 gap-3 relative">
        <p className="text-primary font-semibold text-xl px-4">
          Sản phẩm: {totalQuantity}
        </p>
        {cart && userCart.length > 0 ? (
          <>
            <div className="flex flex-col w-full items-start justify-start gap-3 h-[65%] overflow-y-scroll scrollbar-none px-4">
              {userCart.map((item, i) => (
                <CartItemCard key={i} index={i} data={item} />
              ))}
            </div>
            <div className="bg-zinc-800 rounded-t-[60px] w-full h-[35%] flex flex-col items-center justify-start px-4 py-6 gap-4">
              <div className=" w-full flex items-center justify-evenly">
                <p className="text-3xl text-zinc-50 font-semibold">Tổng: </p>
                <p className="text-3xl text-orange-500 font-semibold flex items-center justify-center gap-1">
                  {total}
                  <FaDongSign className="text-primary" />
                </p>
              </div>
              <motion.button
                className="w-[80%] h-12 rounded-full bg-orange-400 shadow-md items-center justify-center flex cursor-pointer"
                {...buttonClick}
                onClick={checkOut}
              >
                <p className="text-2xl font-semibold text-primary">
                  Thanh Toán
                </p>
              </motion.button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-4xl text-orange-400 font-semibold px-32">
              {" "}
              Không có sản phẩm nào
            </h1>
          </>
        )}
      </div>
    </motion.div>
  );
};

export const CartItemCard = ({ index, data }) => {
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);
  const allUser = useSelector((state) => state.allUsers);
  const [itemTotal, setItemTotal] = useState(0);
  const [itemCart, setItemCart] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const itemTotal = (data.product.price * data.quantity).toLocaleString(
      "vi-VN"
    );
    setItemTotal(itemTotal);

    const filterItem = cart
      ? cart.filter((item) => item.product.user.id === allUser.id)
      : [];
    setItemCart(filterItem);
  }, [cart]);

  const decrementCart = (productId) => {
    if (productId) {
      decrementItemQuantity(productId)
        .then((data) => {
          if (!data) {
            dispatch(alertSuccess("Cập nhật giỏ hàng!"));
            getAllCartItems(cart?.user?._id).then((items) => {
              if (items) {
                dispatch(setCartItems(items));
                setTimeout(() => {
                  dispatch(alertNULL());
                }, 3000);
              }
            });
          }
        })
        .catch(() => {
          dispatch(alertDanger("Failed to update the cart"));
          setTimeout(() => {
            dispatch(alertNULL());
          }, 3000);
        });
    }
    if (data.quantity === 1) {
      clearItem(productId)
        .then((data) => {
          if (!data) {
            dispatch(alertSuccess("Cập nhật giỏ hàng!"));
            getAllCartItems(cart?.user?._id).then((items) => {
              if (items) {
                dispatch(setCartItems(items));
                setTimeout(() => {
                  dispatch(alertNULL());
                }, 3000);
              }
            });
          }
        })
        .catch(() => {
          dispatch(alertDanger("Failed to update the cart"));
          setTimeout(() => {
            dispatch(alertNULL());
          }, 3000);
        });
    }
  };
  const incrementCart = (productId) => {
    if (productId) {
      incrementItemQuantity(productId)
        .then((data) => {
          if (!data) {
            dispatch(alertSuccess("Cập nhật giỏ hàng!"));
            getAllCartItems(cart?.user?._id).then((items) => {
              if (items) {
                dispatch(setCartItems(items));
                setTimeout(() => {
                  dispatch(alertNULL());
                }, 3000);
              }
            });
          } else {
            dispatch(alertDanger("Failed to update the cart"));
            setTimeout(() => {
              dispatch(alertNULL());
            }, 3000);
          }
        })
        .catch(() => {
          dispatch(alertDanger("Failed to update the cart"));
          setTimeout(() => {
            dispatch(alertNULL());
          }, 3000);
        });
    } else {
      dispatch(alertDanger("Invalid product ID"));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    }
  };

  return (
    <motion.div
      key={index}
      {...staggerFadeInOut(index)}
      className="w-full flex items-center justify-start bg-zinc-800 rounded-md drop-shadow-md px-4 gap-4"
    >
      <img
        src={baseURL + data.product.image}
        className="w-24 min-w-[94px] h-24 object-contain"
        alt=""
      />
      <div className="flex items-center justify-start gap-1 w-full">
        <p className=" text-lg text-primary font-semibold">
          {data?.product?.name}
          <span className=" text-sm block font-semibold text-gray-400 ">
            {data?.product?.category?.name}
          </span>
          <span className=" text-sm block font-semibold text-gray-400 ">
            Store : {data?.product?.user?.store}
          </span>
        </p>
        <p className="flex text-sm font-semibold text-red-400 ml-auto">
          {itemTotal}
          <FaDongSign className="text-sm" />
        </p>
      </div>
      <div className=" ml-auto flex items-center justify-center gap-3">
        <motion.div
          {...buttonClick}
          onClick={() => decrementCart(data?._id)}
          className="w-8 h-8 flex items-center justify-center rounded-md drop-shadow-md bg-zinc-900 cursor-pointer"
        >
          <p className="text-xl font-semibold text-primary">--</p>
        </motion.div>
        <p className=" text-lg text-primary font-semibold">{data?.quantity}</p>
        <motion.div
          {...buttonClick}
          onClick={() => incrementCart(data?._id)}
          className="w-8 h-8 flex items-center justify-center rounded-md drop-shadow-md bg-zinc-900 cursor-pointer"
        >
          <p className="text-xl font-semibold text-primary">+</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Cart;
