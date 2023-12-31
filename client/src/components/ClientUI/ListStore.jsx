import { motion } from "framer-motion";
import React, { useState } from "react";
import { buttonClick } from "../../animations";
import { FaArrowRight } from "react-icons/fa6";
import { logo2 } from "../../assets";

import StoreCard from "../Store/StoreCard";
import { useSelector } from "react-redux";
import { MdSearch } from "react-icons/md";
import { BsToggles2 } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import { isActiveStyles, isNotActiveStyles } from "../../utils/styles";

const ListStore = () => {
  const allUser = useSelector((state) => state.allUsers);
  const isStore = allUser
    ? allUser.filter((store) => store.isStore === true)
    : [];

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredStoresBySearch = isStore.filter((store) => {
    const searchString = searchTerm.toLowerCase();
    const storeAddress = store.address ? store.address.toLowerCase() : "";
    const storeName = store.store ? store.store.toLowerCase() : "";
    const selected = selectedDistrict.toLowerCase();

    const isMatchingDistrict = !selected || storeAddress.includes(selected);

    const isMatchingSearch =
      storeName.includes(searchString) || storeAddress.includes(searchString);

    return isMatchingDistrict && isMatchingSearch;
  });




  const [currentPage, setCurrentPage] = useState(1);
  const storesPerPage = 4;

  const indexOfLastStore = currentPage * storesPerPage;
  const indexOfFirstStore = indexOfLastStore - storesPerPage;
  const currentStores = filteredStoresBySearch.slice(
    indexOfFirstStore,
    indexOfLastStore
  );


    const totalPages = Math.ceil(filteredStoresBySearch.length / storesPerPage);

    const handlePagination = (page) => {
      setCurrentPage(page);
    };
  
    const prevPage = () => {
      setCurrentPage((prev) => Math.max(prev - 1, 1));
    };
  
    const nextPage = () => {
      setCurrentPage((prev) =>
        Math.min(prev + 1, Math.ceil(filteredStoresBySearch.length / storesPerPage))
      );
    };

  return (
    <motion.div className="w-full flex pt-12 gap-12 pb-6">
      <motion.div className="w-[25%] h-300 bg-white rounded-lg px-2 py-2 items-start justify-center">
        <div className="w-full gap-2 flex pb-2 ">
          <img alt="" src={logo2} className="w-10 h-10 object-contain" />
          <p className="text-2xl font-semibold text-center ">
            Danh sách cửa hàng
          </p>
        </div>
        <div className="w-full h-[1px] rounded-md bg-gray-500 "></div>

        <div className=" flex flex-col items-start px-2 justify-center gap-6 pt-6">
          <motion.div
            className=" cursor-pointer flex gap-4 justify-center items-center text-textColor  "
            {...buttonClick}
          >
            <div className=" flex items-center gap-9 justify-center">
              {/* <p className="text-xl  font-semibold">Khu vực</p> */}
              <NavLink
                className={({ isActive }) =>
                  isActive ? isActiveStyles : isNotActiveStyles
                }
                to={"/listStore"}
                onClick={() => {
                  const homeSlider = document.getElementById("listStore");
                  if (homeSlider) {
                    homeSlider.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Khám Phá
              
              </NavLink>
              <FaArrowRight className="text-xl text-end" />
            </div>
          </motion.div>

          <motion.div
            className=" cursor-pointer flex gap-4 text-textColor  "
            {...buttonClick}
          >
            <div className="items-center justify-center gap-8  flex">
              {/* <p className="text-xl  font-semibold">Khu vực</p> */}
              <NavLink
                className={({ isActive }) =>
                  isActive ? isActiveStyles : isNotActiveStyles
                }
                to={"/filterSection"}
                onClick={() => {
                  const homeSlider = document.getElementById("filterSection");
                  if (homeSlider) {
                    homeSlider.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
               Danh Mục
              
              </NavLink>
              <FaArrowRight className="text-xl text-end" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className=" gap-6  bg-white w-full">
        <div className="w-full h-12 flex justify-center rounded-md bg-slate-300 items-center px-6 gap-96 py-4 ">
          <motion.div
            className="flex  bg-slate-100 gap-3 px-4 py-2 rounded-md backdrop-blur-md shadow-md"
            {...buttonClick}
          >
            <MdSearch className="text-gray-400 text-2xl" />
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="border-none outline-none font-medium bg-transparent text-base text-textColor cursor-pointer"
              onChange={handleSearch}
              value={searchTerm}
            />
            <BsToggles2 className="text-gray-400 text-2xl" />
          </motion.div>
          <div className="justify-end items-center">
            <select
              className="w-32 h-8  rounded-md border-none focus:outline-none text-sm font-semibold cursor-pointer"
              onChange={handleDistrictChange}
              value={selectedDistrict}
            >
              <option value="" disabled hidden className="text-center">
                ---Quận/Huyện---
              </option>
              <option value="">---Quận/Huyện---</option>
              <optgroup label="Quận">
                <option value="Liên Chiểu">Quận Liên Chiểu</option>
                <option value="Hải Châu">Quận Hải Châu</option>
                <option value="Thanh Khê">Quận Thanh Khê</option>
                <option value="Cẩm Lệ">Quận Cẩm Lệ</option>
                <option value="Sơn Trà">Quận Sơn Trà</option>
                <option value="Ngũ Hành Sơn">Quận Ngũ Hành Sơn</option>
              </optgroup>
              <optgroup label="Huyện">
                <option value="Hòa Vang">Huyện Hòa Vang</option>
              </optgroup>
            </select>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-4 py-4">
        {currentStores.length > 0 ? (
          currentStores.map((store, index) => (
            <StoreCard key={index} data={store} />
          ))
        ) : (
          <p>No matching stores found</p>
        )}
      </div>

      {/* Nút chuyển trang */}
      <div className="flex items-center justify-center gap-4 pb-2">
        <motion.button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="text-xl font-semibold cursor-pointer hover:text-red-400 "
          {...buttonClick}
        >
          Prev
        </motion.button>

        {Array.from({ length: totalPages }, (_, i) => (
          <motion.button
            key={i + 1}
            onClick={() => handlePagination(i + 1)}
            className={`${
              currentPage === i + 1 ? "bg-gray-300  px-2 py-1 hover:bg-red-300 font-medium rounded-md backdrop-blur-md shadow-md" : "bg-cardOverlay text-black  px-2 py-1 hover:bg-red-300 font-medium rounded-md backdrop-blur-md shadow-md"
            } px-3 py-1 rounded-md`}
            {...buttonClick}
          >
            {i + 1}
          </motion.button>
        ))}

        <motion.button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="text-xl font-semibold cursor-pointer hover:text-red-400 "
          {...buttonClick}
        >
          Next
        </motion.button>
      </div>
      </div>
    </motion.div>
  );
};

export default ListStore;
