import React, { useEffect, useState } from "react";
import { loginbg, logo } from "../assets";
import { LoginInput } from "../components";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { FcGoogle, FcIphone } from "react-icons/fc";
import { motion } from "framer-motion";
import { buttonClick, fadeInOut } from "../animations";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { app } from "../config/firebase.config";
import { validateUserJWTToken } from "../api";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetail } from "../context/actions/userActions";
import { alertDanger, alertInfo } from "../context/actions/alertActions";

const Login = () => {
  const [userEmail, setUserEmail] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirm_password] = useState("");

  const firebaseAuth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const alert = useSelector((state) => state.alert);

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user]);

  const loginWithGoogle = async () => {
    await signInWithPopup(firebaseAuth, provider).then((userCred) => {
      firebaseAuth.onAuthStateChanged((cred) => {
        if (cred) {
          cred.getIdToken().then((token) => {
            validateUserJWTToken(token).then((data) => {
              dispatch(setUserDetail(data));
            });
            navigate("/", { replace: true });
          });
        }
      });
    });
  };

  const signUpWithEmailPass = async () => {
    if (userEmail === "" || password === "" || confirm_password === "") {
      dispatch(alertInfo("Require fields should not be empty"));
    } else {
      if (password === confirm_password) {
        setUserEmail("");
        setPassword("");
        setConfirm_password("");
        await createUserWithEmailAndPassword(
          firebaseAuth,
          userEmail,
          password
        ).then((userCred) => {
          firebaseAuth.onAuthStateChanged((cred) => {
            if (cred) {
              cred.getIdToken().then((token) => {
                validateUserJWTToken(token).then((data) => {
                  dispatch(setUserDetail(data));
                });
                navigate("/", { replace: true });
              });
            }
          });
        });
      } else {
        dispatch(alertDanger("Password wrong!"));
      }
    }
  };

  const signInWithEmailPass = async () => {
    if (userEmail !== "" && password !== "") {
      await signInWithEmailAndPassword(firebaseAuth, userEmail, password).then(
        (userCred) => {
          firebaseAuth.onAuthStateChanged((cred) => {
            if (cred) {
              cred.getIdToken().then((token) => {
                validateUserJWTToken(token).then((data) => {
                  dispatch(setUserDetail(data));
                });
                navigate("/", { replace: true });
              });
            }
          });
        }
      );
    } else {
      dispatch(alertDanger("Password wrong!"));
    }
  };

  return (
    <div className="w-screen h-screen relative overflow-hidden  gap-4">
      {/*background image */}
      <img
        src={loginbg}
        className="w-full h-full absolute object-cover top-0 left-0"
        alt=""
      ></img>
      {/*Navbar*/}
      <div className="flex flex-col items-center bg-cardOverlay w-[80%] md:w-auto h-auto z-10 backdrop-blur-md   ">
        <div className="w-screen h-[5px] bg-green-300" />

        <div className="flex items-center gap-6">
          <img src={logo} className="w-16" alt="" />
          <p className="flex font-bold text-5xl text-green-700">6Food</p>
        </div>
      </div>
      {/* container box */}
      <div className="  mt-4 flex flex-col items-center bg-cardOverlay w-[80%] md:w-508 h-650 z-10 backdrop-blur-md p-4 px-4 py-4 mx-auto  gap-6">
        {/* Welcome text  */}
        <p className="flex text-3xl font-semibold text-headingColor">
          Welcome back!{" "}
        </p>
        <p className="text-xl  text-textColor -mt-6">
          {!isSignUp ? "Sign in " : "Sign up "} with following{" "}
        </p>

        {/* input section */}
        <div className="w-full flex flex-col items-center justify-center gap-6 px-4 md:px-12 py-4">
          <LoginInput
            placeHolder={"Email Here "}
            icon={<FaEnvelope className="text-xl text-textColor" />}
            inputState={userEmail}
            inputStateFunc={setUserEmail}
            type="email"
            isSignUp={isSignUp}
          />

          <LoginInput
            placeHolder={"Password Here"}
            icon={<FaLock className="text-xl text-textColor" />}
            inputState={password}
            inputStateFunc={setPassword}
            type="password"
            isSignUp={isSignUp}
          />
          {isSignUp && (
            <LoginInput
              placeHolder={"Confirm Password Here"}
              icon={<FaLock className="text-xl text-textColor" />}
              inputState={confirm_password}
              inputStateFunc={setConfirm_password}
              type="password"
              isSignUp={isSignUp}
            />
          )}

          {!isSignUp ? (
            <p className="font-medium">
              Doesn't have an account: {""}
              <motion.button
                {...buttonClick}
                className="text-cartNumBg bg-transparent cursor-pointer underline"
                onClick={() => setIsSignUp(true)}
              >
                Create one!
              </motion.button>
            </p>
          ) : (
            <p className="font-medium">
              Already have an account: {"     "}
              <motion.button
                {...buttonClick}
                className="text-cartNumBg bg-transparent cursor-pointer underline"
                onClick={() => setIsSignUp(false)}
              >
                Sign-in here
              </motion.button>
            </p>
          )}

          {/* signin button */}
          {!isSignUp ? (
            <motion.button
              {...buttonClick}
              onClick={signInWithEmailPass}
              className="bg-red-400 rounded-md w-full px-4 py-3 text-center text-xl text-white font-medium hover:bg-red-500 transition-all duration-100"
            >
              Sign In
            </motion.button>
          ) : (
            <motion.button
              {...buttonClick}
              className="bg-red-400 rounded-md w-full px-4 py-3 text-center text-xl text-white font-medium hover:bg-red-500 transition-all duration-100"
              onClick={signUpWithEmailPass}
            >
              Sign Up
            </motion.button>
          )}
        </div>

        <div className="flex items-center justify-between gap-16">
          <div className="w-24 h-[1px] rounded-md bg-gray-500 "></div>
          <p className="text-gray-600 font-medium">or</p>
          <div className="w-24 h-[1px] rounded-md bg-gray-500"></div>
        </div>

        <motion.div
          {...buttonClick}
          className="flex justify-center items-center px-20 py-2 bg-cardOverlay  backdrop-blur-md cursor-pointer rounded-3xl gap-4"
          onClick={loginWithGoogle}
        >
          <FcGoogle className="text-3xl " />
          <p className="capitalize text-base text-headingColor font-medium">
            SignIn With Google
          </p>
        </motion.div>
        <motion.div
          {...buttonClick}
          className="flex justify-center items-center px-20 py-2 bg-cardOverlay  backdrop-blur-md cursor-pointer rounded-3xl gap-4"
          onClick={loginWithGoogle}
        >
          <FcIphone className="text-3xl " />
          <p className="capitalize text-base text-headingColor font-medium">
            SignIn With Phone
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
