import { motion } from 'framer-motion'
import React from 'react'
import { faceLogo, igLogo } from '../assets'

const Footer = () => {
  return (
    <div className='w-full h-full bg-white '>
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
                  (window.location.href =
                    "https://www.instagram.com/thaii1710/")
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
    </div>
  )
}

export default Footer