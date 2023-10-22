import React, { useState } from 'react'
import {motion} from 'framer-motion'
import { buttonClick, fadeInOut } from '../animations'

const LoginInput = ({
  placeHolder, 
  icon, 
  icon2,
  inputState, 
  inputStateFunc, 
  type, 
  isSignUp 
}) => {

    const [isFocus, setIsFocus] = useState(false)

  return(
    
    <motion.div
    {...fadeInOut}
    className={`flex items-center justify-center bg-cardOverlay gap-4 backdrop-blur-md rounded-md w-full px-4 py-1.5 ${
        isFocus ? " shadow-md shadow-red-300" : "shadow-none"
    }`}>
        {icon}
        <input type={type} placeholder={placeHolder} className='w-full h-full bg-transparent text-headingColor text-lg font-semibold border-none outline-none '

            value={inputState}
            onChange={(e) => inputStateFunc(e.target.value)}
            onFocus={()=> setIsFocus(true)}
            onBlur={()=> setIsFocus(false)}
        />
        <motion.div className='flex justify-center items-center text-xl cursor-pointer text-gray-600' {...buttonClick}>
        {icon2}
        </motion.div>
        
    </motion.div>
  )
}

export default LoginInput