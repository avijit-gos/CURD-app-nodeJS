const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const Product = require("../model/product.model")

//Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true
});

class ProductController {
  constructor() {
    console.log("ProductController Init!!!");
  }

  createPoduct(req, res) {
    const file = req.files.product_image;
    const { title, desc, catagory } = req.body;
    Product.findOne({ title }, (err, result) => {
      if (err || result !== null) {
        return res.status(401).json({ msg: "Title already being taken" });
      }
      else {
        cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
          if (err) {
            return res.status(401).json({ msg: "Product image cannot uploaded" });
          }
          else {
            const newProduct = Product({
              _id: new mongoose.Types.ObjectId,
              title: title,
              desc: desc,
              catagory: catagory,
              product_image: result.url
            })
            newProduct.save()
              .then(result => {
                res.status(201).json({ msg: "New Product has been saved", result })
              })
              .catch(err => {
                return res.status(401).json({ msg: err.message });
              })
          }
        });
      }
    });
  }

  getAllProducts(req, res) {
    const { page = 1, limit = 1 } = req.query;
    Product.find({}, (err, result) => {
      if (err || result === null) {
        return res.status(401).json({ msg: "Empty product list" })
      }
      else {
        res.status(200).json({ result })
      }
    }).limit(limit * 1).skip((page - 1) * limit).sort({ createdAt: -1 })
  }

  searchProductsByTitle(req, res) {
    const { title } = req.body;
    Product.findOne({ title }, (err, result) => {
      if (err || result === null) {
        return res.status(401).json({ msg: "Not found" });
      }
      else {
        return res.status(200).json({ result });
      }
    })
  }

  searchProductsByCatagory(req, res) {
    const { page = 1, limit = 1 } = req.query;
    const { catagory } = req.body;
    Product.find({ catagory }, (err, result) => {
      if (err || result === null) {
        return res.status(401).json({ msg: "Not found" });
      }
      else {
        res.status(200).json({ result })
      }
    }).limit(limit * 1).skip((page - 1) * limit)
  }

  deletePost(req, res) {
    const { _id } = req.body;
    Product.findByIdAndDelete(_id, (err, result) => {
      if (err) {
        return res.status(401).json({ msg: "Not found" });
      }
      else {
        return res.status(200).json({ msg: "Product deleted" });
      }
    })
  }

  productUpdate(req, res) {
    const { title, desc } = req.body
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }
    else {
      const productId = req.params.productId;
      Product.findByIdAndUpdate(productId, { $set: { title: req.body.title, desc: req.body.desc } })
        .then(result => {
          res.status(201).json({ msg: "Sucessfully updated", result });
        })
        .catch(err => {
          return res.status(401).json({ msg: err.message });
        })
    }
  }
}

module.exports = new ProductController();