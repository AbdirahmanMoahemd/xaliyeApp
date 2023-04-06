const mongoose = require("mongoose");
const { productSchema } = require("./product");

const orderSchema = mongoose.Schema(
  {
    userId: {
      required: true,
      type: String,
    },
    userName: {
      required: true,
      type: String,
    },
    userPhone: {
      required: true,
      type: String,
    },
    products: [
      {
        product: productSchema,
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    address: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_adress: { type: String },
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    paidAt: {
      type: Number,
    },
    status: {
      type: Number,
      default: 0,
    },
    orderedAt: {
      type: Number,
      required: true,
    },
    deliveredAt: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
export default  Order;
