const router = require("express").Router();
const userModel = require("../models/Users");
const bcrypt = require("bcrypt");


router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new userModel({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      age: req.body.age,
      phone: req.body.phone
    });
    const User = await newUser.save();
    res.status(200).json(User);
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    let user = await userModel.findOne({ name: req.body.name });
    let flag = -1;
    if (!user) {
      flag = 1;
      user = { name: "User not found" };
      res.status(200).json(user);
    }
    if (flag == -1) {
      let validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        user = { name: "Wrong password" };
        res.status(200).json(user);
        flag = 0;
      }
    }
    if (flag == -1) res.status(200).json(user);
  } catch (err) {
    res.status(200).json("user doesn't exist");
  }
});

module.exports = router;
