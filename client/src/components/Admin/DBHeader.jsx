import { motion } from "framer-motion";
import React, { useState } from "react";
import { BsFillBellFill} from "react-icons/bs";
import { MdLogout } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { buttonClick } from "../../animations";
import { adminAvatar, foodMenu, store } from "../../assets";

import { useNavigate } from "react-router-dom";
import { setUserDetail } from "../../context/actions/userActions";

const DBHeader = () => {
  const user = useSelector((state) => state.user);
  const allUser = useSelector((state) => state.allUsers);


  const regisStore =allUser? allUser.filter((regis)=>regis.store !== null && regis.isStore === false):[]
console.log(regisStore)

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openNotify, setOpenNotify] = useState(false);

  const toggleNotify = () => {
    setOpenNotify((prevState) => !prevState);
  };


  const signOut = () => {
    localStorage.removeItem('token')
    dispatch(setUserDetail(null));
    navigate("/login", { replace: true });
  };
  if (!user) {
    return null; 
  }
  const handleOrderClick = () => {
    navigate(`/dashboard/store-confirm`);
  };

  return (
    <div className="w-full flex items-center justify-between gap-3 ">
      <p className="text-2xl text-headingColor ">
        Admin Dashboard
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
            {regisStore?.length > 0 && (
              <div className="rounded-full bg-red-500 w-6 h-6 flex items-center justify-center absolute -top-4 -right-2 ">
                <p className="text-primary text-base font-semibold">
                  {regisStore.length}
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
            {regisStore?.length > 0 && (
              <div className="rounded-full bg-red-500 w-6 h-6 flex items-center justify-center absolute -top-4 -right-2 ">
                <p className="text-primary text-base font-semibold">
                  {regisStore.length}
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
            {regisStore.length > 0 ? (
              regisStore.map((regis) => (
                <div
                  key={regis.id}
                  className="mb-2 cursor-pointer hover:bg-slate-200 hover:rounded-lg flex gap-2 "
                  onClick={() => handleOrderClick()}
                >
                   <motion.img
                        className="w-10 h-10 object-cover"
                        src={store}
                        whileHover={{ scale: 1.15 }}
                        referrerPolicy="no-referrer"
                      ></motion.img>
                  <p>Có 1 đơn đăng ký cửa hàng chờ xác nhận!</p>
                  <hr />
                </div>
              ))
            ) : (
              <p>No Notify</p>
            )}
          </div>
        )}
       
        <div className="flex items-center justify-center gap-4">
          <div className="rounded-md  shadow-md overflow-hidden w-10 h-10 cursor-pointer ">
            <motion.img
              className="w-full h-full object-cover"
              src={adminAvatar}
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

export default DBHeader;
