import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      required: true,
      enum: ['Men', 'Women', 'Shoes', 'Accessories'],
    },

    subCategory: {
      type: String,
      required: true,
      trim: true,
    },

    sizes: {
      type: [String],
      default: [],
    },

    colors: {
      type: [String],
      default: [],
    },

    images: [
      {
        _id: false,

        url: {
          type: String,
          required: true,
          trim: true,
        },

        fileId: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],

    bestseller: {
      type: Boolean,
      default: false,
    },

    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model('Product', productSchema);

export default Product;
