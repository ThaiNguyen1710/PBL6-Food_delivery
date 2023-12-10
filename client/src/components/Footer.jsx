import { motion } from "framer-motion";
import React from "react";
import { faceLogo, igLogo, qrCode } from "../assets";
import { CiLocationOn } from "react-icons/ci";
import { FaPhoneAlt } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
const Footer = () => {
  return (
    <div className="w-full h-full bg-white ">
      <div className=" mt-1 flex flex-col items-center w-[80%] md:w-508 h-auto z-20 backdrop-blur-md p-4 px-4 py-2 mx-auto  gap-1">
        <p className="flex text-xl font-medium text-headingColor">
          THEO DÕI CHÚNG TÔI TRÊN{" "}
        </p>
        <div className="relative cursor-pointer flex gap-16">
          <motion.div
            className="w-14 h-14 rounded-full flex justify-center items-center "
            whileHover={{ scale: 1.15 }}
            referrerPolicy="no-referrer"
            onClick={() =>
              (window.location.href = "https://www.facebook.com/thaii17")
            }
          >
            <img src={faceLogo} alt="" className="w-full h-full" />
          </motion.div>

          <motion.div
            className="w-14 h-14 rounded-full flex justify-center items-center"
            whileHover={{ scale: 1.15 }}
            referrerPolicy="no-referrer"
            onClick={() =>
              (window.location.href = "https://www.instagram.com/thaii1710/")
            }
          >
            <img src={igLogo} alt="" className="w-full h-full" />
          </motion.div>
        </div>
        <div className="flex text-xl font-medium text-textColor gap-12">
          Facebook
          <p>Instagram</p>
        </div>
      </div>

      <motion.div className="w-full grid grid-cols-1 md:grid-cols-2 gap-96 px-64">
        <div className=" flex flex-col items-start justify-center gap-1">
          <p className="text-5xl text-headingColor md:text-4xl font-extrabold  tracking-wider pb-4">
            Thông tin liên hệ
          </p>
          <div className=" flex flex-col items-start px-8 justify-center gap-1">
          <p className="text-textColor text-xl  flex gap-4 font-semibold">
            <CiLocationOn className="text-gray-500 text-2xl" /> Đà Nẵng
          </p>
          <p className="text-textColor text-xl  flex gap-4 font-semibold">
            <FaPhoneAlt className="text-gray-500 text-2xl" /> 0365718545
          </p>
          <p className="text-textColor text-xl  flex gap-4 font-semibold pb-6">
            <HiOutlineMail className="text-gray-500 text-2xl" />{" "}
            thai.nguyen.171002@gmail.com
          </p>
          </div>
         
        </div>

        <div className=" flex flex-col items-start justify-center gap-1">
          <p className="text-5xl text-headingColor md:text-4xl font-extrabold  tracking-wider ">
            Scan QR here
          </p>
          <div className="items-center  px-16 justify-center w-full">
            {" "}
            <img
              src={qrCode}
              className="object-contain w-32 h-32 items-center justify-center"
              alt=""
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Footer;
