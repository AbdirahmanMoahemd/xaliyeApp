import Product from "../models/product.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true });
    products.sort((a, b) => (a._id > b._id ? -1 : 1));
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const products = await Product.findById(req.params.id);

    if (products) {
      res.json(products);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getProductsByName = async (req, res) => {
  try {
    const products = await Product.find({
      name: { $regex: req.params.name, $options: "i" },
    });
    if (products) {
      res.json(products);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      images,
      countInStock,
      price,
      category,
      oldPrice,
    } = req.body;

    let product = new Product({
      name,
      description,
      images,
      price,
      category,
      countInStock,
      oldPrice,
    });
    product = await product.save();
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const {
      id,
      name,
      description,
      images,
      countInStock,
      price,
      category,
      oldPrice,
    } = req.body;
    let product = await Product.findById(id);
    if (product) {
      product.name = name;
      product.description = description;
      product.images = images;
      product.countInStock = countInStock;
      product.price = price;
      product.category = category;
      product.oldPrice = oldPrice;
      product = await product.save();
      res.json(product);
    } else {
      res.status(404);
      throw new Error("Product Not Found");
    }
  } catch (e) {
    res.status(404).json({ error: "Product Not Found" + e.message });
  }
};


// @desc    Delete a product
// @route   GET /api/product/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({
      message: "Product removed",
    });
  } else {
    res.status(404);
    throw new Error("Product Not Found");
  }
};


export const rateProducts = async (req, res) => {
  try {
    const { id, rating } = req.body;
    let product = await Product.findById(id);

    for (let i = 0; i < product.ratings.length; i++) {
      if (product.ratings[i].userId == req.user) {
        product.ratings.splice(i, 1);
        break;
      }
    }

    const ratingSchema = {
      userId: req.user,
      rating,
    };

    product.ratings.push(ratingSchema);
    product.rating = rating;
    product = await product.save();
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
