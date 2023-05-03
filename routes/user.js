const { User } = require("../model/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//GET ALL USERS
router.get("/", async (req, res) => {
  const users = await User.find().select("name phone email");
  if (!users) {
    res.status(500).send({ success: false });
  }
  res.send(users);
});

//CREATE USER (FOR ADMIN PURPOSE)
router.post("/", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(req.body.password, salt);
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: password,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
    });
    res.send(user);
  } catch (err) {
    res.status(400).send({ Error: err.message, success: false });
  }
});

//GET SPECIFIC USER WITH USER ID
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(500).send({ success: false });
  }
  res.send(user);
});

//EDIT USER DETAILS
router.put("/:id", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(req.body.password, salt);
    const user = await User.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      email: req.body.email,
      password: password,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
    });
    res.send(user);
  } catch (err) {
    res.status(400).send({ Error: err.message, success: false });
  }
});

//USER LOGIN
router.post("/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) {
    res.status(404).send("user not found");
  }
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );
    res.status(200).send({ email: user.email, token: token });
  } else {
    res.status(401).send({ message: "user not authorized" });
  }
  // res.send(user);
});

//REGISTERING NEW USER
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(req.body.password, salt);
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: password,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
    });
    res.send(user);
  } catch (err) {
    res.status(400).send({ Error: err.message, success: false });
  }
});
//COUNT USERS FOR STATISTICS PURPOSE
router.get("/get/count", async (req, res) => {
  const users = await User.countDocuments();
  if (!users) {
    res.status(500).send("user not found");
  }
  res.status(200).send({ count: users });
  console.log(users);
});
module.exports = router;
