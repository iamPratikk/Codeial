const express = require("express");
const router = express.Router();
const userController = require("../controllers/user_controller");
const passport = require("passport");

router.get("/", userController.home);
router.get("/profile/:id", passport.checkAuthentication, userController.newProfile);
router.get("/sign-in", userController.sign_in);
router.get("/sign-up", userController.sign_up);
router.post("/create", userController.createUser);
router.post(
  "/create-session",
  passport.authenticate("local", {
    failureRedirect: "/users/sign-in",
  }),
  userController.createNewSession
);
router.get("/sign-out", userController.signOut);
router.post("/update/:id", passport.checkAuthentication, userController.update);

module.exports = router;
