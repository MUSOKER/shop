const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "the product must have a name"],
    },
    description: {
      type: String,
      required: [true, "the product must have a description"],
    },
    richDescription: {
      type: String,
      required: [true, "provide the rich desription of the product"],
    },
    image: {
      type: String,
      required: [true, "attach the product image"],
    },
    images: [
      {
        type: String,
      },
    ],
    brand: {
      type: String,
    },
    price: {
      type: Number,
    },
    // category: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: "Category",
    //   required: true,
    // },
    countInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
    rating: {
      type: String,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// productSchema.pre(/find/, function (next) {
//   this.populate({
//     path: "category  ",
//     select: "title ",
//   });
//   next();
// });

module.exports = mongoose.model("Product", productSchema);
