import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  alertDanger,
  alertNULL,
  alertSuccess,
} from "../../context/actions/alertActions";
import { motion } from "framer-motion";
import { buttonClick } from "../../animations";
import { FiUpload } from "react-icons/fi";

import { PostUser, editUser, getAllUsers } from "../../api";

import { setAllUserDetail } from "../../context/actions/allUsersAction";
import {
  GetUserDetail,
  setUserDetail,
} from "../../context/actions/userActions";
import { FcOpenedFolder } from "react-icons/fc";

const StoreInformation = () => {
  const user = useSelector((state) => state.user);
  const allUsers = useSelector((state) => state.allUsers);
  const [userName, setUserName] = useState("");

  const [userAddress, setUserAddress] = useState("");

  const [storeName, setStoreName] = useState("");
  const [closeAt, setCloseAt] = useState("");
  const [openAt, setOpenAt] = useState("");
  const [imageDownloadURL, setImageDownloadURL] = useState(null);

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
  const editStore = async () => {
    try {
      const userId = user.user.userId;

      const newData = {
        name: userName || user.user.name,
        store: storeName || user.user.store,
        address: userAddress || user.user.address,
        openAt: openAt !== undefined ? openAt : user.user.openAt,
        closeAt: closeAt !== undefined ? closeAt : user.user.closeAt,
      };

      const updatedUserData = await editUser(userId, newData);
      console.log(updatedUserData);

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
        window.location.reload();
      }, 3000);
    }
    setUserName("");
    setStoreName("");
    setUserAddress("");
    setOpenAt("");
    setCloseAt("");
  };

  const uploadImage = () => {
    if (!imageDownloadURL) {
      dispatch(alertDanger("Please choose an image!"));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    } else {
      try {
        const userId = user.user.userId;
        const formData = new FormData();

        formData.append("imgStore", imageDownloadURL);

        // Gửi FormData lên server
        PostUser(userId, formData)
          .then((res) => {
            if (res && res.data) {
              dispatch(alertSuccess("Image uploaded successfully!"));
              setTimeout(() => {
                dispatch(alertNULL());
              }, 3000);
              setImageDownloadURL(null);
            } else {
              console.log(
                "Received null or incomplete response when uploading the image."
              );
              dispatch(
                alertDanger(
                  "Failed to upload image. Received incomplete response."
                )
              );
              setTimeout(() => {
                dispatch(alertNULL());
              }, 3000);
            }
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
            dispatch(
              alertDanger(`Error uploading image: ${error.message || error}`)
            );
            setTimeout(() => {
              dispatch(alertNULL());
            }, 3000);
          });
      } catch (error) {
        console.error("Error preparing image upload:", error);
        dispatch(
          alertDanger(`Error preparing image upload: ${error.message || error}`)
        );
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
      }
    }
  };

  const loggedInUserId = user.user.userId;
  const loggedInUser = loggedInUserId
    ? allUsers.find((user) => user.id === loggedInUserId)
    : null;

  return (
    <div className="flex items-center justify-center flex-col pt-6 px-24 w-full gap-3 ">
     
      <div className="flex justify-center items-start w-full">
        <div className="w-[50%] text-center flex "><p className="text-3xl font-semibold text-orange-500 ">
        Thông tin cửa hàng
      </p></div>
      
          <label className="flex flex-col items-center justify-center h-full cursor-pointer mr-4">
            <div className="text-2xl font-bold">
              <FiUpload className="" />
            </div>
            <p className="flex font-semibold text-textColor">
              Cập nhật ảnh bìa!
            </p>
            <input
              type="file"
              name="upload-image"
              accept="image/*"
              onChange={(event) => setImageDownloadURL(event.target.files[0])}
              className="w-0 h-0"
            ></input>
          </label>
          <motion.button
            onClick={uploadImage}
            {...buttonClick}
            className="border w-24 h-11 rounded-md shadow-md bg-orange-300"
          >
            <p className="font-semibold text-black text-xl ">Save</p>
          </motion.button>
        </div>
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
          <div className="flex">
            <InputValueField
              type="text"
              placeholder={loggedInUser ? loggedInUser.openAt : ""}
            />
            <InputValueField
              type="time"
              placeholder={loggedInUser ? loggedInUser.openAt : ""}
              stateValue={openAt}
              stateFunc={setOpenAt}
            />
          </div>
          <div className="flex">
            <InputValueField
              type="text"
              placeholder={loggedInUser ? loggedInUser.closeAt : ""}
            />
            <InputValueField
              type="time"
              placeholder={loggedInUser ? loggedInUser.closeAt : ""}
              stateValue={closeAt}
              stateFunc={setCloseAt}
            />
          </div>
        </div>
      </div>

      <motion.button
        onClick={editStore}
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
