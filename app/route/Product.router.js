const router = require("express").Router();
const { createPoduct, getAllProducts, searchProductsByTitle, searchProductsByCatagory, deletePost, productUpdate } = require("../controller/Product.controller");

router.post("/create", createPoduct);
router.get("/", getAllProducts);
router.post("/search", searchProductsByTitle);
router.post("/search_catagory", searchProductsByCatagory);
router.delete("/delete", deletePost);
router.put("/:productId", productUpdate)

module.exports = router;