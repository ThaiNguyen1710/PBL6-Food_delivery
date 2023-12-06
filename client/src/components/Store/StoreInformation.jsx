import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  alertDanger,
  alertNULL,
  alertSuccess,
} from "../../context/actions/alertActions";
import { motion } from "framer-motion";
import { buttonClick } from "../../animations";

import { editUser, getAllUsers } from "../../api";

import { setAllUserDetail } from "../../context/actions/allUsersAction";
import {
  GetUserDetail,
  setUserDetail,
} from "../../context/actions/userActions";

const StoreInformation = () => {
  const user = useSelector((state) => state.user);
  const allUsers = useSelector((state) => state.allUsers);
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [storeName, setStoreName] = useState("");
  const [closeAt, setCloseAt] = useState("");
  const [openAt, setOpenAt] = useState("");

  const alert = useSelector((state) => state.alert);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      GetUserDetail().then((data) => {
        dispatch(setUserDetail(data));
      });
    }
    if (!allUsers) {
      getAllUsers().then((data) => {
        dispatch(setAllUserDetail(data));
      });
    }
  }, []);
  if (!user || !allUsers) {
    return null; 
  }
  const saveNewData = async () => {
    try {
      const userId = user.user.userId;

 
      const newData = {
        name: userName || user.user.name,
        store: storeName || user.user.store,
        address: userAddress !== undefined ? userAddress : user.user.address,
        openAt: openAt !== undefined ? openAt : user.user.openAt,
        closeAt: closeAt !== undefined ? closeAt : user.user.closeAt,
        
      };

      const updatedUserData = await editUser(userId, newData);
      
      if (updatedUserData && updatedUserData.data) {
        dispatch(setUserDetail(updatedUserData.data));
        dispatch(alertSuccess("User information updated successfully"));
      } else {
        throw new Error("Failed to update user information");
      }
    } catch (error) {
      console.error("Error updating user information:", error);
      dispatch(dispatch(alertSuccess("Cập nhật thành công  ")));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    }
    setUserName("")
    setStoreName("")
    setUserAddress("")
    setOpenAt("")
    setCloseAt("")
  };

  const loggedInUserId = user.user.userId;
  const loggedInUser = loggedInUserId
    ? allUsers.find((user) => user.id === loggedInUserId)
    : null;

  return (
    <div className="flex items-center justify-center flex-col pt-6 px-24 w-full gap-3 ">
      <p className="text-3xl font-semibold text-orange-500">
        Thông tin cửa hàng
      </p>
      <div className="border border-gray-300 rounded-md p-4 w-[80%] flex flex-col items-start  font-semibold justify-center gap-4">
        <p className="text-xl text-start text-red-400 font-semibold ">
          {" "}
          Chủ Cửa Hàng{" "}
        </p>

        <InputValueField
          type="text"
          placeholder={user.user.name}
          stateValue={userName}
          stateFunc={setUserName}
        />
        <p className="text-xl text-start text-red-400 font-semibold ">
          Tên Cửa Hàng
        </p>

        <InputValueField
          type="text"
          placeholder={loggedInUser ? loggedInUser.store : ""}
          stateValue={storeName}
          stateFunc={setStoreName}
        />
        <p className="text-xl text-start text-red-400 font-semibold ">
          Địa Chỉ
        </p>
        <InputValueField
          type="text"
          placeholder={loggedInUser ? loggedInUser.address : ""}
          stateValue={userAddress}
          stateFunc={setUserAddress}
        />
        <p className="text-xl text-start text-red-400 font-semibold ">
          Thời gian mở cửa
        </p>
        <div className="flex w-full gap-12 ">
          <InputValueField
            type="time"
            placeholder={loggedInUser ? loggedInUser.openAt : ""}
            stateValue={openAt}
            stateFunc={setOpenAt}
          />
          <InputValueField
            type="time"
            placeholder={loggedInUser ? loggedInUser.closeAt : ""}
            stateValue={closeAt}
            stateFunc={setCloseAt}
          />
        </div>
      </div>

      <motion.button
        onClick={saveNewData}
        {...buttonClick}
        className="w-[60%] h-10 bg-red-400 flex items-center justify-center gap -3  hover:bg-red-500  cursor-pointer shadow-md rounded-md backdrop-blur-md"
      >
        <p className="font-semibold text-card text-xl ">Lưu Thay Đổi</p>
      </motion.button>
    </div>
  );
};

export const InputValueField = ({
  type,
  placeholder,
  stateValue,
  stateFunc,
}) => {
  return (
    <>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-cardOverlay shadow-md outline-none rounded-md border border-gray-200 focus:border-red-400"
        value={stateValue}
        onChange={(e) => stateFunc(e.target.value)}
      />
    </>
  );
};

export default StoreInformation;
