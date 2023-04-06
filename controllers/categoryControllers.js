import Category  from "../models/category.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    categories.sort((a, b) => (a._id > b._id ? -1 : 1));
    res.json(categories);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getCategoryById = async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error("category Not Found");
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, icon } = req.body;
    const categoryExists = await Category.findOne({ name });

    if (categoryExists) {
      res.status(400);
      throw new Error("category already exists");
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
};

export const updateCategory = async (req, res) => {
  try {
    const { id, name, icon } = req.body;
    let category = await Category.findById(id);
    if (category) {
      category.name = name;
      category.icon = icon;
      category = await category.save();
      res.json(category);
    }
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    let category = await Category.findByIdAndDelete(id);
    res.json(category);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
