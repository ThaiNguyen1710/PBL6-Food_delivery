import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { baseURL, editUser, getAllUsers } from "../../api";
import { setAllUserDetail } from "../../context/actions/allUsersAction";
import DataTable from "./DataTable";
import { avatar } from "../../assets";

import { alertNULL, alertSuccess } from "../../context/actions/alertActions";
const DBUsers = () => {
  const allUsers = useSelector((state) => state.allUsers);
  const dispatch = useDispatch();
  

  useEffect(() => {
    if (!allUsers) {
      getAllUsers().then((data) => {
        dispatch(setAllUserDetail(data));
      });
    }
  });
  const typeUser = async (rowData) => {
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

  const user = allUsers? allUsers.filter((user)=>user.isStore===false && user.isAdmin===false ):[]

  
  

  return (
    <div className="flex justify-center items-center gap-4 pt-6 w-full">
      <DataTable
        columns={[
          {
            title: <p className="font-semibold font-sans text-xl">Ảnh</p>,
            field: "photoURL",
            render: (rowData) => (
              <img
                src={baseURL+rowData.image ?baseURL+rowData.image : avatar}
                className="w-32 h-16 object-cover rounded-md"
                alt=""
              />
            ),
          },
          {
            title: <p className="font-semibold font-sans text-xl">Tên</p>,
            field: "name",
            render: (rowData) => (
              <p className="text-textColor font-sans font-medium ">{rowData.name}</p>
            ),
          },
          {
            title: <p className="font-semibold font-sans text-xl">Email</p>,
            field: "email",
            render: (rowData) => (
              <p className="text-textColor font-sans font-medium ">{rowData.email}</p>
            ),
          },
          {
            title: <p className="font-semibold font-sans text-xl">Sđt</p>,
            field: "phone",
            render: (rowData) => (
              <p className="text-textColor font-sans font-medium ">{rowData.phone}</p>
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
            title: <p className="font-semibold font-sans text-xl">Quyền</p>,
            field: "role",
            render: (rowData) => (
              <select
                value={rowData.isStore ? "Store" : rowData.isAdmin ? "Admin" : "User"}
                onChange={(e) => typeUser(rowData, e.target.value)}
                className="border rounded-md bg-cardOverlay w-32 h-10 font-semibold font-sans"
                style={{
                  color:
                    rowData.isStore
                      ? "blue"
                      : rowData.isAdmin
                      ? "red"
                      : "black",
                }}
              >
                <option value="User" className="font-semibold font-sans text-black">
                  Người dùng
                </option>
                <option value="Store" className="font-semibold font-sans text-blue-500">
                  Cửa hàng
                </option>
                <option value="Admin" className="font-semibold font-sans text-red-500">
                  Admin
                </option>
              </select>
            ),
          },
         
          {
            title: <p className="font-semibold font-sans text-xl">Xác thực</p>,
            field: "emailVerified",
            render: (rowData) => (
              <p
                className={`px-2 py-1 w-32 text-center text-primary rounded-md ${
                  rowData.emailVerified ? "bg-red-500": "bg-emerald-500" 
                }`}
              >
                {rowData.emailVerified?"Not Verified":" Verified"}
              </p>
            ),
          },
       
        ]}
        data={user}
        title={<p className="font-semibold font-sans text-amber-500 text-3xl">Danh sách người dùng</p>}
        // actions={[
        //   {
        //     icon: "edit",
        //     tooltip: "Edit Data",
        //     onClick: (event, rowData) => {
        //       alert("You want to edit" + rowData.productId);
        //     },
        //   },
        //   {
        //     icon: "delete",
        //     tooltip: "Delete Data",
        //     onClick: (event, rowData) => {
        //       if (window.confirm("Are you sure?")) {
        //         deleteAProduct(rowData.productId).then((res) => {
        //           dispatch(alertSuccess("Product Deleted "));
        //           setInterval(() => {
        //             dispatch(alertNULL());
        //           }, 3000);
        //           getAllProducts().then((data) => {
        //             dispatch(setAllProducts(data));
        //           });
        //         });
        //       }
        //     },
        //   },
        // ]}
      />
    </div>
  );
};

export default DBUsers;
