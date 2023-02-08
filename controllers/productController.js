const catchAsync = require("../utils/catchAsync");
const Product = require("../models/product");
//const { Storage } = require("@google-cloud/storage");
const multer = require("multer");
const { format } = require("util");
//const Email = require("../utils/email");

const AppError = require("../utils/appError");
//const Category = require("../models/category");
//const User = require("./../models/user");
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    console.log("the object is", el, allowedFields);

    if (!allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
////////////////////////////////////////////////////////////////////////
const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("Invalid Image Type");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split("").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const upload = multer({ storage: storage });

exports.uploadProductImage = upload.fields([
  { name: "image", maxCount: 1 },
  // { name: "images", maxCount: 15 },
]);

//exports.uploadProductImage = upload.single("image");
//exports.uploadProductImage = upload.single("image");
//exports.upoadProductImages=upload.array('images',12)
// app.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
//   // req.files is array of `photos` files
//   // req.body will contain the text fields, if there were any
// })

exports.saveProduct = catchAsync(async (req, res, next) => {
  console.log("req.body: ", req.body);
  console.log("req.headers", req.headers);
  console.log("hello");

  //console.log("the req is", req);

  if (!req.file) return next(new AppError("please attach a file", 400));
  const file = req.file;
  console.log("file:", file);
  const fileName = file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  const uploadedProduct = await Product.create({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: `${basePath}${fileName}`,
    ...req.body,
    // brand: req.body.brand,
    // price: req.body.price,
    // //category: req.body.category,
    // countInStock: req.body.countInStock,
    // rating: req.body.rating,
    // numReviews: req.body.numReviews,
    // isFeatured: req.body.isFeatured,
  });
  console.log(req.body);

  // try {
  //   const uploadedProduct = await Product.create({
  //     name: req.body.name,
  //     description: req.body.description,
  //     // richDescription: req.body.richDescription,
  //     image: `${basePath}${fileName}`,
  //     brand: req.body.brand,
  //     price: req.body.price,
  //     //category: req.body.category,
  //     countInStock: req.body.countInStock,
  //     rating: req.body.rating,
  //     numReviews: req.body.numReviews,
  //     isFeatured: req.body.isFeatured,
  //   });
  // } catch (error) {
  //   console.log(error);
  //   return next(new AppError("Failed to upload product", 500));
  // }

  res.status(200).json({
    status: "success",
    uploadedProduct,
  });
});
exports.uploadImages = upload.array("images", 10);
exports.uploadGalleryImages = catchAsync(async (req, res) => {
  const files = req.files;
  const fileName = files.filename;
  let imagesPaths = [];
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  if (files) {
    files.map((file) => {
      imagesPaths.push(`${basePath}${file.fileName}`);
    });
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { images: imagesPaths },

    {
      new: true,

      runValidators: true,
    }
  );

  if (!product) {
    return next(new AppError("No product found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    product,
  });
  console.log(files);

  //res.send(product);
});

exports.resizeProductImages = catchAsync(async (req, res, next) => {
  if (!req.files.image || !req.files.images) return next();
  //1 Processing a single image
  await sharp(req.files.image[0].buffer) //Calling sharp creates an object on which we use different methods in order to do our image processing
    .resize(2000, 1333); //3:2 ratio
  // .toFormat('jpeg') //To always convert the images to jpeg
  // .jpeg({ quality: 90 }) //Compressing the image further(quality) of 90%
  //.toFile(`public/uploads`); //Finally we write it to a file on our disk (needs the entire path to the file)

  //2 processing the other images
  req.body.images = [];
  //using a loop to process all the images
  let file = req.file;
  const fileName = file.filename;
  await Promise.all(
    req.files.images.map(async (file, i) => {
      await sharp(file.buffer) //Calling sharp creates an object on which we use different methods in order to do our image processing
        .resize(2000, 1333) //3:2 ratio
        // .toFormat('jpeg') //To always convert the images to jpeg
        // .jpeg({ quality: 90 }) //Compressing the image further(quality) of 90%
        .toFile(`public/uploads`); //Finally we write it to a file on our disk (needs the entire path to the file)
      req.body.images.push(fileName); //pushing the image files into the images array created
    })
  );
  next();
});

// exports.saveFile = catchAsync(async (req, res, next) => {
//   // console.log("the req is",req)
//   let file = req.file;
//   if (!file) return next(new AppError("please attach a file", 400));

//   const uploadedFile = await File.create({

//     name: file.originalname,
//     file_size: Number(file.size) / 1000000,
//     //uploaded_by: req.user._id,
//     file_type: file.mimetype.split("/")[1],
//     category: req.body.category,
//     ...req.body,
//   });
//   res.status(200).json({
//     status: "success",
//     uploadedFile,
//   });
/////////////////////////////////////////////////////////////////////////
// const storage = new Storage({
//   projectId: "mikel shops",
//   keyFilename: "firebase-admin.json",
// });
//const bucket = storage.bucket("gs://mikel-elavator.appspot.com");

//Creating a multer filter
/////////////////////////////////////////////////////////
//const multerFilter = (req, file, cb) => {
//Test if the uploaded file is an image and if its true we pass true in the cb and if false pass false i the cb along with an error
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true); //Hence no error and then pass true
//   } else {
//     cb(new AppError("Not an image! Please upload only images.", 400), false);
//   }
// };
///////////////////////////////////////////////////////

// const upload = Multer({
//   storage: Multer.memoryStorage(),
//   fileFilter: multerFilter,
// });
//middleware for uploading multiple tour images
//A mix of images
///////////////////////////////////////////////////////////////////////////////
// exports.uploadProductImages = upload.fields([
//   { name: "images", maxCount: 5000 }, //Other fields in the database
// ]);

// const multer = Multer({
//   storage: Multer.memoryStorage(),
//   limits: {
//     fileSize: 25 * 1024 * 1024, // no larger than 25mb, you can change as needed.
//   },
// });

// exports.uploadFile = multer.single("file");
/////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////
// exports.resizeProductImages = catchAsync(async (req, res, next) => {
//   // 2) processing the other images
//   //images is still an array of elements with the file name etc
//   req.body.images = [];
//   //using a loop to process all the images
//   await Promise.all(
//     req.files.images.map(async (file, i) => {
//       //Addings images field onto the req.body and use map to save the 3 promises of these 3 async functions which we can await using promise.all
//       //the file array contains the filename, buffer etc
//       //In the files array
//       //use Promise.all to for te array
//       //We use map to create an array of promises such that we can await them util when the image processing is done and move on to next line(middleware to update)
//       //With a call back function for which we get acess to the current file
//       //Creating the current file name
//       const filename = `product-${req.params.id}-${Date.now()}-${i + 1}.jpeg `; // i is the current index
//       await sharp(file.buffer) //Calling sharp creates an object on which we use different methods in order to do our image processing
//         .resize(2000, 1333) //3:2 ratio
//         .toFormat("jpeg") //To always convert the images to jpeg
//         .jpeg({ quality: 90 }); //Compressing the image further(quality) of 90%
//       //  .toFile(`public/img/tours/${filename}`); //Finally we write it to a file on our disk (needs the entire path to the file)

//       //In each iteration we push the current name to the new created image array
//       req.body.images.push(filename); //pushing the image files into the images array created
//     })
//   );
//   next();
// });
////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////
// exports.saveFile = catchAsync(async (req, res, next) => {
//   // console.log("the req is",req)
//   let file = req.file;
//   if (!file) return next(new AppError("please attach a file", 400));

//   const downloadUrl = await uploadImageToStorage(file);
//   const uploadedFile = await File.create({
//     download_url: downloadUrl,
//     name: file.originalname,
//     file_size: Number(file.size) / 1000000,
//     //uploaded_by: req.user._id,
//     file_type: file.mimetype.split("/")[1],
//     category: req.body.category,
//     ...req.body,
//   });
//   res.status(200).json({
//     status: "success",
//     uploadedFile,
//   });

////////////////////////////////////////////////////////////////////////////////////////////////
// const course_unit = await Category.findById(uploadedFile.category);
// const users = await User.find({
//   course_units_enrolled_to: req.body.course_unit,
// });

// users.forEach(async (user) => {
//   const documentURL = `${req.protocol}://gpaelevator.com/${user.university.name}/${user.course.name}/${course_unit.name}/${uploadedFile.id}`;

//   await new Email(
//     user,
//     "document uploaded",
//     "A document has been uploaded under the course unit"
//   ).sendFileUploadNotification(
//     course_unit.name,
//     uploadedFile.academic_year,
//     uploadedFile.custom_name,
//     documentURL
//   );
// });
//});
////////////////////////////////////////////////////////////////////////////////////////////////

// const uploadImageToStorage = (file) => {
//   return new Promise((resolve, reject) => {
//     if (!file) {
//       reject("No image file");
//     }
//     let newFileName = `${Date.now()}_${file.originalname}`;

//let fileUpload = bucket.file(newFileName);

// const blobStream = fileUpload.createWriteStream({
//   resumable: false,
//   public: true,
// });

//     blobStream.on("error", (error) => {
//       console.log("error is", error);

//       reject("Something is wrong! Unable to upload at the moment.");
//     });

//     blobStream.on("finish", () => {
//       // The public URL can be used to directly access the file via HTTP.
//       const url = format(
//         `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`
//       );
//       resolve(url);
//     });

//     blobStream.end(file.buffer);
//   });
// };

// exports.getAllFiles = catchAsync(async (req, res, next) => {
//   const files = await File.find({});
//   res.status(200).json({
//     status: "success",
//     files,
//   });
// });
// exports.getDocumentDetails = catchAsync(async (req, res, next) => {
//   const documentID = req.params.id;

//   if (!documentID) return next(new AppError("document id not supplied", 404));
//   const documentDetails = await File.findById(documentID);
//   res.status(200).json({
//     status: "success",
//     documentDetails,
//   });
// });

// exports.getCategoryFiles = catchAsync(async (req, res, next) => {
//   const category_id = req.params.id;
//   const category = await CourseUnit.findById(category_id);
//   if (!category) return next(new AppError("category not found", 404));
//   const files = await File.find({ category: category_id });
//   if (files.length <= 0) return next(new AppError("no files found", 404));
//   res.status(200).json({
//     status: "success",
//     files,
//   });
// });

// exports.handleVideo = catchAsync(async (req, res, next) => {
//   console.log("the body", req.body);

//   if (!req.body.video_url && !req.body.video_title) return next();
//   // console.log("the body", req);

//   const uploadedFile = await File.create({
//     download_url: req.body.video_url,
//     name: req.body.video_title,
//     video_title: req.body.video_title,
//     uploaded_by: req.user._id,
//     file_type: "video",
//     ...req.body,
//   });
//   res.status(200).json({
//     status: "success",
//     uploadedFile,
//   });
// });

// exports.updateFileDetails = catchAsync(async (req, res, next) => {
//   const document = await File.findByIdAndUpdate(
//     req.params.id,
//     {
//       title: req.body.title,
//       price: req.body.price,
//     },

//     { new: true, runValidators: ture }
//   );

//   if (!document) {
//     return next(new AppError("No file found with that id", 404));
//   }
//   res.status(200).json({
//     status: "success file details successfully updated",
//     document,
//   });
// });

// exports.deleteFile = catchAsync(async (req, res, next) => {
//   const id = req.params.id;
//   const document = await File.findByIdAndDelete(id);
//   if (!document) return next(new AppError("no file with that id found"));
//   res.status(204).json({
//     status: "success",
//     data: null,
//   });
// });

// // exports.getUserProduct = catchAsync(async (req, res, next) => {
// //   const user = req.user;
// //   const products = await File.find({
// //     products: { $in: user.product },
// //   });

// //   res.status(200).json({
// //     status: "success",
// //     num_of_documents: documents.length,
// //     documents,
// //   });
// // })
