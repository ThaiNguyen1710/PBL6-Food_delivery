import React from "react";
import Header from "./Header";
import { Bill } from "../assets";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";


const CheckOutSuccess = () => {
 
  return (
    <main className="w-screen min-h-screen flex items-center justify-start flex-col">
      <Header />
      <div className="w-full flex flex-col items-center justify-center mt-24 px-6 md:px-24 2xl:px-96 gap-12 pb-24">
        <img src={Bill} alt="" className="w-full md:w-656 " />
        <h1 className="text-[50px] text-headingColor font-bold" > Amount paid Successfully</h1>
        <motion.div>
            <NavLink to={"/"}
            className="flex items-center justify-center gap4 cursor-pointer text-2xl text-textColor font-semibold px-4 py-2 rounded-md border border-gray-300 hover:shadow-md">


                <FaArrowLeft  className="text-3xl text-textColor "/>
                <FaArrowLeft  className="text-3xl text-textColor "/>
                Get back to home
            </NavLink>
        </motion.div>
      </div>
    </main>
  );
};

export default CheckOutSuccess;
