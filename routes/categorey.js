const express = require("express");
const admin = require("../middlewares/admin");
const categoryRouter = express.Router();
const auth = require("../middlewares/auth");
const { Category } = require("../models/category");

categoryRouter.get("/api/category", async (req, res) => {
  try {
    const categories = await Category.find({});
    categories.sort((a, b) => (a._id > b._id) ? -1 : 1)
    res.json(categories);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});




categoryRouter.post("/admin/add-category", admin, async (req, res) => {
    try {
      const { name, icon} = req.body;
      const categoryExists = await Category.findOne({ name })

      if (categoryExists) {
          res.status(400)
          throw new Error('category already exists')
      }
      let category = new Category({
        name,
        icon,
        
      });
      category = await category.save();
      res.json(category);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
});


categoryRouter.put("/admin/update-category", admin, async (req, res) => {
  try {
    const  {id, name, icon} = req.body; 
    let category = await Category.findById(id);
    if(category){
        category.name = name;
        category.icon = icon;
        category = await category.save();
        res.json(category);
    }
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});



// Delete the product
categoryRouter.post("/admin/delete-category", admin, async (req, res) => {
  try {
    const { id } = req.body;
    let category = await Category.findByIdAndDelete(id);
    res.json(category);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});





module.exports = categoryRouter;
