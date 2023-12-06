import React, { useEffect, useState } from "react";
import DataTable from "./DataTable";
import { useDispatch, useSelector } from "react-redux";
import { setAllUserDetail } from "../../context/actions/allUsersAction";
import { editUser, getAllUsers } from "../../api";
import { avatar } from "../../assets";
import { setUserDetail } from "../../context/actions/userActions";
import { alertNULL, alertSuccess } from "../../context/actions/alertActions";

const DBStore = () => {
  const allUsers = useSelector((state) => state.allUsers);
  const product = useSelector((state) => state.products);

  const [isBlock, setIsBlock] = useState("");
  const dispatch = useDispatch();
  const isStore = allUsers
    ? allUsers.filter((store) => store?.isStore === true)
    : [];

  useEffect(() => {
    if (!allUsers) {
      getAllUsers().then((data) => {
        dispatch(setAllUserDetail(data));
      });
    }
  }, []);

  const blockStore = async (rowData) => {
    try {
      const userId = rowData.id; // Lấy ID của người dùng từ rowData
      const newData = {
        isStore: !rowData.isStore, // Đảo ngược giá trị isStore khi block/unblock
      };

      const updatedUserData = await editUser(userId, newData);

      if (updatedUserData && updatedUserData.data) {
        // Cập nhật dữ liệu người dùng và thông báo thành công
        dispatch(setUserDetail(updatedUserData.data));
        dispatch(alertSuccess("User information updated successfully"));
      } else {
        throw new Error("Failed to update user information");
      }
    } catch (error) {
      console.error("Error updating user information:", error);
      dispatch(alertSuccess("Cập nhật thành công  "));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    }
  };
  return (
    <div className="flex justify-center items-center gap-4 pt-6 w-full">
      <DataTable
        columns={[
          {
            title: <p className="font-semibold text-xl">Avatar</p>,
            field: "photoURL",
            render: (rowData) => (
              <img
                src={rowData.photoURL ? rowData.photoURL : avatar}
                className="w-32 h-16 object-contain rounded-md"
                alt=""
              />
            ),
          },
          {
            title: <p className="font-semibold text-xl">Name</p>,
            field: "store",
            render: (rowData) => (
              <p className="text-textColor font-medium ">{rowData.store}</p>
            ),
          },

          {
            title: <p className="font-semibold text-xl">Owner</p>,
            field: "name",
            render: (rowData) => (
              <p className="text-textColor font-medium ">{rowData.name}</p>
            ),
          },

          {
            title: <p className="font-semibold text-xl">Address</p>,
            field: "address",
            render: (rowData) => (
              <p className="text-textColor font-medium ">{rowData.address}</p>
            ),
          },
          {
            title: <p className="font-semibold text-xl">Open At</p>,
            field: "openAt",
            render: (rowData) => (
              <p className="text-textColor font-medium ">{rowData.openAt}</p>
            ),
          },
          {
            title: <p className="font-semibold text-xl">Close At</p>,
            field: "closeAt",
            render: (rowData) => (
              <p className="text-textColor font-medium ">{rowData.closeAt}</p>
            ),
          },
          {
            title: <p className="font-semibold text-xl">Block</p>,
            field: "isStore",
            render: (rowData) => (
              <select
                value={rowData.isStore}
                onChange={() => blockStore(rowData)}
                className="border rounded-md bg-cardOverlay w-24 h-10 font-semibold"
              >
                <option value="true" className="font-semibold text-blue-500">
                  True
                </option>
                <option value="false" className="font-semibold text-red-500">
                  False
                </option>
              </select>
            ),
          },
        ]}
        data={isStore}
        title={
          <p className="font-semibold text-red-400 text-3xl">List of Stores</p>
        }
      />
    </div>
  );
};

export default DBStore;
