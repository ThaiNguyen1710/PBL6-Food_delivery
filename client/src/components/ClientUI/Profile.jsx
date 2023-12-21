import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  alertDanger,
  alertNULL,
  alertSuccess,
} from "../../context/actions/alertActions";
import { motion } from "framer-motion";
import { buttonClick } from "../../animations";

import { PostUser, editUser, getAllUsers } from "../../api";

import { setAllUserDetail } from "../../context/actions/allUsersAction";

import Header from "../Header";
import Footer from "../Footer";
import { FiUpload } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

import provincesData from "../../utils/AddressJSON/tinh_tp.json";
import districtsData from "../../utils/AddressJSON/quan_huyen.json";
import wardsData from "../../utils/AddressJSON/xa_phuong.json";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const allUsers = useSelector((state) => state.allUsers);
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userAddress, setUserAddress] = useState({
    street: "",
    city: "",
    district: "",
    ward: "",
  });

  const [userEmail, setUserEmail] = useState("");
  const [imageDownloadURL, setImageDownloadURL] = useState(null);
  const [fullAddress, setFullAddress] = useState("");

  const alert = useSelector((state) => state.alert);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!allUsers) {
      getAllUsers().then((data) => {
        dispatch(setAllUserDetail(data));
      });
    }
  }, []);
  useEffect(() => {
    const generateFullAddress = () => {
      let address = `${userAddress.street}, `;

      Object.keys(wardsData).forEach((wardCode) => {
        const ward = wardsData[wardCode];
        if (ward.code === userAddress.ward) {
          address += `${ward.name_with_type}, `;
        }
      });

      Object.keys(districtsData).forEach((districtCode) => {
        const district = districtsData[districtCode];
        if (district.code === userAddress.district) {
          address += `${district.name_with_type}, `;
        }
      });

      Object.keys(provincesData).forEach((provinceCode) => {
        const city = provincesData[provinceCode];
        if (city.code === userAddress.city) {
          address += `${city.name_with_type}`;
        }
      });

      setFullAddress(address);
    };

    generateFullAddress();
  });
  if (!user || !allUsers) {
    return null;
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserAddress({
      ...userAddress,
      [name]: value,
    });
  };

  const saveNewData = async () => {
    try {
      const userId = user.user.userId;

      const newData = {
        name: userName || user.user.name,
        phone: userPhone || user.user.phone,
        address: fullAddress || user.user.address,
        email: userEmail || user.user.email,
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
      } else {
        throw new Error("Failed to update user information");
      }
    } catch (error) {
      console.error("Error updating user information:", error);
    }
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

        formData.append("image", imageDownloadURL);

        PostUser(userId, formData)
          .then((res) => {
            if (res) {
              dispatch(alertSuccess("Cập nhật thành công!"));
              setTimeout(() => {
                dispatch(alertNULL());
                getAllUsers().then((data) => {
                  dispatch(setAllUserDetail(data));
                });
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
      <Header />

      <div className="flex justify-center items-center w-full pt-24">
        <div className="  items-center justify-center  fixed right-12 top-40">
          <label className="flex flex-col items-center justify-center h-full cursor-pointer mr-4 relative">
            <div className="rounded-full overflow-hidden w-24 h-24 bg-gray-200 relative flex items-center justify-center">
              {imageDownloadURL && typeof imageDownloadURL !== "string" ? (
                <motion.img
                  src={URL.createObjectURL(imageDownloadURL)}
                  className="h-full w-full object-cover"
                  alt="Uploaded"
                  whileHover={{ scale: 1.15 }}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-2xl text-gray-400">
                  <FiUpload className="" />
                </div>
              )}
              {imageDownloadURL && typeof imageDownloadURL !== "string" && (
                <motion.button
                  onClick={() => setImageDownloadURL(null)}
                  {...buttonClick}
                  className="absolute top-0 right-2 p-2 bg-red-500 text-white rounded-full cursor-pointer"
                >
                  <MdDelete className="" />
                </motion.button>
              )}
            </div>
            <p className="flex font-semibold text-textColor mt-2">
              Cập nhật ảnh đại diện!
            </p>
            <input
              type="file"
              name="upload-image"
              accept="image/*"
              onChange={(event) => setImageDownloadURL(event.target.files[0])}
              className="w-0 h-0 absolute inset-0 opacity-0"
            ></input>

            <motion.button
              onClick={uploadImage}
              {...buttonClick}
              className="border w-24 h-11 rounded-md shadow-md bg-orange-300"
            >
              <p className="font-semibold text-black text-xl ">Save</p>
            </motion.button>
          </label>
        </div>
        <div className="w-[50%] text-center flex ">
          <p className="text-3xl font-semibold text-orange-500 ">
            Thông tin cá nhân
          </p>
        </div>
      </div>
      <div className="border border-gray-300 rounded-md p-4 w-[75%] flex flex-col items-start  font-semibold justify-center gap-4">
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
        <div className="w-full px-4 py-3  shadow-md rounded-md cursor-pointer">
          {loggedInUser ? loggedInUser.address : ""}
        </div>
        <div className="flex gap-4">
          <InputValueField
            type="text"
            placeholder="Số nhà, đường"
            stateValue={userAddress.street}
            stateFunc={(value) =>
              setUserAddress({ ...userAddress, street: value })
            }
          />
          <label className="select-label">
            <select
              name="city"
              value={userAddress.city}
              className="border-red-400 border rounded-md bg-cardOverlay w-auto px-4 py-3 font-semibold"
              onChange={(e) =>
                handleInputChange({
                  target: {
                    name: "city",
                    value: e.target.value,
                  },
                })
              }
            >
              <option value="">Chọn tỉnh/thành phố</option>
              {Object.keys(provincesData).map((provinceCode) => (
                <option key={provinceCode} value={provinceCode}>
                  {provincesData[provinceCode].name_with_type}
                </option>
              ))}
            </select>
          </label>

          {userAddress.city && (
            <label>
              <select
                name="district"
                value={userAddress.district}
                className="border-red-400 border rounded-md bg-cardOverlay w-auto px-4 py-3 font-semibold"
                onChange={(e) =>
                  handleInputChange({
                    target: {
                      name: "district",
                      value: e.target.value,
                    },
                  })
                }
              >
                <option value="">Chọn quận/huyện</option>
                {Object.keys(districtsData).map((districtCode) => {
                  const district = districtsData[districtCode];
                  if (district.parent_code === userAddress.city) {
                    return (
                      <option key={districtCode} value={districtCode}>
                        {district.name_with_type}
                      </option>
                    );
                  }
                  return null;
                })}
              </select>
            </label>
          )}

          {userAddress.district && (
            <label>
              <select
                name="ward"
                value={userAddress.ward}
                className="border border-red-400 rounded-md bg-cardOverlay w-auto px-4 py-3 font-semibold"
                onChange={(e) =>
                  handleInputChange({
                    target: {
                      name: "ward",
                      value: e.target.value,
                    },
                  })
                }
              >
                <option value="">Chọn phường/xã</option>
                {Object.keys(wardsData).map((wardCode) => {
                  const ward = wardsData[wardCode];
                  if (ward.parent_code === userAddress.district) {
                    return (
                      <option key={wardCode} value={wardCode}>
                        {ward.name_with_type}
                      </option>
                    );
                  }
                  return null;
                })}
              </select>
            </label>
          )}

          {/* Hiển thị thông tin địa chỉ */}
        </div>
      </div>

      <motion.button
        onClick={saveNewData}
        {...buttonClick}
        className="w-[60%] h-10 bg-red-400 flex items-center justify-center gap -3  hover:bg-red-500  cursor-pointer shadow-md rounded-md backdrop-blur-md"
      >
        <p className="font-semibold text-card text-xl ">Lưu Thay Đổi</p>
      </motion.button>
      <Footer />
    </div>
  );
};

export const InputValueField = ({
  type,
  placeholder,
  stateValue,
  stateFunc,
  readOnly,
}) => {
  return (
    <>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-cardOverlay shadow-md outline-none rounded-md border border-gray-200 focus:border-red-400"
        value={stateValue}
        onChange={(e) => stateFunc(e.target.value)}
        readOnly={readOnly}
      />
    </>
  );
};

export default Profile;
