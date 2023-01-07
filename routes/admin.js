const express = require("express");
const adminRouter = express.Router();
const admin = require("../middlewares/admin");
const { Product } = require("../models/product");
const Order = require("../models/order");
const { PromiseProvider } = require("mongoose");
const { Category } = require("../models/category");

// Add product
adminRouter.post("/admin/add-product", admin, async (req, res) => {
  try {
    const { name, description, images, countInStock,status,sizes, price, category,colors, subcategory,isDiscounted,newPrice,isFeatured  } = req.body;

    let product = new Product({
      name,
      description,
      images,
      sizes,
      colors,
      countInStock,
      price,
      status,
      category,
      subcategory,
      isDiscounted,
      newPrice,
      isFeatured
    });
    product = await product.save();
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

adminRouter.put("/admin/update-product", admin, async (req, res) => {
  try {
    const { id,name, description, images,colors,sizes, countInStock, price, category, subcategory,isDiscounted,newPrice,isFeatured } = req.body;
    let product = await Product.findById(id)
    if(product){
      product.name=name
      product.description=description
      product.images=images
      product.sizes=sizes,
      product.colors=colors,
      product.countInStock=countInStock
      product.price=price
      product.category=category
      product.subcategory=subcategory
      product.isDiscounted=isDiscounted
      product.newPrice=newPrice
      product.isFeatured=isFeatured
      product = await product.save(); 
      res.json(product);
    }
    else {
      res.status(404)
      throw new Error('Product Not Found')
  }
    
    
   
  } catch (e) {
    res.status(404).json({ error: 'Product Not Found'+e.message });
  }
});

// Get all your products
adminRouter.get("/admin/get-products", admin, async (req, res) => {
  try {
    const products = await Product.find();
    products.sort((a, b) => (a._id > b._id) ? -1 : 1)
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete the product
adminRouter.post("/admin/delete-product", admin, async (req, res) => {
  try {
    const { id } = req.body;
    let product = await Product.findByIdAndDelete(id);
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

adminRouter.get("/admin/get-orders", admin, async (req, res) => {
  try {
    const orders = await Order.find({});
    orders.sort((a, b) => (a._id > b._id) ? -1 : 1)
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


adminRouter.get("/admin/get-recent-orders", admin, async (req, res) => {
  try {
    const orders = await Order.find({}).sort({orderedAt: -1}).limit(30);
   
    
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

adminRouter.get("/admin/get-orders/by-pindding", admin, async (req, res) => {
  try {
    const orders = await Order.find({status:0});
    orders.sort((a, b) => (a._id > b._id) ? -1 : 1)
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


adminRouter.get("/admin/get-orders/by-process", admin, async (req, res) => {
  try {
    const orders = await Order.find({status:1});
    orders.sort((a, b) => (a._id > b._id) ? -1 : 1)
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


adminRouter.get("/admin/get-orders/by-complete", admin, async (req, res) => {
  try {
    const orders = await Order.find({status:3 || 2});
    orders.sort((a, b) => (a._id > b._id) ? -1 : 1)
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});



adminRouter.get("/oders/search/:name", admin, async (req, res) => {
  try {
    const orders = await Order.find({
      userName: { $regex: req.params.name, $options: "i" },
    });
    if(orders){
      orders.sort((a, b) => (a._id > b._id) ? -1 : 1)
      res.json(orders);

    }

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

adminRouter.post("/admin/change-order-status", admin, async (req, res) => {
  try {
    const { id, status } = req.body;
    let order = await Order.findById(id);
    order.status = status;
    order = await order.save();
    res.json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

adminRouter.get("/admin/analytics", admin, async (req, res) => {
  try {
    const orders = await Order.find({});
    let totalEarnings = 0;

    for (let i = 0; i < orders.length; i++) {
      for (let j = 0; j < orders[i].products.length; j++) {
        totalEarnings +=
          orders[i].products[j].quantity * orders[i].products[j].product.price;
      }
    }

    let cat1 ;
    let cat2 ;
    let cat3 ;
    let cat4 ;
    let cat5 ;

    let cat1name ;
    let cat2name ;
    let cat3name ;
    let cat4name ;
    let cat5name ;

  
    const cat = await Category.find({});
    for (let index = 0; index < cat.length; index++) {
      const element = cat[index];
      cat1 = await fetchCategoryWiseProduct(cat[0].name);
      cat2 = await fetchCategoryWiseProduct(cat[1].name);
      cat3 = await fetchCategoryWiseProduct(cat[2].name);
      cat4 = await fetchCategoryWiseProduct(cat[3].name);
      cat1name = cat[0].name;
      cat2name =cat[1].name;
      cat3name = cat[2].name;
      cat4name =cat[3].name;
      
    }
    
     
    // CATEGORY WISE ORDER FETCHING
    

    let earnings = {
      totalEarnings,
      cat1,
      cat2,
      cat3,
      cat4,
      cat1name,
      cat2name,
      cat3name,
      cat4name
    };

    res.json(earnings);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

async function fetchCategoryWiseProduct(category) {
  let earnings = 0;
  let categoryOrders = await Order.find({
    "products.product.category": category,
  });

  for (let i = 0; i < categoryOrders.length; i++) {
    for (let j = 0; j < categoryOrders[i].products.length; j++) {
      earnings +=
        categoryOrders[i].products[j].quantity *
        categoryOrders[i].products[j].product.price;
    }
  }
  return earnings;
}

module.exports = adminRouter;
