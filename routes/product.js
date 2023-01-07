const express = require("express");
const productRouter = express.Router();
const auth = require("../middlewares/auth");
const { Product } = require("../models/product");

productRouter.get("/api/products/", async (req, res) => {
  try {
    const products = await Product.find({isFeatured:true});
    products.sort((a, b) => (a._id > b._id) ? -1 : 1)
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

productRouter.get("/api/admin/products/", async (req, res) => {
  try {
    const products = await Product.find({});
    products.sort((a, b) => (a._id > b._id) ? -1 : 1)
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


productRouter.get("/api/products/out", async (req, res) => {
  try {
    let products = await Product.find({countInStock: 0});
    products.sort((a, b) => (a._id > b._id) ? -1 : 1)
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});




productRouter.get("/api/products/category/:name", async (req, res) => {
  try {
    let products = await Product.find({category: { $regex: req.params.name },isFeatured:true});
    
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

productRouter.get("/api/products/:id", async (req, res) => {
  try {
    const products = await Product.findById(req.params.id);

    if (products) {
      res.json(products);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

productRouter.get("/api/top-products/", async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(30);
    
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

productRouter.get("/products/deal_of_day", async (req, res) => {
  try {
    let products = await Product.find({ isDiscounted: true,isFeatured:true });

    if (products) {
      res.json(products);
    } else {
      products = [];
      res.json(products);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


productRouter.get("/products/admin/deal_of_day", async (req, res) => {
  try {
    let products = await Product.find({ isDiscounted: true });

    if (products) {
      
      res.json(products);
    } else {
      products = [];
      res.json(products);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});



productRouter.get("/products/deal_of_day/:name", async (req, res) => {
  try {
    let products = await Product.find({ isDiscounted: true,category: { $regex: req.params.name },isFeatured:true },);

    if (products) {
      
      res.json(products);
    } 
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


productRouter.get("/products/sub/deal_of_day/:name", async (req, res) => {
  try {
    let products = await Product.find({ isDiscounted: true,subcategory: { $regex: req.params.name },isFeatured:true },);

    if (products) {
      
      res.json(products);
    } 
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// create a get request to search products and get them
// /api/products/search/i
productRouter.get("/products/search/:name", auth, async (req, res) => {
  try {
    const products = await Product.find({
      name: { $regex: req.params.name, $options: "i" },isFeatured:true
    });
    if (products) {
      
      res.json(products);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


productRouter.get("/products/admin/search/:name", auth, async (req, res) => {
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
});

productRouter.get("/products/category/:name", async (req, res) => {
  try {
    const products = await Product.find({
      category: { $regex: req.params.name },isFeatured:true
    });
    if (products) {
      products.sort((a, b) => (a._id > b._id) ? -1 : 1)
      res.json(products);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

productRouter.post("/products/subcategory", async (req, res) => {
  try {
    const { query } = req.body;

    const products = await Product.find({
      subcategory: { $regex: query },isFeatured:true
    });
    if (products) {
      products.sort((a, b) => (a._id > b._id) ? -1 : 1)
      res.json(products);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

productRouter.get("/products/hprice/:name", async (req, res) => {
  try {
    const products = await Product.find({category: { $regex: req.params.name },isFeatured:true}).sort({ price: -1 });
    
    if (products) {
      
      res.json(products);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

productRouter.get("/products/sub/hprice/:name", async (req, res) => {
  try {
    const products = await Product.find({subcategory: { $regex: req.params.name },isFeatured:true}).sort({ price: -1 });
    
    if (products) {
      
      res.json(products);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

productRouter.get("/products/lprice/:name", async (req, res) => {
  try {
    const products = await Product.find({category: { $regex: req.params.name},isFeatured:true}).sort({ price: 1 });

    if (products) {
      
      res.json(products);
    }
    
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


productRouter.get("/products/sub/lprice/:name", async (req, res) => {
  try {
    const products = await Product.find({subcategory: { $regex: req.params.name},isFeatured:true}).sort({ price: 1 });
    
    if (products) {
      
      res.json(products);
    }
    
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// create a post request route to rate the product.
productRouter.post("/api/rate-product", auth, async (req, res) => {
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
});

productRouter.get("/api/deal-of-day", auth, async (req, res) => {
  try {
    let products = await Product.find({});

    products = products.sort((a, b) => {
      let aSum = 0;
      let bSum = 0;

      for (let i = 0; i < a.ratings.length; i++) {
        aSum += a.ratings[i].rating;
      }

      for (let i = 0; i < b.ratings.length; i++) {
        bSum += b.ratings[i].rating;
      }
      return aSum < bSum ? 1 : -1;
    });

    res.json(products[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = productRouter;
