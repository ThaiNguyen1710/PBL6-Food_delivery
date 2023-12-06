import { motion } from "framer-motion";
import React from "react";
import { BsFillBellFill, BsToggles2 } from "react-icons/bs";
import { MdLogout, MdSearch } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { buttonClick } from "../../animations";
import { avatar } from "../../assets";
import { getAuth } from "firebase/auth";
import { app } from "../../config/firebase.config";
import { useNavigate } from "react-router-dom";
import { setUserDetail, setUserNull } from "../../context/actions/userActions";

const StoreHeader = () => {
  const user = useSelector((state) => state.user);
  // const firebaseAuth = getAuth(app)
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const signOut = () => {
    localStorage.removeItem('token')
    dispatch(setUserDetail(null));
    navigate("/login", { replace: true });
  };
  if (!user) {
    return null; // Hoặc có thể trả về một phần tử rỗng, thông báo lỗi, hoặc hiển thị một phần nào đó cho người dùng
  }
  return (
    <div className="w-full flex items-center justify-between gap-3 ">
      <p className="text-2xl text-headingColor ">
        Store Dashboard
        {user.user.name && (
          <span className="block text-base text-lighttextGray">
            Chào {user.user.name} !
          </span>
        )}
      </p>
      <div className="flex justify-center items-center gap-4">
        <div className="flex items-center justify-center bg-cardOverlay gap-3 px-4 py-2 rounded-md backdrop-blur-md shadow-md">
          <MdSearch className="text-gray-400 text-2xl" />
          <input
            type="text"
            placeholder="Search Here"
            className="border-none outline-none font-medium bg-transparent text-base text-textColor"
          />
          <BsToggles2 className="text-gray-400 text-2xl" />
        </div>
        <motion.div
          {...buttonClick}
          className="flex justify-center items-center bg-cardOverlay gap-3 w-10 h-10  rounded-md backdrop-blur-md  cursor-pointer shadow-md"
        >
          <BsFillBellFill className="text-2xl text-gray-400" />
        </motion.div>
        <div className="flex items-center justify-center gap-4">
          <div className="rounded-md  shadow-md overflow-hidden w-10 h-10 cursor-pointer ">
            <motion.img
              className="w-full h-full object-cover"
              src={avatar}
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
