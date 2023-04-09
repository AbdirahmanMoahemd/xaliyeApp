import Order from "../models/order.js";
import Product from "../models/product.js";
import User from "../models/user.js";

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    orders.sort((a, b) => (a._id > b._id ? -1 : 1));
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getRecentOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ orderedAt: -1 }).limit(30);

    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const changeOrderStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    let order = await Order.findById(id);
    order.status = status;
    order = await order.save();
    res.json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};


export const addOrderItems = async (req, res) => {
  try {
    const {
      cartproducts,
      address,
      paymentMethod,
      shippingPrice,
      totalPrice,
    } = req.body;
    let products = [];

    for (let i = 0; i < cartproducts.length; i++) {
      let product = await Product.findById(cartproducts[i].product._id);
      if (product.countInStock >= cartproducts[i].quantity) {
        product.countInStock -= cartproducts[i].quantity;
        products.push({
          product,
          quantity: cartproducts[i].quantity,
        });
        await product.save();
      } else {
        return res
          .status(400)
          .json({ msg: `${product.name} is out of stock!` });
      }
    }

   

    let user = await User.findById(req.user);
    user.cart = [];
    user = await user.save();

    let order = new Order({
      products,
      user: req.user._id,
      address,
      paymentMethod,
      shippingPrice, 
      totalPrice,
      status:0,
      orderedAt: new Date().getTime(),
    });
    order = await order.save();
    res.json(order);   
  } catch (e) {   
    res.status(500).json({ error: e.message });
  }
};