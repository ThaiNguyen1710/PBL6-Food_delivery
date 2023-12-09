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
import Header from "../Header";
import Footer from "../Footer";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const allUsers = useSelector((state) => state.allUsers);
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [userEmail, setUserEmail] = useState("");

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
      console.log(userId)
      
      const newData = {
        name: userName || user.user.name,
        phone: userPhone || user.user.phone,
        address: userAddress || user.user.address,
        email: userEmail || user.user.email,
      };
     
      const updatedUserData = await editUser(userId, newData);
      console.log(updatedUserData)
      if (updatedUserData && updatedUserData.data) {
        dispatch(setUserDetail(updatedUserData.data));
        dispatch(alertSuccess("User information updated successfully"));
      } else {
        throw new Error("Failed to update user information");
      }
    } catch (error) {
      console.error("Error updating user information:", error);
      dispatch(
        dispatch(alertSuccess("Cập nhật thành công  "))
      );
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
      setUserName("")
      setUserPhone("")
      setUserAddress("")
      setUserEmail("")
    }
  };

  const loggedInUserId = user.user.userId;
  const loggedInUser = loggedInUserId
    ? allUsers.find((user) => user.id === loggedInUserId)
    : null;

  return (
    <div className="flex items-center justify-center flex-col pt-6 px-24 w-full gap-3 ">
      <Header />
      <p className="text-3xl font-semibold text-orange-500 pt-24">Cập nhật thông tin!</p>
      <div className="border border-gray-300 rounded-md p-4 w-[80%] flex flex-col items-start  font-semibold justify-center gap-4">
        <p className="text-xl text-start text-red-400 font-semibold ">Tên </p>

        <InputValueField
          type="text"
          placeholder={loggedInUser ? loggedInUser.name : ""}
          stateValue={userName}
          stateFunc={setUserName}
        />
        <p className="text-xl text-start text-red-400 font-semibold ">
          Số điện Thoại
        </p>

        <InputValueField
          type="number"
          placeholder={loggedInUser ? loggedInUser.phone : ""}
          stateValue={userPhone}
          stateFunc={setUserPhone}
        />
        <p className="text-xl text-start text-red-400 font-semibold ">Email</p>
        <InputValueField
          type="text"
          placeholder={loggedInUser ? loggedInUser.email : ""}
          stateValue={userEmail}
          stateFunc={setUserEmail}
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
      </div>

      <motion.button
        onClick={saveNewData}
        {...buttonClick}
        className="w-[60%] h-10 bg-red-400 flex items-center justify-center gap -3  hover:bg-red-500  cursor-pointer shadow-md rounded-md backdrop-blur-md"
      >
        <p className="font-semibold text-card text-xl ">Lưu Thay Đổi</p>
      </motion.button>
      <Footer/>
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

export default Profile;
