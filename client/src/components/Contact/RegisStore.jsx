import React, { useState } from "react";

import { buttonClick } from "../../animations";

import { motion } from "framer-motion";
import { editUser, getAllUsers } from "../../api";
import { useDispatch, useSelector } from "react-redux";
import {
  alertDanger,
  alertNULL,
  alertSuccess,
} from "../../context/actions/alertActions";
import { IoShieldCheckmark } from "react-icons/io5";
import { TbMinusVertical } from "react-icons/tb";
import { gradientStyle } from "../../utils/styles";
import { setAllUserDetail } from "../../context/actions/allUsersAction";

const RegisStore = () => {
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const [nameStore, setNameStore] = useState("");
  const [address, setAddress] = useState("");

  const pdfLink =
    "https://drive.google.com/file/d/1PgNXABLT3PYBFn8emBUsmEIcJdfJkHP8/view?usp=sharing";

  const alert = useSelector((state) => state.alert);
  const user = useSelector((state) => state.user);
  const allUsers = useSelector((state) => state.allUsers);

  const dispatch = useDispatch();

  const saveNewData = async () => {
    try {
    
      const userId = user.user.userId;

      const newData = {
        name: userName || user.user.name,
        phone: userPhone || user.user.phone,
      
        email: userEmail || user.user.email,


        store: nameStore|| user.user.store,
        address: address || user.user.address,

       

      };

      const updatedUserData = await editUser(userId, newData);

      if (updatedUserData) {
        getAllUsers().then((data) => {
          dispatch(setAllUserDetail(data));
        });
        dispatch(alertSuccess("Cập nhật thành công  "));
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
        setUserName("");
        setUserPhone("");

        setUserEmail("");

        setNameStore("")
        setAddress("")
      } else {
        throw new Error("Failed to update user information");
      }
    } catch (error) {
      console.error("Error updating user information:", error);
    }
  };

  const loggedInUserId = user.user.userId;
  const loggedInUser = loggedInUserId
    ? allUsers.find((user) => user.id === loggedInUserId)
    : null;

  return (
    <div className="flex items-center justify-center flex-col pt-3 px-24 w-full gap-2 ">
      <div className="flex justify-center items-start  pt-6 w-full ">
        <div className="w-[80%]  justify-between items-center flex">
          <p className="text-xl font-normal text-headingColor ">
            Đăng ký quán đối tác dễ dàng!
          </p>
          <div className="  gap-6 flex items-center">
            <motion.button
              {...buttonClick}
              className=" flex  items-center  gap-1 bg-gradient-to-bl from-amber-200 to-amber-400 px-2 py-1 rounded-xl text-black text-base font-semibold "
            >
              <IoShieldCheckmark className="w-8 h-8 text-slate-100" />
              Quán đối tác
            </motion.button>
            <TbMinusVertical className="text-headingColor text-5xl" />
            <div className=" w-auto h-full items-center justify-center">
              <p className="text-base text-center font-normal text-slate-500 ">
                Dịch vụ bởi
              </p>
              <p className="font-semibold text-3xl" style={gradientStyle}>
                6Food
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="border border-gray-300 rounded-md p-4 w-[80%] flex flex-col items-start  font-semibold justify-center gap-1">
        <p className="text-lg text-start text-red-400 font-bold ">
          THÔNG TIN CHỦ SỞ HỮU{" "}
        </p>
        <p className="text-sm text-start text-headingColor font-bold ">
          Họ và tên
        </p>

        <InputValueField
          type="text"
          placeholder={loggedInUser ? loggedInUser.name : ""}
          stateValue={userName}
          stateFunc={setUserName}
        />
        <p className="text-sm text-start text-headingColor font-bold ">
          Số điện thoại
        </p>

        <InputValueField
          type="number"
          placeholder={loggedInUser ? loggedInUser.phone : ""}
          stateValue={userPhone}
          stateFunc={setUserPhone}
        />
        <p className="text-sm text-start text-headingColor font-bold ">Email</p>
        <InputValueField
          type="text"
          placeholder={loggedInUser ? loggedInUser.email : ""}
          stateValue={userEmail}
          stateFunc={setUserEmail}
        />

        <p className="text-lg text-start text-red-400 font-bold ">
          THÔNG TIN QUÁN CẦN ĐĂNG KÝ
        </p>
        <p className="text-sm text-start text-gray-700 font-normal ">
          * Hãy chắc chắn quán chưa được đăng ký tại 6Food
        </p>
        <p className="text-sm text-start text-headingColor font-bold ">
          Tên quán
        </p>

        <InputValueField
          type="text"
          stateValue={nameStore}
          stateFunc={setNameStore}
        />
        <p className="text-sm text-start text-headingColor font-bold ">
          Địa chỉ quán
        </p>

        <InputValueField
          type="text"
         
          stateValue={address}
          stateFunc={setAddress}
        />
        <div className="w-full flex gap-1">
          <p className="text-sm text-start text-gray-700 font-normal ">
            * Sau khi chấp thuận đồng nghĩa đồng ý với các
          </p>

          <a
            href={pdfLink}
            target="_blank"
            rel="noopener noreferrer "
            className="text-sm text-start text-blue-500 font-normal"
          >
            điều khoản của 6Food
          </a>
        </div>
      </div>

      <motion.button
        {...buttonClick}
        onClick={saveNewData}
        className="w-[60%] h-10 bg-red-400 flex items-center justify-center gap -3  hover:bg-red-500  cursor-pointer shadow-md rounded-md backdrop-blur-md"
      >
        <p className="font-semibold text-card text-lg ">GỬI YÊU CẦU</p>
      </motion.button>
      {/* <Footer /> */}
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
        className="w-full px-3 py-2 bg-cardOverlay shadow-md outline-none rounded-md border border-gray-200 focus:border-red-400"
        value={stateValue}
        onChange={(e) => stateFunc(e.target.value)}
      />
    </>
  );
};

export const InputContent = ({ type, placeholder, stateValue, stateFunc }) => {
  return (
    <>
      <textarea
        rows={6}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-cardOverlay shadow-md outline-none rounded-md border border-gray-200 focus:border-red-400 resize-none" // Thay đổi từ input sang textarea và thêm thuộc tính resize-none để không cho phép resize ô
        value={stateValue}
        onChange={(e) => stateFunc(e.target.value)}
      />
    </>
  );
};

export default RegisStore;
