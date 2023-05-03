const express = require("express");
const router = express.Router();
// const Order = require("../model/orders");
const { orderItem } = require("../model/orderItems");

router.post("/", async (req, res) => {
  const testorderItem = new orderItem({
    quantities: req.body.quantities,
  });

  if (!testorderItem) {
    res.status(404).send("errorrrrrrrr");
  }
  await testorderItem.save();
  res.send(testorderItem);
});
module.exports = router;
