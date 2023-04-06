import Order from "../models/order";

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
