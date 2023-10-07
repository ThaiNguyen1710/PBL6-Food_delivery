import React from "react";
import { NavLink } from "react-router-dom";
import { logo } from "../assets";
import { isActiveStyles, isNotActiveStyles } from "../utils/styles";

const Header = () => {
  return (
    <header className="fixed backdrop-blur-md z-50 inset-x-0 top-0 flex justify-between items-center px-12 md:px-20 py-6">
      <NavLink to={"/"} className="flex items-center  gap-4">
        <img src={logo} className="w-16" alt="" />
        <p className="flex font-bold text-5xl text-green-700">6Food</p>
      </NavLink>

      <nav className="flex justify-center items-center gap-8">
        <ul className="hidden md:flex justify-center items-center gap-8 ">
          <NavLink
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
            to={"/"}
          >
            Home
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
            to={"/menu"}
          >
            Menu
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
            to={"/services"}
          >
            Services
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
            to={"/aboutus"}
          >
            About Us
          </NavLink>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
