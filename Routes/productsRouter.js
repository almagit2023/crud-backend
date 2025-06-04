const express = require("express");
const router = express.Router();
const Product = require("../models/productModels");
const ensureAuthenticated = require("../Middlewares/Auth");

router.post("/", ensureAuthenticated, async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      userId: req.user._id, // Add userId from JWT payload
    });
    res.status(200).json({
      message: `Product created successfully with name: ${req.body.name}`,
      product,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    const products = await Product.find({ userId: req.user._id }); // Filter by userId
    res.status(200).json({
      message: "Products Fetched successfully...",
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/:id", ensureAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id, userId: req.user._id }); // Filter by userId
    if (!product) {
      return res.status(404).json({
        message: `Can't Find Product with that Specific ID ${id}`,
      });
    }
    res.status(200).json({
      message: "Product Fetched successfully...",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.put("/:id", ensureAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOneAndUpdate(
      { _id: id, userId: req.user._id }, // Filter by userId
      req.body,
      { new: true }
    );
    if (!product) {
      return res.status(404).json({
        message: `Can't Find Product with that Specific ID ${id}`,
      });
    }
    res.status(200).json({
      message: `Product updated successfully`,
      updatedProduct: product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
    console.log("Problem Updating the Product");
  }
});

router.delete("/:id", ensureAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOneAndDelete({ _id: id, userId: req.user._id }); // Filter by userId
    if (!product) {
      return res.status(404).json({
        message: "Can't find product to delete...",
      });
    }
    res.status(200).json({
      message: `Product deleted successfully...`,
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;