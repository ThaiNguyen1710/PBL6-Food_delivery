import React, { useState } from 'react';
import { loginbg, logo } from '../assets';
import { LoginInput } from '../components';
import { FaEnvelope, FaLock } from 'react-icons/fa';


const Login = () => {

    const [userEmail, setUserEmail] = useState("")
    const [isSignUp, setIsSignUp] = useState(false)
    const [password, setPassword] = useState("")
    const [confirm_password, setConfirm_password] = useState("")

  return (
    <div className='w-screen h-screen relative overflow-hidden flex'>
        {/*background image */}
        <img src={loginbg} className='w-full h-full absolute object-cover top-0 left-0' alt=''></img>

        {/* container box */}
        <div className='flex flex-col items-center bg-cardOverlay w-[80%] md:w-508 h-screen z-10 backdrop-blur-md p-4 px-4 py-4 mx-auto gap-6' >
            <div className='flex items-center justify-start gap-4 w-full'>
                <img src={logo} className='w-20' alt=''/>
                <p className='flex font-bold text-5xl text-green-700'>6Ship</p>
            </div>

            {/* Welcome text  */}
            <p className='flex text-3xl font-semibold text-headingColor'>Welcome back! </p>
            <p className='text-xl  text-textColor -mt-6'>Sign in with following    </p>

            {/* input section */}
            <div className='w-full flex flex-col items-center justify-center gap-6 px-4 md:px-12 py-4'>

            <LoginInput 
                placeHolder={"Email Here "} 
                icon={<FaEnvelope className='text-xl text-textColor'/>}
                inputState={userEmail} 
                inputStateFunc={setUserEmail} 
                type="email" 
                isSignUp={isSignUp} 
            />

            <LoginInput 
                placeHolder={"Password Here"} 
                icon={<FaLock className='text-xl text-textColor'/>}
                inputState={password} 
                inputStateFunc={setPassword} 
                type="password" 
                isSignUp={isSignUp} 
            />

            </div>
            
        </div>
    </div>
  )
};

export default Login;