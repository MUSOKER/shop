const express = require("express");
const productController = require("../controllers/productController");

// const {
//   uploadProduct,
//   saveProduct,
//   getAllProducts,
//   getCourseUnitFiles,
//   getDocumentDetails,
//   deleteProduct,
//   getUserDocuments,
//   updateFileDetails,
// } = require("../controllers/productController");
const router = express.Router();
//const { protect, restrictTo } = require("./../controllers/userController");

//router.post("/upload", protect, uploadFile, saveFile);
router.post(
  "/upload",
  //productController.resizeProductImages,

  productController.uploadProductImage,
  productController.saveProduct
);
router.put(
  "/gallery-images/:id",
  productController.uploadImages,
  productController.uploadGalleryImages
);
// router.delete(
//   "/delete/:id",
//   // protect,
//   //restrictTo(["admin", "lecturer"]),
//   productController.deleteProduct
// );
// router.get("/getAll", productController.getAllProducts);
// //router.get("/updateViewCount/:id", protect, updateViewCount);
// router.patch(
//   "/updateProductDetails/:id",
//   //protect,
//   // restrictTo(["admin"]),
//   updateProductDetails
// );
// //router.get("/updateLikeCount/:id", protect, updateLikeCount);
// router.get("/getDocumentDetails/:id", productController.getDocumentDetails);
// //router.get("/getUserDocuments", protect, getUserDocuments);
// router.patch(
//   "/updateFileDetails/:file_id",
//   //protect,
//   //restrictTo(["admin"]),
//   updateFileDetails
// );

module.exports = router;
