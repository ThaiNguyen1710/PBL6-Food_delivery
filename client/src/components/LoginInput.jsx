import React, { useState } from 'react'

const LoginInput = ({placeHolder, icon, inputState, inputStateFunc, type, isSignUp }) => {

    const [isFocus, setIsFocus] = useState(false)

  return(
    <div className={`flex items-center justify-center bg-cardOverlay gap-4 backdrop-blur-md rounded-md w-full px-4 py-2 ${
        isFocus ? " shadow-md shadow-red-300" : "shadow-none"
    }`}>
        {icon}
        <input type={type} placeholder={placeHolder} className='w-full h-full bg-transparent text-headingColor text-lg font-semibold border-none outline-none '

            value={inputState}
            onChange={(e) => inputStateFunc(e.target.value)}
            onFocus={()=> setIsFocus(true)}
            onBlur={()=> setIsFocus(false)}
        />
    </div>
  )
}

export default LoginInput