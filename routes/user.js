const router = require("express").Router();
const {
  CreateUser,
  GetUsers,
  GetUser,
  UpdateUser,
  DeleteUser,
} = require("../controllers/userController");
const authCheck = require("../middlewares/authCheck");

router.post("/users", authCheck, CreateUser);
router.get("/users", authCheck, GetUsers);
router.get("/users/:id", authCheck, GetUser);
router.put("/users/:id", authCheck, UpdateUser);
router.delete("/users/:id", authCheck, DeleteUser);

module.exports = router;
