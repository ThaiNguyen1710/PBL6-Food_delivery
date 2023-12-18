import React, { useEffect, useState } from "react";
import { FcOpenedFolder } from "react-icons/fc";
import { FaDongSign } from "react-icons/fa6";

// import { storage } from "../../config/firebase.config";
import { useDispatch, useSelector } from "react-redux";
import {
  alertDanger,
  alertNULL,
  alertSuccess,
} from "../../context/actions/alertActions";
import { motion } from "framer-motion";
import { buttonClick } from "../../animations";
import { MdDelete } from "react-icons/md";
import { PostCreate, addNewCategory, getAllCategory, getAllProducts } from "../../api";
import { setAllProducts } from "../../context/actions/productAction";


const StoreAddItem = () => {
  const [itemName, setItemName] = useState("");
  // const [category, setCategory] = useState(null);
  const [idCategory, setIdCategory] = useState("");
  const [price, setPrice] = useState("");

  const [imageDownloadURL, setImageDownloadURL] = useState(null);
  const [information, setInformation] = useState("");
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const alert = useSelector((state) => state.alert);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [statusList, setStatusList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllCategory();

        if (res && res.data) {
          setStatusList(res.data);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const openAddCategory = () => {
    setIsNewCategory(true);
  };
  const closeAddCategory = () => {
    setIsNewCategory(false);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName) {
      dispatch(alertDanger("Please fill in all fields!"));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    } else {
      const data = {
        name: newCategoryName,
      };

      addNewCategory(data)
        .then((res) => {
          if (res && res.data) {
            console.log("New item added:", res);
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
      setIsNewCategory(false);
    }
  };

  const saveNewData = () => {
    if (!itemName) {
      dispatch(alertDanger("Please fill in all fields!"));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    } else {
      const formData = new FormData();

      formData.append("name", itemName);
      formData.append("user", user.user.userId);
      formData.append("price", price);
      formData.append("category", idCategory);
      formData.append("description", information);
      formData.append("image", imageDownloadURL);

      PostCreate(formData)
        .then((res) => {
          if (res && res.data) {
            dispatch(alertSuccess("Added Product!"));
            getAllProducts().then((data) => {
              dispatch(setAllProducts(data));
            });
            setTimeout(() => {
              dispatch(alertNULL());
            }, 3000);
            setItemName("");
            setPrice("");
            setIdCategory("");
            setInformation("");
            setImageDownloadURL("");
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
        {/* Kiểm tra và hiển thị dữ liệu */}
        {statusList && statusList.length > 0 ? (
          statusList.map((category) => (
            <p
              key={category.id}
              onClick={() => setIdCategory(category.id)}
              className={`px-3 py-2 rounded-md text-xl text-textColor font-semibold cursor-pointer hover: border backdrop-blur-md shadow-md border-gray-300 ${
                category.id === idCategory
                  ? "bg-red-400 text-white"
                  : "bg-transparent"
              }`}
            >
              {category.name}
            </p>
          ))
        ) : (
          <p>No data available</p>
        )}
        <div>
          {isNewCategory ? (
            <div className="modal">
              {/* Input để thêm category */}
              <div className="flex items-center justify-center">
                <input
                  type="text"
                  placeholder="New Category"
                  className="px-3 py-2 rounded-md text-xl text-textColor font-semibold border border-gray-300"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <button
                  onClick={handleAddCategory}
                  className="px-4 py-2 ml-2 bg-red-400 text-white rounded-md font-semibold cursor-pointer hover:bg-blue-300"
                  {...buttonClick}
                >
                  Add
                </button>
                <button
                  onClick={closeAddCategory}
                  className="px-4 py-2 ml-2 bg-red-400 text-white rounded-md font-semibold cursor-pointer hover:bg-blue-300 "
                  {...buttonClick}
                >
                  Back
                </button>
              </div>
            </div>
          ) : (
            <div
              className="px-3 py-2 rounded-md text-xl text-textColor font-semibold cursor-pointer hover:border backdrop-blur-md shadow-md border-red-300 bg-blue-200"
              onClick={openAddCategory}
            >
              Add Category +
            </div>
          )}
        </div>
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
            <FaDongSign className="text-red-400" />
          </span>
        </div>
        <InputValueField
          type="text"
          placeholder={"Information item"}
          stateValue={information}
          stateFunc={setInformation}
        />
      </div>
      <div className="w-[60%] bg-card backdrop-blur-md h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
  {imageDownloadURL && typeof imageDownloadURL !== 'string' ? (
    <div className="relative w-full h-full overflow-hidden rounded-md">
      <img
        src={URL.createObjectURL(imageDownloadURL)}
        className="h-full w-full object-cover"
        alt="Uploaded"
      />
      <button
        onClick={() => setImageDownloadURL(null)}
        type="button"
        className="absolute top-3 right-3 p-3 rounded-full bg-red-300 text-xl cursor-pointer outline-none hover:shadow-md duration-500 transition-all ease-in-out"
      >
        <MdDelete className="" />
      </button>
    </div>
  ) : (
    <>
      {!imageDownloadURL ? (
        <label>
          <div className="flex flex-col items-center justify-center h-full w-full cursor-pointer">
            <p className="text-6xl font-bold">
              <FcOpenedFolder className="" />
            </p>
            <p className="items-center justify-center flex font-semibold text-textColor">
              Click to upload image!
            </p>
          </div>
          <input
            type="file"
            name="upload-image"
            accept="image/*"
            onChange={(event) =>
              setImageDownloadURL(event.target.files[0])
            }
            className="w-0 h-0"
          ></input>
        </label>
      ) : (
        <p>No image selected</p>
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

export default StoreAddItem;
