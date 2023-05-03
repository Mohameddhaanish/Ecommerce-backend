const express = require("express");
const router = express.Router();
const { Category } = require("../model/category");

router.get("/", async (req, res) => {
  try {
    const category = await Category.find();
    if (!category) {
      res.status(500).send({ success: false });
    }
    res.send(category);
  } catch (err) {
    res.status(400).send({ error: err.message, success: false });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(500).send({ success: false });
    }
    res.send(category);
  } catch (err) {
    res.status(400).send({ error: err.message, success: false });
  }
});

router.post("/", async (req, res) => {
  try {
    const createCategory = await Category.create({
      name: req.body.name,
      color: req.body.color,
      icon: req.body.icon,
    });
    res.send(createCategory);
  } catch (err) {
    res.status(400).send({ Error: err.message, success: false });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const updateCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        color: req.body.color,
        icon: req.body.icon,
      },
      { new: true }
    );
    res.status(200).send(updateCategory);
  } catch (err) {
    res.status(400).send({ Error: err.message, success: false });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const deleteCategory = await Category.findByIdAndRemove(req.params.id);
    if (!deleteCategory) {
      res.status(404).send({ success: false, message: "Id not found" });
    } else {
      res.status(200).send({
        success: true,
        message: "The category is deleted successfully!",
      });
    }
  } catch (err) {
    res.status(400).send({ Error: err.message, success: false });
  }
});
module.exports = router;
