import React, { useEffect, useState } from "react";

import { buttonClick } from "../../animations";

import { motion } from "framer-motion";
import {  contactUser, getAllUsers } from "../../api";
import { useDispatch, useSelector } from "react-redux";
import {
  alertInfo,
  alertNULL,
  alertSuccess,
} from "../../context/actions/alertActions";
import { setAllUserDetail } from "../../context/actions/allUsersAction";

const AboutUs = () => {
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [content, setContent] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const user = useSelector((state) => state.user);
  const allUsers = useSelector((state) => state.allUsers);

  const dispatch = useDispatch();

  const saveNewData = async () => {
    try {
    

      const newData = {
        user:loggedInUserId,
        comment: content,
      };
      console.log(newData)
      const updatedUserData = await contactUser( newData);

      if (updatedUserData) {
        dispatch(alertInfo("Gửi yêu cầu thành công"));
        setTimeout(() => {
          dispatch(alertNULL());
        }, 5000);
        setUserName("");
        setUserPhone("");
        setUserEmail("");
        setContent(" ")
      } else {
        throw new Error("Failed to update user information");
      }
    } catch (error) {
      console.error("Error updating user information:", error);
    }
  };


  const loggedInUserId =user? user.user.userId:null;
  const loggedInUser = loggedInUserId
    ? allUsers.find((user) => user.id === loggedInUserId)
    : null;

    useEffect(() => {
      if (!allUsers) {
        getAllUsers().then((data) => {
          dispatch(setAllUserDetail(data));
        });
      }
    });

  return (
    <div className="flex items-center justify-center flex-col pt-3 px-24 w-full gap-2 ">
      <div className="flex justify-center items-start  pt-6 w-full ">
        <div className="w-[80%]  ">
          <p className="text-xl font-normal text-headingColor ">
            Chúng tôi mong muốn lắng nghe ý kiến khách hàng. Vui lòng gửi mọi
            yêu cầu, thắc mắc theo thông tin bên dưới, chúng tôi sẽ liên lạc với
            bạn sớm nhất có thể.
          </p>
        </div>
      </div>
      <div className="border border-gray-300 rounded-md p-4 w-[80%] flex flex-col items-start  font-semibold justify-center gap-1">
        <p className="text-lg text-start text-red-400 font-bold ">
          THÔNG TIN LIÊN LẠC{" "}
        </p>
        <p className="text-sm text-start text-gray-700 font-normal ">
          Hãy chắc chắn thông tin chính xác, chúng tôi sẽ liên hệ qua các
          thông tin này!
        </p>
        <p className="text-sm text-start text-headingColor font-bold ">
          Họ và tên *
        </p>

        <InputValueField
          type="text"
          placeholder={loggedInUser ? loggedInUser.name : ""}
          stateValue={userName}
          stateFunc={setUserName}
        />
        <p className="text-sm text-start text-headingColor font-bold ">
          Số điện thoại *
        </p>

        <InputValueField
          type="number"
          placeholder={loggedInUser ? loggedInUser.phone : ""}
          stateValue={userPhone}
          stateFunc={setUserPhone}
        />
        <p className="text-sm text-start text-headingColor font-bold ">Email *</p>
        <InputValueField
          type="text"
          placeholder={loggedInUser ? loggedInUser.email : ""}
          stateValue={userEmail}
          stateFunc={setUserEmail}
        />
        <p className="text-lg text-start text-red-400 font-bold ">NỘI DUNG</p>
        <InputContent
          type="textarea"
          stateValue={content}
          stateFunc={setContent}
        />
          <p className="text-sm text-start text-gray-700 font-normal ">
          Chúng tôi sẽ phản hồi lại trong thời gian ngắn nhất.
        </p>
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

export default AboutUs;
