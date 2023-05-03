const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  orderItem: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orderItemSchema",
    },
  ],
  shippingAddress1: { type: String, required: true },
  shippingAddress2: { type: String, default: "" },
  city: { type: String, required: true },
  zip: { type: Number, required: true },
  country: { type: String, required: true },
  phone: { type: Number, required: true },
  status: { type: String, required: true, default: "pending" },
  totalPrice: { type: Number, default: "" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  dataOrdered: { type: Date, default: Date.now() },
});
orderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
orderSchema.set("toJSON", { virtuals: true });
module.exports = mongoose.model("Order", orderSchema);
