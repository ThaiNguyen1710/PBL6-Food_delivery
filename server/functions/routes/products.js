const router = require("express").Router();
const admin = require("firebase-admin");

router.post("/create", async (req, res) => {
  try {
    const id = Date.now();
    const data = {
      product_name: itemName,
      product_category: category,
      product_price: price,
      product_image: imageDownloadURL,
    };
  } catch (err) {}
});

module.exports = router;
