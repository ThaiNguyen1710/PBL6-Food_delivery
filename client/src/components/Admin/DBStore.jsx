import React from 'react'
import DataTable from './DataTable'

const DBStore = () => {
  return (
    <div className="flex justify-center items-center gap-4 pt-6 w-full">
    <DataTable
      columns={[
        {
          title: "Name",
          field: "photoURL",
         
        },
        {
          title: "Address",
          field: "displayName",
        },
        {
          title: "Status",
          field: "email",
        },
        {
          title: "IsOpen",
          field: "",
        },
        {
          title: "ItemQuantity",
          field: "",
        },
        {
          title: "Block",
          field: "",
        },
        
      ]}
     data={"Will be completed soon!"}
      title="List of Stores"
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
  )
}

export default DBStore