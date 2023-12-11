import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editUser, getAllUsers } from "../../api";
import { setAllUserDetail } from "../../context/actions/allUsersAction";
import DataTable from "./DataTable";
import { avatar } from "../../assets";
import { setUserDetail } from "../../context/actions/userActions";
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
  }, []);
  const typeUser = async (rowData) => {
    try {
      const userId = rowData.id; 
      const newData = {
        isStore: !rowData.isStore,
      };

      const updatedUserData = await editUser(userId, newData);

      if (updatedUserData && updatedUserData.data) {
       
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
        window.location.reload()
      }, 3000);
      
    }
 
  };
  

  return (
    <div className="flex justify-center items-center gap-4 pt-6 w-full">
      <DataTable
        columns={[
          {
            title: <p className="font-semibold text-xl">Image</p>,
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
            field: "name",
            render: (rowData) => (
              <p className="text-textColor font-medium ">{rowData.name}</p>
            ),
          },
          {
            title: <p className="font-semibold text-xl">Email</p>,
            field: "email",
            render: (rowData) => (
              <p className="text-textColor font-medium ">{rowData.email}</p>
            ),
          },
          {
            title: <p className="font-semibold text-xl">Phone</p>,
            field: "phone",
            render: (rowData) => (
              <p className="text-textColor font-medium ">{rowData.phone}</p>
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
            title: <p className="font-semibold text-xl">Role</p>,
            field: "role",
            render: (rowData) => (
              <select
                value={rowData.isStore ? "Store" : rowData.isAdmin ? "Admin" : "User"}
                onChange={(e) => typeUser(rowData, e.target.value)}
                className="border rounded-md bg-cardOverlay w-24 h-10 font-semibold"
                style={{
                  color:
                    rowData.isStore
                      ? "blue"
                      : rowData.isAdmin
                      ? "red"
                      : "black",
                }}
              >
                <option value="User" className="font-semibold text-black">
                  User
                </option>
                <option value="Store" className="font-semibold text-blue-500">
                  Store
                </option>
                <option value="Admin" className="font-semibold text-red-500">
                  Admin
                </option>
              </select>
            ),
          },
         
          {
            title: <p className="font-semibold text-xl">Verified</p>,
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
        data={allUsers}
        title={<p className="font-semibold text-red-400 text-3xl">List of Users</p>}
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
