const router = require("express").Router();
const admin = require("firebase-admin");
let data = [];
const db = admin.firestore();
router.get("/", (req, res) => {
  return res.send("User");
});

router.get("/jwtVerification", async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(500).send({ msg: "Token not found" });
  }

  const token = req.headers.authorization.split(" ")[1];
  try {
    const decodedValue = await admin.auth().verifyIdToken(token);
    if (!decodedValue) {
      return res
        .status(500)
        .json({ success: false, msg: "Unauthorized access" });
    }
    return res.status(200).json({ success: true, data: decodedValue });
  } catch (err) {
    return res.send({
      success: false,
      msg: `Error in extracting the token: ${err}`,
    });
  }
});

const listAllUsers = async (nextpagetoken) => {
  admin
    .auth()
    .listUsers(1000, nextpagetoken)
    .then((listuserresult) => {
      listuserresult.users.forEach((rec) => {
        data.push(rec.toJSON());
      });
      if (listuserresult.pageToken) {
        listAllUsers(listuserresult.pageToken);
      }
    })
    .catch((err) => console.log(err));
};

listAllUsers();

router.get("/all", async (req, res) => {
  try {
    let uniqueUsers = data.filter(
      (user, index, self) => index === self.findIndex((u) => u.uid === user.uid)
    );

    let query = db.collection("user");
    let response = [];
    await query.get().then((querysnap) => {
      let docs = querysnap.docs;
      docs.map((doc) => {
        response.push({ ...doc.data() });
      });
    });

    // Gộp dữ liệu từ cả hai nguồn vào một mảng duy nhất và loại bỏ các tài khoản trùng lặp
    uniqueUsers = uniqueUsers.concat(
      response.filter(
        (user, index, self) =>
          index === self.findIndex((u) => u.uid === user.uid)
      )
    );

    return res.status(200).send({
      success: true,
      data: uniqueUsers,
      dataCount: uniqueUsers.length,
    });
  } catch (err) {
    return res.send({
      success: false,
      msg: `Error: ${err}`,
    });
  }
});
router.post("/create", async (req, res) => {
  try {
    const id = Date.now();

    const data = {
      user_id: id,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      type: req.body.type,
    };
    const response = await db.collection("user").doc(`/${id}/`).set(data);
    console.log(response);
    return res.status(200).send({ success: true, data: response });
  } catch (err) {
    return res.send({ success: false, msg: `Error:${err}` });
  }
});
router.put("/update/:user_id", async (req, res) => {
  const user_id = req.params.user_id;

  try {
    // Kiểm tra xem sản phẩm có tồn tại không
    const userDoc = await db.collection("user").doc(`/${user_id}/`).get();

    if (!userDoc.exists) {
      return res.status(404).send({ success: false, msg: "User not found" });
    }

    // Thực hiện cập nhật thông tin sản phẩm
    const updatedData = {
      name: req.body.name || userDoc.data().name,
      email: req.body.email || userDoc.data().email,
      phone: req.body.phone || userDoc.data().phone,
      address: req.body.address || userDoc.data().address,
      store: req.body.store || userDoc.data().store,
    };

    await db.collection("user").doc(`/${user_id}/`).update(updatedData);

    return res
      .status(200)
      .send({ success: true, msg: "User updated successfully" });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, msg: `Error: ${err.message}` });
  }
});
router.get("/all1", async (req, res) => {
  (async () => {
    try {
      let uniqueUsers = data.filter(
        (user, index, self) =>
          index === self.findIndex((u) => u.uid === user.uid)
      );

      let query = db.collection("user");
      let response = [];
      await query.get().then((querysnap) => {
        let docs = querysnap.docs;
        docs.map((doc) => {
          response.push({ ...doc.data() });
        });
        return response;
      });
      
      return res
        .status(200)
        .send({
          success: true,  
          data: {
            response,
            uniqueUsers,
          },
        });
    } catch (err) {
      return res.send({ success: false, msg: `Error:${err}` });
    }
  })();
});

module.exports = router;
