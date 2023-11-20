const express = require("express");
const passport = require("passport");
const User = require("../models/userProfile");
const router = express.Router();

router.post("/register", (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = new User({
    username,
    password: hashedPassword,
  });

  newUser.save((err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Registration failed" });
    } else {
      res.status(200).json({ message: "Registration successful" });
    }
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/success",
    failureRedirect: "/failure",
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
