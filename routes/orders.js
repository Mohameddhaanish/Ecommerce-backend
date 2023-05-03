const express = require("express");
const router = express.Router();
const Order = require("../model/orders");
const { orderItemSchema } = require("../model/orderItems");

//GET ALL ORDERS
router.get("/", async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name")
    .sort({ dataOrdered: -1 });
  if (!orders) {
    res.status(404).send({ success: false, message: "orders not found" });
  }
  console.log(orders);
  res.status(200).send(orders);
});

//CREATE ORDER
router.post("/", async (req, res) => {
  //FUNCTION FOR CREATING ORDERITEMS
  let orderItemsIds = Promise.all(
    req.body.orderItem.map(async (data) => {
      let createOrderItem = await new orderItemSchema({
        quantity: data.quantity,
        product: data.product,
      });
      createOrderItem = await createOrderItem.save();
      return createOrderItem._id;
    })
  );
  const orderItemsIdResolved = await orderItemsIds;
  console.log("orderItemsIds==>", orderItemsIds);
  console.log("orderItemsIdResolved==>", orderItemsIdResolved);
  //FUNCTION FOR GENERATING PRICE
  let calculatePrice = await Promise.all(
    orderItemsIdResolved.map(async (orderItemId) => {
      let orderItem = await orderItemSchema
        .findById(orderItemId)
        .populate("product", "price");
      console.log("orderItem==>", orderItem);
      let totalPrices = orderItem.product.price * orderItem.quantity;
      return totalPrices;
    })
  );
  const totalPrices = calculatePrice.reduce((a, b) => {
    return Number(a + b);
  }, 0);
  console.log("totalPrices==>", totalPrices);
  console.log("calculateprice==>", calculatePrice);
  //CREATING ORDER
  const order = new Order({
    orderItem: orderItemsIdResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrices,
    user: req.body.user,
  });
  await order.save();
  if (!order) {
    res.status(500).send({ success: false, message: "order failed" });
  }
  console.log(typeof totalPrices);
  res.status(200).send(order);
});

//GET SPECIFIED ORDER
router.get("/:id", async (req, res) => {
  const orders = await Order.findById(req.params.id)
    .populate("user", "name")
    .populate({
      path: "orderItem",
      populate: {
        path: "product",
        populate: "category",
      },
    })
    .sort({ dataOrdered: -1 });
  if (!orders) {
    res.status(404).send({ success: false, message: "orders not found" });
  }
  res.status(200).send(orders);
});

//UPDATE ORDERS
router.put("/:id", async (req, res) => {
  const updateOrder = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    {
      new: true,
    }
  );
  if (!updateOrder) {
    res.status(500).send({ success: false, message: "Update failed" });
  }
  res.send(updateOrder);
  res.status(200).send({ success: true, message: "Updated successfully" });
});

//DELETE ORDERS
router.delete("/:id", async (req, res) => {
  await Order.findByIdAndRemove(req.params.id).then(async (order) => {
    if (order) {
      await order.orderItem.map(async (item) => {
        await orderItemSchema.findByIdAndRemove(item);
      });
      return res
        .status(200)
        .send({ success: true, message: "Order deleted successfully" });
    } else {
      return res
        .status(404)
        .send({ success: false, message: "order not found!:(" });
    }
  });
});

//GET TOTALSALES FOR STATISTICS PURPOSE
router.get(`/get/totalsales`, async (req, res) => {
  const totalSales = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalsales: { $sum: "$totalPrice" },
      },
    },
  ]);

  if (!totalSales) {
    return res.status(400).send("The order sales cannot be generated");
  }

  res.send({ totalsales: totalSales });
});

//GET USER ORDER ID
router.get("/get/userid/:id", async (req, res) => {
  const userId = await Order.find({ user: req.params.id })
    .populate("user", "name email")
    .populate({
      path: "orderItem",
      model: "orderItemSchema",
      populate: { path: "product", model: "Product", select: "name" },
    })
    .exec();
  if (!userId) {
    res.status(404).send({ success: false, message: "userId not found" });
  }
  return res.status(200).send(userId);
});
module.exports = router;
