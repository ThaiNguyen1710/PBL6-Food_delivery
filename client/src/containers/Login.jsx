import React, { useEffect, useState } from "react";
import { faceLogo, igLogo, logo, logo2 } from "../assets";
import { LoginInput } from "../components";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { FcGoogle, FcIphone } from "react-icons/fc";
import { motion } from "framer-motion";
import { buttonClick } from "../animations";
import { BsFillEyeSlashFill } from "react-icons/bs";
import { BiLogOutCircle } from "react-icons/bi";
import { loginUser, signUpUser} from "../api";

import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetail } from "../context/actions/userActions";
import {
  alertDanger,
  alertInfo,
  alertNULL,

} from "../context/actions/alertActions";
import { gradientStyle } from "../utils/styles";

const Login = () => {
  const [userEmail, setUserEmail] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirm_password] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm_newPassword, setConfirm_newPassword] = useState("");
  const [userName, setUserName] = useState("");
  
  // const provider = new GoogleAuthProvider();


  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const alert = useSelector((state) => state.alert);

  useEffect(() => {
    if (user) {
      
      navigate("/", { replace: true });
    }
  }, [user]);
  const loginWithGoogle = async () => {}

  // const loginWithGoogle = async () => {
  //   await signInWithPopup(firebaseAuth, provider).then((userCred) => {
  //     firebaseAuth.onAuthStateChanged((cred) => {
  //       if (cred) {
  //         cred.getIdToken().then((token) => {
  //           validateUserJWTToken(token).then((data) => {
  //             if (data.user_id === process.env.REACT_APP_ADMIN) {
  //               dispatch(setUserDetail(data));
  //               navigate("/dashboard/home", { replace: true });
  //             } else {
  //               dispatch(setUserDetail(data));
  //               navigate("/", { replace: true });
  //             }
  //           });
  //         });
  //       }
  //     });
  //   });
  // };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const signUpWithEmailPass = async () => {
    try {
      const userData = {
        name : userName,
        email: userEmail,
        password: password,
        // ...Thêm các trường thông tin người dùng khác tại đây nếu cần
      };
  
      const res = await signUpUser(userData); // Truyền đối tượng data vào hàm signUpUser
  
      console.log(res);
  
      if (res && res.data) {
        const token = res.data.token;
        localStorage.setItem("token", token); 
        console.log(token);
        dispatch(setUserDetail(res.data));
        navigate("/", { replace: true });
       
      } else {
        console.log("Đăng ký không thành công.");
      }
      
    } catch (error) {
      console.error("Lỗi khi đăng ký:", error);
    }
  };
  

    const signInWithEmailPass = async () => {
      if (userEmail !== "" && password !== "") {
        try {
          const res = await loginUser(userEmail, password);

          if (res && res.data) {
            const  token = res.data.token;
            localStorage.setItem("token", token);
            console.log(token)
            dispatch(setUserDetail(res.data));
            navigate("/", { replace: true });
          } else {
            console.log("Đăng nhập không thành công.");
          }
        } catch (error) {
          console.error("Lỗi khi đăng nhập:", error);
        }
      }
    };


  return (
    <div className="w-screen h-screen relative overflow-auto  bg-lighttextGray gap-4">
      {isForgot ? (
        <div className="w-full flex flex-col items-center justify-center px-4 ">
          <div className="flex flex-col items-center bg-cardOverlay  md:w-auto h-auto z-10 backdrop-blur-md   ">
            <div className="w-screen h-[5px] bg-green-300" />

            <NavLink to={"/login"} className="flex items-center gap-3">
              <img src={logo2} className="w-16" alt="" />
              <p className="flex font-bold text-3xl" style={gradientStyle}>6Food</p>
            </NavLink>
          </div>
          {/* container box */}
          <div className="  mt-3 flex flex-col  bg-cardOverlay w-[80%]  md:w-508 h-510 z-10 backdrop-blur-md p-4 px-4 py-1 mx-auto  gap-4">
            {/* Welcome text  */}
            <p className="text-xl text-center font-semibold text-headingColor">
              Quên mật khẩu{" "}
            </p>
            <p className="text-xl  text-textColor -mt-4 text-center">
              Nhập theo yêu cầu!
            </p>
            <motion.button
              {...buttonClick}
              onClick={() => setIsForgot(false)}
              className="flex justify-center items-center  w-10 h-10  rounded-md backdrop-blur-md  cursor-pointer shadow-md"
            >
              <BiLogOutCircle className="w-full h-full" />
            </motion.button>
            <div className="w-full flex flex-col items-center justify-center gap-4 px-4 md:px-12 py-1">
              <LoginInput
                placeHolder={"Email cần thay đổi"}
                icon={<FaEnvelope className="text-xl text-textColor" />}
                inputState={userEmail}
                inputStateFunc={setUserEmail}
                type="email"
                isSignUp={false}
              />

              <LoginInput
                placeHolder={"Nhập mật khẩu mới"}
                icon={<FaLock className="text-xl text-textColor" />}
                inputState={newPassword}
                inputStateFunc={setNewPassword}
                type={showPassword ? "text" : "password"}
                isSignUp={false}
                icon2={<BsFillEyeSlashFill onClick={toggleShowPassword} />}
              />

              <LoginInput
                placeHolder={"Xác nhận mật khẩu mới"}
                icon={<FaLock className="text-xl text-textColor" />}
                inputState={confirm_newPassword}
                inputStateFunc={setConfirm_newPassword}
                type={showPassword ? "text" : "password"}
                isSignUp={false}
                icon2={<BsFillEyeSlashFill onClick={toggleShowPassword} />}
              />

              <motion.button
                {...buttonClick}
                // onClick={forgotPass}
                className="bg-red-400 rounded-md w-full px-4 py-2 text-center text-xl text-white font-medium hover:bg-red-500 transition-all duration-100"
              >
                Reset Password
              </motion.button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center bg-cardOverlay  md:w-auto h-auto z-10 backdrop-blur-md   ">
            <div className="w-screen h-[5px] bg-green-300" />

            <div className="flex items-center gap-6">
              <img src={logo2} className="w-16" alt="" />
              <p className="flex font-bold text-3xl "style={gradientStyle}>6Food</p>
            </div>
          </div>
          {/* container box */}
          <div className="  mt-3 flex flex-col  bg-cardOverlay w-[80%] md:w-508 h-510 z-10 backdrop-blur-md p-4 px-4 py-1 mx-auto  gap-2.5">
            {/* Welcome text  */}
            <p className="text-xl text-center font-semibold text-headingColor">
              Chào Mừng!{" "}
            </p>
            <p className="text-xl  text-textColor -mt-4 text-center">
              {!isSignUp ? "Đăng nhập " : "Đăng ký "} bằng cách sau{" "}
            </p>

            {/* input section */}
            <div className="w-full flex flex-col items-center justify-center gap-4 px-4 md:px-12 py-1">
              <LoginInput
                placeHolder={"Email "}
                icon={<FaEnvelope className="text-xl text-textColor" />}
                inputState={userEmail}
                inputStateFunc={setUserEmail}
                type="email"
                isSignUp={isSignUp}
              />

              <LoginInput
                placeHolder={"Mật khẩu"}
                icon={<FaLock className="text-xl text-textColor" />}
                inputState={password}
                inputStateFunc={setPassword}
                type={showPassword ? "text" : "password"}
                isSignUp={isSignUp}
                icon2={<BsFillEyeSlashFill onClick={toggleShowPassword} />}
              />

              {isSignUp && (
                <LoginInput
                  placeHolder={"Xác nhận mật khẩu"}
                  icon={<FaLock className="text-xl text-textColor" />}
                  inputState={confirm_password}
                  inputStateFunc={setConfirm_password}
                  type={showPassword ? "text" : "password"}
                  isSignUp={isSignUp}
                  icon2={<BsFillEyeSlashFill onClick={toggleShowPassword} />}
                />
              )}

              {!isSignUp ? (
                <p className="font-medium">
                  Chưa có tài khoản tại 6Food? {""}
                  <motion.button
                    {...buttonClick}
                    className="text-cartNumBg bg-transparent cursor-pointer underline"
                    onClick={() => setIsSignUp(true)}
                  >
                    Đăng ký
                  </motion.button>
                </p>
              ) : (
                <p className="font-medium">
                  Đã có tài khoản tại 6Food? {"     "}
                  <motion.button
                    {...buttonClick}
                    className="text-cartNumBg bg-transparent cursor-pointer underline"
                    onClick={() => setIsSignUp(false)}
                  >
                    Đăng nhập
                  </motion.button>
                </p>
              )}

              {/* signin button */}
              {!isSignUp ? (
                <motion.button
                  {...buttonClick}
                  onClick={signInWithEmailPass}
                  className="bg-red-400 rounded-md w-full px-4 py-2 text-center text-xl text-white font-medium hover:bg-red-500 transition-all duration-100"
                >
                  Đăng Nhập
                </motion.button>
              ) : (
                <motion.button
                  {...buttonClick}
                  className="bg-red-400 rounded-md w-full px-4 py-2 text-center text-xl text-white font-medium hover:bg-red-500 transition-all duration-100"
                  onClick={signUpWithEmailPass}
                >
                  Đăng Ký
                </motion.button>
              )}
            </div>
            <div className="text-right font-medium items-center ">
              <motion.button
                {...buttonClick}
                className="text-red-500 cursor-pointer underline hover:text-red-700 "
                // onClick={forgotPass}
              >
                Quên mật khẩu?
              </motion.button>
            </div>

            <div className=" flex items-center justify-between gap-16">
              <div className="w-24 h-[1px] rounded-md bg-gray-500 "></div>
              <p className="text-gray-600 font-medium">hoặc</p>
              <div className="w-24 h-[1px] rounded-md bg-gray-500"></div>
            </div>

            <motion.div
              {...buttonClick}
              className="flex justify-start items-center bg-cardOverlay w-[80%] backdrop-blur-md cursor-pointer px-4 py-2 mx-auto rounded-3xl gap-10 "
              onClick={loginWithGoogle}
            >
              <FcGoogle className="text-3xl " />
              <div className="justify-center flex items-center ">
                <p className="flex text-center capitalize text-base text-headingColor font-medium">
                  Đăng Nhập Bằng Gmail
                </p>
              </div>
            </motion.div>
            <motion.div
              {...buttonClick}
              className=" flex justify-start items-center bg-cardOverlay w-[80%] backdrop-blur-md cursor-pointer px-4 py-2 mx-auto rounded-3xl gap-10"
              // onClick={loginWithPhone}
            >
              <FcIphone className="text-3xl" />
              <div className="justify-center flex items-center ">
                <p className="  flex text-center capitalize text-base text-headingColor font-medium  ">
                  Đăng Nhập Bằng Số Điện Thoại
                </p>
              </div>
            </motion.div>
          </div>
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
        </>
      )}
    </div>
  );
};

export default Login;
