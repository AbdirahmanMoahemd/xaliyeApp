import  mongoose from "mongoose";
import ratingSchema from "./rating.js";

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  images: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  oldPrice: {
    type: Number,
    required: true,
  },
  countInStock: {
    type: Number,
    required: true,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  ratings: [ratingSchema],
});

const Product = mongoose.model("Product", productSchema);

export default  Product;
