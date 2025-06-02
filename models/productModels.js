const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter product name.."],
    },
    quantity: {
      type: String,
      required: [true, "Please enter product quantity"],
      default: 0,
    },
    price: {
      type: String,
      required: [true, "Please enter product Price"],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product
