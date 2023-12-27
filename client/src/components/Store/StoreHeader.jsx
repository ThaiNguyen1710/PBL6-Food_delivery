import { motion } from "framer-motion";
import React, { useState } from "react";
import { BsFillBellFill} from "react-icons/bs";
import { MdLogout } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { buttonClick } from "../../animations";
import { avatar, foodMenu } from "../../assets";

import { useNavigate } from "react-router-dom";
import { setUserDetail } from "../../context/actions/userActions";
import { baseURL } from "../../api";

const StoreHeader = () => {
  const user = useSelector((state) => state.user);
  const allUser = useSelector((state) => state.allUsers);
  const order = useSelector((state) => state.orders);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openNotify, setOpenNotify] = useState(false);

  const storeOwner =
    allUser && user && user.user && user.user.userId
      ? allUser.filter((store) => store.id === user.user.userId)
      : [];

  const orderStore = order
    ? order.filter((order) => order.shippingAddress2 === storeOwner?.[0]?.store || order.shippingAddress2 === storeOwner?.[0]?.address)
    : [];
  const orderPending = orderStore
    ? orderStore.filter((pending) => pending.status === "Pending")
    : [];

  const toggleNotify = () => {
    setOpenNotify((prevState) => !prevState);
  };

  const signOut = () => {
    localStorage.removeItem("token");
    dispatch(setUserDetail(null));
    navigate("/login", { replace: true });
  };
  if (!user) {
    return null;
  }
  const handleOrderClick = (orderId) => {
    navigate(`/my-store/order`);
  };

  return (
    <div className="w-full flex items-center justify-between gap-3 ">
      <p className="text-2xl font-semibold text-rose-600 ">
        Store Dashboard
        {user.user.name && (
          <span className="block text-base text-lighttextGray">
            Chào {user.user.name} !
          </span>
        )}
      </p>
      <div className="flex justify-center items-center gap-4">
        {openNotify ? (
          <motion.div
            {...buttonClick}
            onClick={toggleNotify}
            className="flex justify-center items-center bg-sky-300 gap-3 w-10 h-10  rounded-md backdrop-blur-md  cursor-pointer shadow-md"
          >
            <BsFillBellFill className="text-2xl text-slate-100" />
            {orderPending?.length > 0 && (
              <div className="rounded-full bg-red-500 w-6 h-6 flex items-center justify-center absolute -top-4 -right-2 ">
                <p className="text-primary text-base font-semibold">
                  {orderPending.length}
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            {...buttonClick}
            onClick={toggleNotify}
            className="flex justify-center items-center bg-cardOverlay gap-3 w-10 h-10  rounded-md backdrop-blur-md  cursor-pointer shadow-md"
          >
            <BsFillBellFill className="text-2xl text-gray-400" />
            {orderPending?.length > 0 && (
              <div className="rounded-full bg-red-500 w-6 h-6 flex items-center justify-center absolute -top-4 -right-2 ">
                <p className="text-primary text-base font-semibold">
                  {orderPending.length}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {openNotify && (
          <div
            className="bg-white w-96 p-4 rounded-md shadow-md overflow-y-scroll max-h-96 fixed z-10"
            style={{ top: "80px", right: "100px" }}
          >
            {orderPending.length > 0 ? (
              orderPending.map((order) => (
                <div
                  key={order.id}
                  className="mb-2 cursor-pointer hover:bg-slate-200 hover:rounded-lg"
                  onClick={() => handleOrderClick()}
                >
                  <p className="text-lg font-semibold">
                    {new Date(order.dateOrdered).toLocaleString()} -{" "}
                    {order.user.name}
                  </p>
                  <div className="flex justify-start px-3 items-center gap-2">
                    <div className="rounded-md shadow-md overflow-hidden w-14 h-14 cursor-pointer">
                      <motion.img
                        className="w-full h-full object-cover"
                        src={foodMenu}
                        whileHover={{ scale: 1.15 }}
                        referrerPolicy="no-referrer"
                      ></motion.img>
                    </div>
                    <ul>
                      {order.orderLists.map((item) => (
                        <li key={item.id}>
                          {item.product.name} - Số lượng: {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="mt-2 mb-2">
                    Địa chỉ: {order.shippingAddress1} - {order.phone}
                  </p>
                  <hr />
                </div>
              ))
            ) : (
              <p>No orders</p>
            )}
          </div>
        )}
        <div className="flex items-center justify-center gap-4">
          <div className="rounded-md  shadow-md overflow-hidden w-10 h-10 cursor-pointer ">
            <motion.img
              className="w-full h-full object-cover"
              src={
                baseURL + storeOwner?.[0]?.image
                  ? baseURL + storeOwner?.[0]?.image
                  : avatar
              }
              whileHover={{ scale: 1.15 }}
              referrerPolicy="no-referrer"
            ></motion.img>
          </div>
          <motion.div
            {...buttonClick}
            onClick={signOut}
            className=" flex justify-center items-center bg-cardOverlay  w-10 h-10  rounded-md backdrop-blur-md  cursor-pointer shadow-md"
          >
            <MdLogout className="text-xl text-gray-400 " />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StoreHeader;
