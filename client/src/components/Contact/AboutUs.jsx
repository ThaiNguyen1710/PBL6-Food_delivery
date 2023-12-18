import React, { useState } from "react";

import { buttonClick } from "../../animations";

import { motion } from "framer-motion";
import { PostContact} from "../../api";
import { useDispatch, useSelector } from "react-redux";
import {
  alertDanger,
  alertNULL,
  alertSuccess,
} from "../../context/actions/alertActions";

const AboutUs = () => {
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [content, setContent] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const [img, setImg] = useState(null);

  const [information, setInformation] = useState("");

  const alert = useSelector((state) => state.alert);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const saveNewData = () => {
    if (!userName) {
      dispatch(alertDanger("Please fill in all fields!"));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    } else {
      const formData = new FormData();
      formData.append("id", user.user.userId);
      formData.append("address", user.user.address);

      formData.append("name", userName);

      formData.append("phone", userPhone);
      formData.append("email", userEmail);

      formData.append("description", information);
      formData.append("image", img);

      PostContact(formData)
        .then((res) => {
          if (res && res.data) {
            dispatch(alertSuccess("Added Product!"));
            setTimeout(() => {
              dispatch(alertNULL());
            }, 3000);
          } else {
            console.log(
              "Received null or incomplete response when adding a new item."
            );
            dispatch(
              alertDanger(
                "Failed to add new item. Received incomplete response."
              )
            );
            setTimeout(() => {
              dispatch(alertNULL());
            }, 3000);
          }
        })
        .catch((error) => {
          console.error("Error adding item:", error);
          dispatch(alertDanger(`Error adding item: ${error.message || error}`));
          setTimeout(() => {
            dispatch(alertNULL());
          }, 3000);
        });
    }
  };

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
      <div className="border border-gray-300 rounded-md p-4 w-[80%] flex flex-col items-start  font-semibold justify-center gap-2">
        <p className="text-lg text-start text-red-400 font-bold ">HỌ VÀ TÊN </p>

        <InputValueField
          type="text"
          stateValue={userName}
          stateFunc={setUserName}
        />
        <p className="text-lg text-start text-red-400 font-bold ">
          SỐ ĐIỆN THOẠI
        </p>

        <InputValueField
          type="number"
          stateValue={userPhone}
          stateFunc={setUserPhone}
        />
        <p className="text-lg text-start text-red-400 font-bold ">EMAIL</p>
        <InputValueField
          type="text"
          stateValue={userEmail}
          stateFunc={setUserEmail}
        />
        <p className="text-lg text-start text-red-400 font-bold ">NỘI DUNG</p>
        <InputContent
          type="textarea"
          stateValue={content}
          stateFunc={setContent}
        />
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
