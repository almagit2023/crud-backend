const express = require("express");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 9001;
const mongoose = require("mongoose");
const mongo_uri_local = process.env.MONGO_URI_LOCAL;
const mongo_uri_remote = process.env.MONGO_URI_REMOTE;
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectMongo = async () => {
  try {
    await mongoose.connect(mongo_uri_remote).then(() => {
      console.log("Successfully Connected to MongoDB Database...");
    });
  } catch (error) {
    console.log(`Error connecting to DB...${error}`);
  }
};
connectMongo();

// AUTH ROUTER
const authRouter = require("./Routes/AuthRouter");
app.use("/auth", authRouter);

// PRODUCTS ROUTER
const productsRouter = require("./Routes/productsRouter");
app.use("/products", productsRouter);

app.listen(PORT, (error) => {
  if (error) {
    console.error("Error Connecting to Database", error);
  } else {
    console.log(`Server listening to PORT :${PORT}`);
  }
});
