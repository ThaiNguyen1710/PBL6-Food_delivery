import { getAllCategory } from "../api";

export const isActiveStyles =
  "text-2xl text-red-700 font-semibold hover:text-red-700 px-4 py-2 duration-100 transition-all ease-in-out";

export const isNotActiveStyles =
  "text-xl font-semibold text-textColor hover:text-red-700 px-4 py-2 duration-100 transition-all ease-in-out";

// export const statuses = [
//   // { id:"655b5adbf25e95d6494625b8", title: "food", category: "food" },
//   // { id: "655b5ae4f25e95d6494625ba", title: "meat", category: "meat" },
//   // { id: 3, title: "Bún", category: "Bún" },
//   // { id: 4, title: "Đồ Uống ", category: "Đồ Uống " },
//   // { id: 5, title: "Trà Sữa", category: "Trà Sữa" },
//   // { id: 6, title: "Gà ", category: "Gà " },
//   // { id: 7, title: "Kem ", category: "Kem " },
//   // { id: 8, title: "Lẩu", category: "Lẩu" },
//   // { id: 9, title: "Bánh Ngọt", category: "Bánh Ngọt" },

// ];
 export const gradientStyle = {
  backgroundImage: 'linear-gradient(45deg, #FFB400FF, #FF0085FF)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};
export const statuses = async () => {
  try {
    let res = await getAllCategory();
    if (res && res.data) {
      return res.data;
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
};
export const randomData = [
  {
    id: 1,
    product_image:
      "https://firebasestorage.googleapis.com/v0/b/food-delivery-app-1449c.appspot.com/o/Images%2F1698247468492_%24(imageFile.name)?alt=media&token=83ac1651-345c-45a5-8742-4869dce74efd",
    product_name: "Kem Vani",
    product_category: "Kem ",
    product_price: "25.000",
  },
  {
    id: 2,
    product_image:
      "https://firebasestorage.googleapis.com/v0/b/food-delivery-app-1449c.appspot.com/o/Images%2F1698286437761_%24(imageFile.name)?alt=media&token=55520eb2-a0f2-4568-9100-a93832027dae",
    product_name: "Cơm Sườn",
    product_category: "Cơm ",
    product_price: "24.000",
  },
  {
    id: 3,
    product_image:
      "https://firebasestorage.googleapis.com/v0/b/food-delivery-app-1449c.appspot.com/o/Images%2F1698286465068_%24(imageFile.name)?alt=media&token=687a6ce7-1c29-44e7-b702-77962279128f",
    product_name: "Lẩu Thái",
    product_category: "Lẩu ",
    product_price: "50.000",
  },
  {
    id: 4,
    product_image:
      "https://firebasestorage.googleapis.com/v0/b/food-delivery-app-1449c.appspot.com/o/Images%2F1698286514053_%24(imageFile.name)?alt=media&token=0cf94470-7627-40be-8f4e-f8ac0ea87d41",
    product_name: "Cocktail",
    product_category: "Đồ Uống  ",
    product_price: "40.000",
  },
  // {
  //   id: 5,
  //   product_image:
  //     "https://firebasestorage.googleapis.com/v0/b/food-delivery-app-1449c.appspot.com/o/Images%2F1698287006154_%24(imageFile.name)?alt=media&token=347befe2-5176-4e02-bdfd-aef108943d19",
  //   product_name: "Sữa Tươi Trân Châu",
  //   product_category: "Trà Sữa",
  //   product_price: "30000",
  // },
  {
    id: 6,
    product_image:
      "https://firebasestorage.googleapis.com/v0/b/food-delivery-app-1449c.appspot.com/o/Images%2F1698287049621_%24(imageFile.name)?alt=media&token=d40bd299-ccdc-480a-87f0-23dbd44e0759",
    product_name: "Bún Thịt Nướng",
    product_category: "Bún",
    product_price: "25.000",
  },
  {
    id: 7,
    product_image:
      "https://firebasestorage.googleapis.com/v0/b/food-delivery-app-1449c.appspot.com/o/Images%2F1698287077005_%24(imageFile.name)?alt=media&token=03a38187-faff-4e99-9ca8-24c8ab1f4472",
    product_name: "Hamburger",
    product_category: "Đồ Ăn Nhanh ",
    product_price: "40.000",
  },
  // {
  //   id: 8,
  //   product_image:
  //     "https://firebasestorage.googleapis.com/v0/b/food-delivery-app-1449c.appspot.com/o/Images%2F1698247435799_%24(imageFile.name)?alt=media&token=2d6e3c99-85ea-442d-85ef-c09b063e2fca",
  //   product_name: "Gà Rán",
  //   product_category: "Gà ",
  //   product_price: "36000",
  // },
];
