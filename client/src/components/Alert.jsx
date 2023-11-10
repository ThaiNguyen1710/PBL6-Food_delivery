import { motion } from 'framer-motion'
import React from 'react'
import { fadeInOut } from '../animations'
import { FaCheckCircle } from 'react-icons/fa'
import {AiFillWarning} from 'react-icons/ai'
import {BsExclamationCircleFill} from 'react-icons/bs'


const Alert = ({type, message}) => {
  if (type === "success"){
    return (
    <motion.div {...fadeInOut}
    className='fixed z-50 top-24 right-6 px-4 py-1.5 rounded-md backdrop-blur-sm bg-emerald-300 shadow-md flex items-center gap-4'
    >
      <FaCheckCircle className='text-xl font-bold text-emerald-700'/>
      <p className='text-xl font-medium text-emerald-700'>{message}</p>
      
    </motion.div>
    )
  }

  if (type === "warning"){
    return (
    <motion.div {...fadeInOut}
    className='fixed z-50 top-24 right-6 px-4 py-2 rounded-md backdrop-blur-sm bg-orange-300 shadow-md flex items-center gap-4'
    >
      <AiFillWarning className='text-xl font-bold text-orange-700'/>
      <p className='text-xl font-medium text-orange-700'>{message}</p>
      
    </motion.div>
    )
  }

  if (type === "danger"){
    return (
    <motion.div {...fadeInOut}
    className='fixed z-50 top-24 right-6 px-4 py-2 rounded-md backdrop-blur-sm bg-red-300 shadow-md flex items-center gap-4'
    >
      <BsExclamationCircleFill className='text-xl font-bold text-red-700'/>
      <p className='text-xl font-medium text-red-700'>{message}</p>
      
    </motion.div>
    )
  }

  if (type === "info"){
    return (
    <motion.div {...fadeInOut}
    className='fixed z-50 top-24 right-6 px-4 py-2 rounded-md backdrop-blur-sm bg-blue-300 shadow-md flex items-center gap-4'
    >
      <BsExclamationCircleFill className='text-xl font-bold text-blue-700'/>
      <p className='text-xl font-medium text-blue-700'>{message}</p>
      
    </motion.div>
    )
  }

  
  
}

export default Alert