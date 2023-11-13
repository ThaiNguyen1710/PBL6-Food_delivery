const router = require("express").Router();
const express = require("express");
const admin = require("firebase-admin");
const db = admin.firestore();

db.settings({ ignoreUndefinedProperties: true });
const stripe = require("stripe")(process.env.STRIPE_KEY);

router.post("/create", async (req, res) => {
  try {
    const id = Date.now();

    const data = {
      productId: id,
      product_name: req.body.product_name,
      product_category: req.body.product_category,
      product_price: req.body.product_price,
      product_image: req.body.product_image,
      product_information: req.body.product_information,
    };
    const response = await db.collection("products").doc(`/${id}/`).set(data);
    console.log(response);
    return res.status(200).send({ success: true, data: response });
  } catch (err) {
    return res.send({ success: false, msg: `Error:${err}` });
  }
});

router.get("/all", async (req, res) => {
  (async () => {
    try {
      let query = db.collection("products");
      let response = [];
      await query.get().then((querysnap) => {
        let docs = querysnap.docs;
        docs.map((doc) => {
          response.push({ ...doc.data() });
        });
        return response;
      });
      return res.status(200).send({ success: true, data: response });
    } catch (err) {
      return res.send({ success: false, msg: `Error:${err}` });
    }
  })();
});

//delete a product

router.delete("/delete/:productId", async (req, res) => {
  const productId = req.params.productId;
  try {
    await db
      .collection("products")
      .doc(`/${productId}/`)
      .delete()
      .then((result) => {
        return res.status(200).send({ success: true, data: result });
      });
  } catch (err) {
    return res.send({ success: false, msg: `Error:${err}` });
  }
});

router.put("/update/:productId", async (req, res) => {
  const productId = req.params.productId;

  try {
    // Kiểm tra xem sản phẩm có tồn tại không
    const productDoc = await db
      .collection("products")
      .doc(`/${productId}/`)
      .get();

    if (!productDoc.exists) {
      return res.status(404).send({ success: false, msg: "Product not found" });
    }

    // Thực hiện cập nhật thông tin sản phẩm
    const updatedData = {
      product_name: req.body.product_name || productDoc.data().product_name,
      product_category:
        req.body.product_category || productDoc.data().product_category,
      product_price: req.body.product_price || productDoc.data().product_price,
      product_image: req.body.product_image || productDoc.data().product_image,
      product_information:
        req.body.product_information || productDoc.data().product_information,
    };

    await db.collection("products").doc(`/${productId}/`).update(updatedData);

    return res
      .status(200)
      .send({ success: true, msg: "Product updated successfully" });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, msg: `Error: ${err.message}` });
  }
});

//create a cart
router.post("/addToCart/:userId", async (req, res) => {
  const userId = req.params.userId;
  const productId = req.body.productId;

  try {
    const doc = await db
      .collection("cartItems")
      .doc(`/${userId}/`)
      .collection("items")
      .doc(`/${productId}/`)
      .get();

    if (doc.data()) {
      const quantity = doc.data().quantity + 1;
      const updatedItem = await db
        .collection("cartItems")
        .doc(`/${userId}/`)
        .collection("items")
        .doc(`/${productId}/`)
        .update({ quantity });
      return res.status(200).send({ success: true, data: updatedItem });
    } else {
      const data = {
        productId: productId,
        product_name: req.body.product_name,
        product_category: req.body.product_category,
        product_price: req.body.product_price,
        product_image: req.body.product_image,
        product_information: req.body.product_information,
        quantity: 1,
      };
      const addItems = await db
        .collection("cartItems")
        .doc(`/${userId}/`)
        .collection("items")
        .doc(`/${productId}/`)
        .set(data);
      return res.status(200).send({ success: true, data: addItems });
    }
  } catch (err) {
    return res.send({ success: false, msg: `Error:${err}` });
  }
});

//update cart to icrease and decrease the quantity

router.post("/updateCart/:user_id", async (req, res) => {
  const userId = req.params.user_id;
  const productId = req.query.productId;
  const type = req.query.type;
  try {
    const doc = await db
      .collection("cartItems")
      .doc(`/${userId}/`)
      .collection("items")
      .doc(`/${productId}/`)
      .get();
    if (doc.data()) {
      if (type === "increment") {
        const quantity = doc.data().quantity + 1;
        const updatedItem = await db
          .collection("cartItems")
          .doc(`/${userId}/`)
          .collection("items")
          .doc(`/${productId}/`)
          .update({ quantity });
        return res.status(200).send({ success: true, data: updatedItem });
      } else {
        if (doc.data().quantity === 1) {
          await db
            .collection("cartItems")
            .doc(`/${userId}/`)
            .collection("items")
            .doc(`/${productId}/`)
            .delete()
            .then((result) => {
              return res.status(200).send({ success: true, data: result });
            });
        } else {
          const quantity = doc.data().quantity - 1;
          const updatedItem = await db
            .collection("cartItems")
            .doc(`/${userId}/`)
            .collection("items")
            .doc(`/${productId}/`)
            .update({ quantity });
          return res.status(200).send({ success: true, data: updatedItem });
        }
      }
    }
  } catch (err) {
    return res.send({ success: false, msg: `Error:${err}` });
  }
});

// get all the cartitems for that user
router.get("/getCartItems/:user_id", async (req, res) => {
  const userId = req.params.user_id;
  (async () => {
    try {
      let query = db
        .collection("cartItems")
        .doc(`/${userId}/`)
        .collection("items");
      let response = [];
      await query.get().then((querysnap) => {
        let docs = querysnap.docs;
        docs.map((doc) => {
          response.push({ ...doc.data() });
        });
        return response;
      });
      return res.status(200).send({ success: true, data: response });
    } catch (err) {
      return res.send({ success: false, msg: `Error:${err}` });
    }
  })();
});

router.delete("/clearCart/:user_id", async (req, res) => {
  const userId = req.params.user_id;
  try {
    // Lấy tất cả các mục trong giỏ hàng của người dùng
    const cartItems = await db
      .collection("cartItems")
      .doc(`/${userId}/`)
      .collection("items")
      .get();

    // Xóa từng mục trong giỏ hàng
    const deletePromises = cartItems.docs.map((doc) => {
      return db
        .collection("cartItems")
        .doc(`/${userId}/`)
        .collection("items")
        .doc(doc.id)
        .delete();
    });

    // Chờ tất cả các promises hoàn thành
    await Promise.all(deletePromises);

    return res
      .status(200)
      .send({ success: true, msg: "Cart cleared successfully" });
  } catch (err) {
    return res.send({ success: false, msg: `Error:${err}` });
  }
});

router.post("/create-checkout-session", async (req, res) => {
  const line_items = req.body.data.cart.map((item) => {
    return {
      price_data: {
        currency: "vnd",
        product_data: {
          name: item.product_name,
          images: [item.product_image],
          metadata: {
            id: item.productId,
          },
        },
        unit_amount: item.product_price,
      },
      quantity: item.quantity,
    };
  });
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_address_collection: { allowed_countries: ["VN"] },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 0,
            currency: "vnd",
          },
          display_name: "Free shipping",
          delivery_estimate: {
            minimum: { unit: "hour", value: 1 },
            maximum: { unit: "hour", value: 2 },
          },
        },
      },
    ],
    phone_number_collection: {
      enabled: true,
    },
    line_items,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/checkout-success`,
    cancel_url: `${process.env.CLIENT_URL}/`,
  });
  res.send({ url: session.url });
});

// endpointSecret= process.env.WEBHOOK_SECRET
let endpointSecret;
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];

    let eventType;
    let data;
    if (endpointSecret) {
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }
      data = event.data.object;
      eventType = event.type;
    } else {
      data = req.body.data.object;
      eventType = req.body.type;
    }
    if (eventType === "checkout.session.completed") {
      console.log(data);
    }

    // Return a 200 res to acknowledge receipt of the event
    res.send();
  }
);

module.exports = router;
