import Product from "../models/product.js";
import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      address,
    });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        phone: user.phone,
        address: user.address,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid User Data");
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        phone: user.phone,
        address: user.address,
        cart: user.cart,
        wishlist: user.wishlist,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    let user = await User.findById(req.user)
      .populate("cart.product")
      .populate("wishlist.product");
    if (user.cart.length == 0) {
      user.cart.push({ product, quantity: 1 });
    } else {
      let isProductFound = false;
      for (let i = 0; i < user.cart.length; i++) {
        if (user.cart[i].product._id.equals(product._id)) {
          isProductFound = true;
        }
      }

      if (isProductFound) {
        let producttt = user.cart.find((productt) =>
          productt.product._id.equals(product._id)
        );
        producttt.quantity += 1;
      } else {
        user.cart.push({ product, quantity: 1 });
      }
    }
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
export const addToWishlist = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    let user = await User.findById(req.user).populate("cart.product")
    .populate("wishlist.product");;

    if (user.wishlist.length == 0) {
      user.wishlist.push({ product });
    } else {
      let isProductFound = false;
      for (let i = 0; i < user.wishlist.length; i++) {
        if (user.wishlist[i].product._id.equals(product._id)) {
          isProductFound = true;
        }
      }

      if (isProductFound) {
        return res.status(400).json({ msg: "already added" });
      } else {
        user.wishlist.push({ product });
      }
    }
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};


// @desc    Fetch all categories
// @route   POST /api/categorie/
// @access  Public
export const removeWishlistItem = async (req, res) => {
  try {
    const { index } = req.body;
    let user = await User.findById(req.user).populate("cart.product")
    .populate("wishlist.product")
    ;

    user.wishlist.splice(index, 1);

    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const { index } = req.body;
    // const product = await Product.findById(id);
    let user = await User.findById(req.user)
      .populate("cart.product")
      .populate("wishlist.product");

    // for (let i = 0; i < user.cart.length; i++) {
    // if (user.cart[i].product._id.equals(product._id)) {
    // if (user.cart[i].quantity == 1) {
    user.cart.splice(index, 1);
    // } else {
    //   user.cart[i].quantity -= 1;
    // }
    // }
    // }
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const removeWishlitItem = async (req, res) => {
  try {
    const { index } = req.body;
    // const product = await Product.findById(id);
    let user = await User.findById(req.user).populate("cart.product")
    .populate("wishlist.product");;

    // for (let i = 0; i < user.cart.length; i++) {
    // if (user.cart[i].product._id.equals(product._id)) {
    // if (user.cart[i].quantity == 1) {
    user.wishlist.splice(index, 1);
    // } else {
    //   user.cart[i].quantity -= 1;
    // }
    // }
    // }
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const deleteCart = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    let user = await User.findById(req.user)
      .populate("cart.product")
      .populate("wishlist.product")

    for (let i = 0; i < user.cart.length; i++) {
      if (user.cart[i].product._id.equals(product._id)) {
        if (user.cart[i].quantity == 1) {
          user.cart.splice(i, 1);
        } else {
          user.cart[i].quantity -= 1;
        }
      }
    }
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfileById = async (req, res) => {
  const user = await User.findById(req.params.id)
    .populate("cart.product")
    .populate("wishlist.product");
  const { token } = req.body;

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      phone: user.phone,
      address: user.address,
      token,
      cart: user.cart,
      wishlist: user.wishlist,
    });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
};
