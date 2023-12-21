import React, { useEffect, useState } from "react";
import { faceLogo, igLogo,  logo2 } from "../assets";
import { LoginInput } from "../components";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import { buttonClick } from "../animations";
import { BsFillEyeSlashFill } from "react-icons/bs";
import { BiLogOutCircle } from "react-icons/bi";
import { editUser, getAllUsers, loginUser, signUpUser } from "../api";

import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetail } from "../context/actions/userActions";
import {
  alertDanger,
  alertNULL,
  alertSuccess,
  alertWarning,
} from "../context/actions/alertActions";
import { gradientStyle } from "../utils/styles";
import { setAllUserDetail } from "../context/actions/allUsersAction";

const Login = () => {
  const [userEmail, setUserEmail] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirm_password] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isForgot, setIsForgot] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirm_newPassword, setConfirm_newPassword] = useState("");


  // const provider = new GoogleAuthProvider();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const allUser = useSelector((state) => state.allUsers);


  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
      window.location.reload();
    }
  });

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const loginWithGoogle = async () => {};

  //SIGN UP

  const signUpWithEmailPass = async () => {
    if (userEmail !== "" && password !== "" && confirm_password !== "") {
      try {
        if (password === confirm_password) {
          const userData = {
            name: userEmail,
            email: userEmail,
            password: password,
          };
          const res = await signUpUser(userData);
  
          if (res) {
            getAllUsers().then((data) => {
              dispatch(setAllUserDetail(data));
            });
            dispatch(alertSuccess("Đăng ký thành công! Hãy đăng nhập!  "));
            setIsSignUp(false);
            setPassword("")
            setConfirm_password("")
            setTimeout(() => {
              dispatch(alertNULL());
            }, 3000);
          } else {
            dispatch(alertDanger("Email đã được đăng ký "));
  
            setTimeout(() => {
              dispatch(alertNULL());
            }, 3000);
          }
        }else {
          dispatch(alertWarning("Mật khẩu không khớp!"));
          setTimeout(() => {
            dispatch(alertNULL());
          }, 3000);
        }
       
      } catch (error) {
        console.error("Lỗi khi đăng ký:", error);
      }
    } else {
      if (userEmail === "" && password === "" && confirm_password === "") {
        dispatch(alertWarning("Vui lòng nhập email và mật khẩu!"));
      } else if (userEmail === "") {
        dispatch(alertWarning("Vui lòng nhập địa chỉ email!"));
      } else if (password === "") {
        dispatch(alertWarning("Vui lòng nhập mật khẩu!"));
      } else if (confirm_password === "") {
        dispatch(alertWarning("Vui lòng xác nhận mật khẩu!"));
      }
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    }
  };

  //SIGN IN

  const signInWithEmailPass = async () => {
    if (userEmail !== "" && password !== "") {
      try {
        const res = await loginUser(userEmail, password);

        if (res && res.data) {
          const token = res.data.token;
          localStorage.setItem("token", token);

          dispatch(setUserDetail(res.data));
          navigate("/", { replace: true });
        } else {
          console.log("Đăng nhập không thành công.");
        }
      } catch (error) {
        console.error("Lỗi khi đăng nhập:", error);

        if (error.response && error.response.status === 400) {
          const errorMessage = error.response.data;

          if (errorMessage === "The user not found") {
            dispatch(alertWarning("Email chưa đăng ký!"));
          } else if (errorMessage === "Password is wrong!") {
            dispatch(alertWarning("Mật khẩu sai!"));
          } else {
            console.log("Lỗi không xác định từ server.");
          }
        }
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
      }
    } else {
      if (userEmail === "" && password === "") {
        dispatch(alertWarning("Vui lòng nhập email và mật khẩu!"));
      } else if (userEmail === "") {
        dispatch(alertWarning("Vui lòng nhập địa chỉ email!"));
      } else if (password === "") {
        dispatch(alertWarning("Vui lòng nhập mật khẩu!"));
      }

      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    }
  };

  //FORGOT PASS

  const forgotPass = async () => {
    if (userEmail !== "" && newPassword !== "" && confirm_newPassword !== "") {
      try {
        const userId = allUser
          ? allUser.filter((id) => id.email === userEmail)
          : [];
        if (userId.length === 1) {
          if (newPassword === confirm_newPassword) {
            const newData = {
              password: newPassword,
            };

            const updatedUserData = await editUser(userId?.[0]?.id, newData);

            if (updatedUserData) {
              getAllUsers().then((data) => {
                dispatch(setAllUserDetail(data));
              });
              dispatch(alertSuccess("Cập nhật thành công! Hãy đăng nhập!  "));
              setIsForgot(false);
              setNewPassword("");
              setTimeout(() => {
                dispatch(alertNULL());
              }, 3000);
            } else {
              throw new Error("Failed to update user information");
            }
          } else {
            dispatch(alertWarning("Mật khẩu không khớp!"));
            setTimeout(() => {
              dispatch(alertNULL());
            }, 3000);
          }
        } else {
          dispatch(alertWarning("Email chưa đăng ký!"));
          setTimeout(() => {
            dispatch(alertNULL());
          }, 3000);
        }
      } catch (error) {
        console.error("Error updating user information:", error);
      }
    } else {
      if (
        userEmail === "" &&
        newPassword === "" &&
        confirm_newPassword === ""
      ) {
        dispatch(alertWarning("Vui lòng nhập email và mật khẩu!"));
      } else if (userEmail === "") {
        dispatch(alertWarning("Vui lòng nhập địa chỉ email!"));
      } else if (newPassword === "") {
        dispatch(alertWarning("Vui lòng nhập mật khẩu mới!"));
      } else if (confirm_newPassword === "") {
        dispatch(alertWarning("Vui lòng xác nhận mật khẩu!"));
      }
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    }
  };

  const isForgotPass = async () => {
    setIsForgot(true);
  };
 

  return (
    <div className="w-screen h-screen relative overflow-auto  bg-lighttextGray gap-4">
      {isForgot ? (
        <div className="w-full flex flex-col items-center justify-center px-4 ">
          <div className="flex flex-col items-center bg-cardOverlay  md:w-auto h-auto z-10 backdrop-blur-md   ">
            <div className="w-screen h-[5px] bg-green-300" />

            <NavLink to={"/"} className="flex items-center gap-3">
              <img src={logo2} className="w-16" alt="" />
              <p className="flex font-bold text-3xl" style={gradientStyle}>
                6Food
              </p>
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
                onClick={forgotPass}
                className="bg-red-400 rounded-md w-full px-4 py-2 text-center text-xl text-white font-medium hover:bg-red-500 transition-all duration-100"
              >
                Đặt Mới Mật Khẩu
              </motion.button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center bg-cardOverlay  md:w-auto h-auto z-10 backdrop-blur-md   ">
            <div className="w-screen h-[5px] bg-green-300" />
            <NavLink to={"/"} className="flex items-center gap-3">
              <img src={logo2} className="w-16" alt="" />
              <p className="flex font-bold text-3xl" style={gradientStyle}>
                6Food
              </p>
            </NavLink>
          </div>
          {/* container box */}
          <div className="  mt-8 flex flex-col  bg-cardOverlay w-[80%] md:w-508 h-[70%] z-10 backdrop-blur-md p-4 px-4 py-1 mx-auto  gap-2.5">
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
                  placeHolder={"Xác nhận mật khẩu!"}
                  icon={<FaLock className="text-xl text-textColor" />}
                  inputState={confirm_password}
                  inputStateFunc={setConfirm_password}
                  type="text"
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
                onClick={isForgotPass}
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
              className="mt-4 flex justify-start items-center bg-cardOverlay w-[80%] backdrop-blur-md cursor-pointer px-4 py-2 mx-auto rounded-3xl gap-10 "
              onClick={loginWithGoogle}
            >
              <FcGoogle className="text-3xl " />
              <div className="justify-center flex items-center ">
                <p className="flex text-center capitalize text-base text-headingColor font-medium">
                  Đăng Nhập Bằng Gmail
                </p>
              </div>
            </motion.div>
            {/* <motion.div
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
            </motion.div> */}
          </div>
          <div className=" mt-2 flex flex-col items-center w-[80%] md:w-508 h-auto z-20 backdrop-blur-md p-4 px-4 py-2 mx-auto  gap-1">
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
