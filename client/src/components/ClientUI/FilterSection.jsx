import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { IoFastFood } from "react-icons/io5";
import SliderCard from "./SliderCard";
import { getAllCategory } from "../../api";

const FilterSection = () => {
  const [category, setCategory] = useState("Đồ Ăn Nhanh");
  const product = useSelector((state) => state.products);
  const allUser = useSelector((state)=> state.allUsers)
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
  
  // const isStore = product?product.filter((item)=> item.user.id === allUser.id) :[]
  // console.log(isStore)

  return (
    <motion.div className="w-full flex items-start justify-start flex-col ">
      <div className="w-full flex items-center justify-between">
        <div className="flex flex-col items-start justify-start gap-1">
          <p className="text-2xl text-headingColor font-bold">Danh Mục </p>
          <div className="w-40 h-1 rounded-md bg-orange-500"></div>
        </div>
      </div>
      <div className="w-full overflow-x-scroll pt-6 flex items-center justify-start gap-6 py-8">
        {statusList.map((data, index) => (
          <FilterCard
            key={index}
            data={data}
            category={category}
            setCategory={setCategory}
          />
        ))}
      </div>
      <div className="w-full flex items-center justify-evenly flex-wrap gap-4 mt-12">
        {product &&
          product
            .filter((data) => data.category.name === category && data.user.isStore === true)
            .map((data, i) => <SliderCard key={i} data={data} index={i} />)}
      </div>
    </motion.div>
  );
};

export const FilterCard = ({ data, category, setCategory }) => {
  return (
    <motion.div
      onClick={() => setCategory(data.name)} 
      className={`group w-28 min-w-[128px] cursor-pointer rounded-md py-6 ${
        category === data.name ? "bg-red-500" : "bg-primary"
      } hover:bg-red-500 shadow-md flex flex-col items-center justify-center gap-4`}
    >
      <div
        className={`w-10 h-10 rounded-full shadow-md flex items-center justify-center group-hover:bg-primary ${
          category === data.name ? "bg-primary" : "bg-red-500"
        }`}
      >
        <IoFastFood
          className={`${
            category === data.name ? "text-red-500" : "text-primary"
          } group-hover:text-red-500`}
        />
      </div>
      <p
        className={`text-xl text-center font-semibold ${
          category === data.name ? "text-primary" : "text-textColor"
        }`}
      >
        {data.name}
      </p>
    </motion.div>
  );
};

export default FilterSection;