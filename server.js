const express = require("express");
const app = express();

require("dotenv").config();

// Declaring the PORT
const PORT = process.env.PORT || 9001;

// Accessing monggose to connect with mongoDB
const mongoose = require("mongoose");

// declaring local and remote mongo URI
const mongo_uri_local = process.env.MONGO_URI_LOCAL;
const mongo_uri_remote = process.env.MONGO_URI_REMOTE;

// importing the PRODUCT MODEL
const Product = require("./models/productModels");

// Accessing cors ( third party middleware)
const cors = require("cors");

// Mounting Middlewares when the application starts

// Mounting middleware for Avoiding Cross Origin Resource Conflicts
app.use(cors());

// Mounting middleware for seamless JSON data exchange, we dont need bodyParser
app.use(express.json());

// Mounting middleware for accepting data through a form submission
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Establish a connection with MongoDB

const connectMongo = async () => {
  try {
    await mongoose.connect(mongo_uri_remote).then(() => {
      console.log("Successfully Connected to MongoDB Database...");
    });
  } catch (error) {
    console.log(`Error connecting to DB... ${error}`);
  }
};
connectMongo();

// AUTH ROUTER
const authRouter = require('./Routes/AuthRouter');
app.use('/auth', authRouter);

// productsRouter for authenticated API using JWT
const productsRouter = require('./Routes/productsRouter')
app.use('/api/items', productsRouter);

// CRUD API END POINTS
app.post("/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
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

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
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

app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
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

app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body);
    if (!product) {
      return res.product(404).json({
        message: `Can't Find Product with that Specific ID ${id}`,
      });
    }
    const updatedProduct = await Product.findById(id);
    res.status(200).json({
      message: `Product updated successfully`,
      updatedProduct,
    });
  } catch (error) {
    res.status({
      message: error.message,
    });
    console.log("Problem Updating the Product");
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

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

app.listen(PORT, (error) => {
  if(error){
    console.error("Error Connecting to Database",error)
  }
  else{
    console.log(`Server listening to PORT : ${PORT}`);
  }
});
