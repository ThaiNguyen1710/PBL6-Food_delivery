import React from "react";
import { NavLink } from "react-router-dom";
import { faceLogo, igLogo,logo2, overView, shipped, storeList, userList } from "../../assets";
import { gradientStyle, isActiveList, isNotActiveList,  } from "../../utils/styles";
import { motion } from "framer-motion";

const DBLeftSection = () => {
  return (
    <div className="h-full py-2   flex flex-col bg-cardOverlay shadow-md backdrop-blur-md  min-w-210 w-225 gap-3 overflow-auto">
      <NavLink to={"/"} className="flex items-center justify-center gap-4">
        <img src={logo2} className="w-16 " alt="" />
        <p className=" font-semibold text-4xl "style={gradientStyle}>6Food</p>
      </NavLink>

      <hr />

      <ul className="flex flex-col gap-1 px-2 py-2">
        <div className="flex w-full gap-1  items-center" >
        <img src={overView} className="w-8 h-8 object-contain " alt="" />
        <p className="text-xl font-bold text-headingColor">Tổng quan</p>
        </div>
       
        <NavLink
          className={({ isActive }) =>
            isActive
              ? `${isActiveList} px-4 py-2 border-red-500 border-l-4`
              : isNotActiveList
          }
          to={"/dashboard/home"}
        >
          Trang chủ
        </NavLink>
        <div className="flex w-full gap-3  items-center" >
        <img src={storeList} className="w-8 h-8 object-contain " alt="" />
        <p className="text-xl font-bold text-headingColor">Store</p>
        </div>
        <NavLink
          className={({ isActive }) =>
            isActive
            ? `${isActiveList} px-1 py-2 border-red-500 border-l-4`
            : isNotActiveList
          }
          to={"/dashboard/store"}
        >
         Cửa hàng
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive
            ? `${isActiveList} px-1 py-2 border-red-500 border-l-4`
            : isNotActiveList
          }
          to={"/dashboard/store-confirm"}
        >
         Cấp phép cửa hàng
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? `${isActiveList} px-1 py-2 border-red-500 border-l-4`
              : isNotActiveList
          }
          to={"/dashboard/orders"}
        >
          Đơn hàng
        </NavLink>
        <div className="flex w-full gap-3  items-center" >
        <img src={userList} className="w-8 h-8 object-contain " alt="" />
        <p className="text-xl font-bold text-headingColor">Người dùng</p>
        </div>
        {/* <NavLink
          className={({ isActive }) =>
            isActive
              ? `${isActiveStyles} px-4 py-2 border-red-500 border-l-8`
              : isNotActiveStyles
          }
          to={"/dashboard/items"}
        >
          Items
        </NavLink> */}
        {/* <NavLink
          className={({ isActive }) =>
            isActive
              ? `${isActiveStyles} px-4 py-2 border-red-500 border-l-8`
              : isNotActiveStyles
          }
          to={"/dashboard/newItem"}
        >
          Add New Item
        </NavLink> */}
        <NavLink
          className={({ isActive }) =>
          isActive
          ? `${isActiveList} px-1 py-2 border-red-500 border-l-4`
          : isNotActiveList
          }
          to={"/dashboard/users"}
        >
          Danh sách
        </NavLink>
        <div className="flex w-full gap-3  items-center" >
        <img src={shipped} className="w-8 h-8 object-contain " alt="" />
        <p className="text-xl font-bold text-headingColor">Shipper</p>
        </div>
        <NavLink
          className={({ isActive }) =>
          isActive
          ? `${isActiveList} px-1 py-2 border-red-500 border-l-4`
          : isNotActiveList
          }
          to={"/dashboard/shipper"}
        >
          Danh sách
        </NavLink>
      </ul>

      <div className="w-full h-full justify-center items-center flex  mt-auto">
        <div className="w-full h-225 -mb-32 rounded-md bg-red-300 flex flex-col items-center justify-center gap-1 px-2  ">
          <div className="w-12 h-12 rounded-full bg-white  flex justify-center items-center ">
            <p className="text-2xl font-bold text-textColor">?</p>
          </div>
          <p className="text-xl font-semibold text-primary">
            Trung Tâm Trợ Giúp
          </p>
          <p className="text-base font-medium text-gray-500 text-center">
            Có vấn đề gì? Liên hệ với chúng tôi!{" "}
          </p>
          <div className="relative cursor-pointer flex gap-16">
            <motion.div
              className="w-10 h-10 rounded-full flex justify-center items-center "
              whileHover={{ scale: 1.15 }}
              referrerPolicy="no-referrer"
              onClick={() =>
                (window.location.href = "https://www.facebook.com/thaii17")
              }
            >
              <img src={faceLogo} alt="" className="w-full h-full" />
            </motion.div>

            <motion.div
              className="w-10 h-10 rounded-full flex justify-center items-center"
              whileHover={{ scale: 1.15 }}
              referrerPolicy="no-referrer"
              onClick={() =>
                (window.location.href = "https://www.instagram.com/thaii1710/")
              }
            >
              <img src={igLogo} alt="" className="w-full h-full" />
            </motion.div>
          </div>
          <span className="flex text-xl font-medium text-textColor gap-10">
            Facebook
            <p>Instagram</p>
          </span>
        </div>
      </div>
    </div>
  );
};

export default DBLeftSection;
