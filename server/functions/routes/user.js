const router = require("express").Router();
const admin = require("firebase-admin");
let data = [];

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
  // Loại bỏ các tài khoản trùng lặp dựa trên trường 'uid'
  const uniqueUsers = data.filter((user, index, self) =>
    index === self.findIndex((u) => u.uid === user.uid)
  );

  try {
    return res
      .status(200)
      .send({ success: true, data: uniqueUsers, dataCount: uniqueUsers.length });
  } catch (err) {
    return res.send({
      success: false,
      msg: `Error in extracting the token: ${err}`,
    });
  }
});

module.exports = router;