const router = require("express").Router();
const {
  SignUpUser,
  LoginUser,
  LogOutUser,
  VerifyEmail,
} = require("../controllers/authController");

router.post("/signup", SignUpUser);
router.get("/verify/:token", VerifyEmail);
router.post("/login", LoginUser);
router.get("/logout", LogOutUser);

module.exports = router;
