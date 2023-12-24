import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { IoFastFood } from "react-icons/io5";
import { getAllCategory } from "../../api";
import SliderCard from "../ClientUI/SliderCard";
import { BsToggles2 } from "react-icons/bs";
import { MdSearch } from "react-icons/md";
import { buttonClick } from "../../animations";

const StoreSection = (data) => {
  const product = useSelector((state) => state.products);
  const [category, setCategory] = useState("");
  const [statusList, setStatusList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

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

  const storeCategoryIds = product
    ? product
        .filter((category) => category.user.id === data?.data?.[0]?.id)
        .map((data) => data.category.id)
    : [];

  const filteredStatusList = statusList
    ? statusList.filter((data) => storeCategoryIds.includes(data._id))
    : [];

  const filteredProducts = product
    ? product.filter((data1) => {
        return (
          data1.category.name === category &&
          data1.user.store === data?.data?.[0]?.store &&
          data1.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    : [];

  console.log(filteredProducts);

  return (
    <motion.div className="w-full flex items-start justify-start flex-col ">
      <div className="w-full flex items-center justify-between">
        <div className="flex flex-col items-start justify-start gap-1">
          <p className="text-2xl text-headingColor font-bold">Thực Đơn </p>
          <div className="w-40 h-1 rounded-md bg-orange-500"></div>
        </div>
      </div>
      <motion.div className="w-full flex pt-12 gap-12">
        <motion.div className="w-300 h-auto bg-slate-200 rounded-lg px-2 py-2 pt-4 gap-6 items-center justify-center">
          <p className="text-2xl font-semibold text-center text-orange-500">
            Danh mục
          </p>
          <div className="w-full grid grid-cols-auto-flow gap-4 pt-6">
            {filteredStatusList.map((data, index) => (
              <FilterCard
                key={index}
                data={data}
                category={category}
                setCategory={setCategory}
              />
            ))}
          </div>
        </motion.div>
        <div className=" gap-6  bg-slate-200 w-full">
          <div className="w-full h-14 flex justify-center rounded-md bg-slate-300 items-center px-6 gap-96 py-4">
            <motion.div
              {...buttonClick}
              className="flex w-[60%] bg-slate-100 gap-3 px-4 py-2 rounded-md backdrop-blur-md shadow-md items-center justify-between"
            >
              <MdSearch className="text-gray-400 text-2xl" />
              <input
                type="text"
                placeholder="Tìm kiếm tên sản phẩm"
                className="border-none outline-none font-medium bg-transparent text-base text-textColor cursor-pointer"
                onChange={handleSearch}
                value={searchTerm}
              />
              <BsToggles2 className="text-gray-400 text-2xl ml-auto" />
            </motion.div>
          </div>
          <div className="w-full flex items-center justify-evenly flex-wrap gap-4 py-8">
            {filteredProducts
              .filter(
                (data) =>
                  data.category.name === category &&
                 
                  data.isFeatured === true
              )
              .map((data, i) => (
                <SliderCard key={i} data={data} index={i} />
              ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const FilterCard = ({ data, category, setCategory }) => {
  return (
    <motion.div
      onClick={() => setCategory(data.name)}
      className={`group w-64 min-w-[128px] cursor-pointer rounded-md ${
        category === data.name ? "bg-red-500" : "bg-primary"
      } hover:bg-red-500 shadow-md flex items-center gap-4`}
    >
      <div className="w-10 h-10 rounded-full shadow-md flex items-center justify-center group-hover:bg-primary">
        <IoFastFood
          className={`${
            category === data.name ? "text-primary" : "text-red-500"
          } group-hover:text-red-500`}
        />
      </div>
      <p
        className={`text-xl font-semibold ${
          category === data.name ? "text-primary" : "text-textColor"
        }`}
      >
        {data.name}
      </p>
    </motion.div>
  );
};

export default StoreSection;
