import React, { useState } from "react";
import { statuses } from "../utils/styles";
import Spinner from "./Spinner";
import { FcOpenedFolder } from "react-icons/fc";
import { FaDongSign } from "react-icons/fa6";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../config/firebase.config";
import { useDispatch, useSelector } from "react-redux";
import {
  alertDanger,
  alertNULL,
  alertSuccess,
} from "../context/actions/alertActions";
import { motion } from "framer-motion";
import { buttonClick } from "../animations";
import { MdDelete } from "react-icons/md";
import { addNewProduct, getAllProducts } from "../api";
import { setAllProducts } from "../context/actions/productAction";

const DBNewItem = () => {
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState(null);
  const [price, setPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [imageDownloadURL, setImageDownloadURL] = useState(null);

  const alert = useSelector((state) => state.alert);
  const dispatch = useDispatch();

  const uploadImage = (e) => {
    setIsLoading(true);
    const imageFile = e.target.files[0];
    const storageRef = ref(storage, `Images/${Date.now()}_$(imageFile.name)`);

    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },
      (error) => {
        dispatch(alertDanger(`Error: ${error}`));
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageDownloadURL(downloadURL);
          setIsLoading(false);
          setProgress(null);
          dispatch(alertSuccess("Uploaded Image to the cloud"));
          setTimeout(() => {
            dispatch(alertNULL());
          }, 3000);
        });
      }
    );
  };

  const deleteImageFromFirebase = () => {
    setIsLoading(true);
    const deleteRef = ref(storage, imageDownloadURL);

    deleteObject(deleteRef).then(() => {
      setImageDownloadURL(null);
      setIsLoading(false);
      dispatch(alertSuccess("Image removed from the cloud"));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    });
  };

  const saveNewData = () => {
    const data = {
      product_name: itemName,
      product_category: category,
      product_price: price,
      product_image: imageDownloadURL,
    };
    addNewProduct(data).then((res) => {
      console.log(res)
      dispatch(alertSuccess("New item added"));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
      setImageDownloadURL(null)
      setItemName ("");
      setPrice("");
      setCategory(null)
      
    });
    getAllProducts().then((data) => {
      
      dispatch(setAllProducts(data));
      
    });
  };
  return (
    <div className="flex items-center justify-center flex-col pt-6 px-24 w-full gap-3 ">
      <div className="border border-gray-300 rounded-md p-4 w-full flex flex-col items-center  font-semibold justify-center gap-4">
        <InputValueField
          type="text"
          placeholder={"Item name here"}
          stateValue={itemName}
          stateFunc={setItemName}
        />
      </div>
      <div className="w-full flex flex-wrap items-center justify-around gap-3 ">
        {statuses &&
          statuses?.map((data) => (
            <p
              key={data.id}
              onClick={() => setCategory(data.category)}
              className={`px-3 py-2 rounded-md text-xl text-textColor font-semibold cursor-pointer hover: border backdrop-blur-md shadow-md border-gray-300 ${
                data.category === category
                  ? "bg-red-400 text-white"
                  : "bg-transparent"
              }`}
            >
              {data.title}
            </p>
          ))}
      </div>
      <div className="w-[80%] flex justify-center items-center gap-3   border-red-200 font-semibold">
        <InputValueField
          type="number"
          placeholder={"Item price here"}
          stateValue={price}
          stateFunc={setPrice}
        />
        <div className="relative">
          <span className="text-textColor absolute right-14 -top-2.5 text-xl">
            <FaDongSign className="text-red-400"/>
          </span>
        </div>
      </div>
      <div className="w-[60%] bg-card backdrop-blur-md h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
        {isLoading ? (
          <div className="flex flex-col justify-center px-24 w-full h-full items-center text-xl gap-3">
            <Spinner />
            {Math.round(progress > 0) && (
              <div className="w-full flex flex-col items-center justify-center gap-2">
                <div className="flex justify-between w-full">
                  <span className="text-base font-medium text-textColor">
                    Progress
                  </span>
                  <span className="text-sm font-medium text-textColor">
                    {Math.round(progress) > 0 && (
                      <>{`${Math.round(progress)}%`}</>
                    )}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-red-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${Math.round(progress)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {!imageDownloadURL ? (
              <>
                <label>
                  <div className="flex flex-col items-center justify-center h-full w-full cursor-pointer">
                    {/* <div className="flex flex-col items-center justify-center h-full w-full cursor-pointer"> */}
                    <p className="text-6xl font-bold">
                      <FcOpenedFolder className="" />
                    </p>
                    <p className="items-center justify-center flex font-semibold text-textColor">
                      Click to upload image!
                    </p>
                    {/* </div> */}
                  </div>
                  <input
                    type="file"
                    name="upload-image"
                    accept="image/*"
                    onChange={uploadImage}
                    className="w-0 h-0"
                  ></input>
                </label>
              </>
            ) : (
              <>
                <div className="relative w-full h-full overflow-hidden rounded-md">
                  <motion.img
                    whileHover={{ scale: 1.15 }}
                    src={imageDownloadURL}
                    className="h-full w-full object-cover"
                  />
                  <motion.button
                    {...buttonClick}
                    type="button"
                    className="absolute top-3 right-3 p-3 rounded-full bg-red-300 text-xl cursor-pointer outline-none hover: shadow-md duration-500 transition-all ease-in-out"
                    onClick={() => deleteImageFromFirebase(imageDownloadURL)}
                  >
                    <MdDelete className="" />
                  </motion.button>
                </div>
              </>
            )}
          </>
        )}
      </div>
      <motion.button
        onClick={saveNewData}
        {...buttonClick}
        className="w-[60%] h-10 bg-red-400 flex items-center justify-center gap -3  hover:bg-red-500  cursor-pointer shadow-md rounded-md backdrop-blur-md"
      >
        <p className="font-semibold text-card text-xl ">Save</p>
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

export default DBNewItem;
