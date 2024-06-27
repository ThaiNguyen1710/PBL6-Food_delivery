import React, { useEffect } from "react";
import DataTable from "./DataTable";
import { useDispatch, useSelector } from "react-redux";
import { setAllUserDetail } from "../../context/actions/allUsersAction";
import { baseURL, editUser, getAllUsers } from "../../api";
import { avatar } from "../../assets";

import { alertNULL, alertSuccess } from "../../context/actions/alertActions";

const DBStore = () => {
  const allUsers = useSelector((state) => state.allUsers);


  const dispatch = useDispatch();
  const isStore = allUsers
    ? allUsers.filter((store) => store?.closeAt !== null)
    : [];



  useEffect(() => {
    if (!allUsers) {
      getAllUsers().then((data) => {
        dispatch(setAllUserDetail(data));
      });
    }
  });

  const blockStore = async (rowData) => {
    try {
      const userId = rowData.id;
      const newData = {
        isStore: !rowData.isStore,
      };

      const updatedUserData = await editUser(userId, newData);

      if (updatedUserData) {
        getAllUsers().then((data) => {
          dispatch(setAllUserDetail(data));
        });
        dispatch(alertSuccess("Cập nhật thành công  "));
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
      } else {
        throw new Error("Failed to update user information");
      }
    } catch (error) {
      console.error("Error updating user information:", error);
    }
  };
  return (
    <div className="flex justify-center items-center gap-4 pt-6 w-full">
      <DataTable
        columns={[
          {
            title: <p className="font-semibold font-sans text-xl">Avatar</p>,
            field: "photoURL",
            render: (rowData) => (
              <img
                src={
                  baseURL + rowData.imgStore
                    ? baseURL + rowData.imgStore
                    : avatar
                }
                className="w-32 h-16 object-cover rounded-md"
                alt=""
              />
            ),
          },
          {
            title: <p className="font-semibold font-sans text-xl">Tên</p>,
            field: "store",
            render: (rowData) => (
              <p className="text-textColor font-sans font-medium ">{rowData.store}</p>
            ),
          },

          {
            title: <p className="font-semibold font-sans text-xl">Chủ cửa hàng</p>,
            field: "name",
            render: (rowData) => (
              <p className="text-textColor font-sans font-medium ">{rowData.name}</p>
            ),
          },

          {
            title: <p className="font-semibold font-sans text-xl">Địa chỉ</p>,
            field: "address",
            render: (rowData) => (
              <p className="text-textColor font-sans font-medium ">{rowData.address}</p>
            ),
          },
          {
            title: <p className="font-semibold font-sans text-xl">Mở cửa</p>,
            field: "openAt",
            render: (rowData) => (
              <p className="text-textColor font-sans font-medium ">{rowData.openAt}</p>
            ),
          },
          {
            title: <p className="font-semibold font-sans text-xl">Đóng cửa</p>,
            field: "closeAt",
            render: (rowData) => (
              <p className="text-textColor font-sans font-medium ">{rowData.closeAt}</p>
            ),
          },
          {
            title: <p className="font-semibold font-sans text-xl">Khóa</p>,
            field: "isStore",
            render: (rowData) => (
              <select
                value={rowData.isStore}
                onChange={() => blockStore(rowData)}
                className="border rounded-md bg-cardOverlay w-32 h-10 font-semibold font-sans"
                style={{ color: rowData.isStore === true ? "blue" : "red" }}
              >
                <option value="true" className="font-semibold font-sans text-blue-500">
                  Hoạt động
                </option>
                <option value="false" className="font-semibold font-sans text-red-500">
                  Khóa
                </option>
              </select>
            ),
          },
        ]}
        data={isStore}
        title={
          <p className="font-semibold font-sans text-amber-500 text-3xl">Danh sách cửa hàng</p>
        }
      />
    </div>
  );
};

export default DBStore;
