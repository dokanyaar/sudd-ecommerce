import { toFile } from '@imagekit/nodejs';

import imagekit from '../config/imagekit.js';
import Product from '../models/product.model.js';
import { generateUniqueProductSlug } from '../utils/generateSlug.js';
import mongoose from 'mongoose';

// create product
export const createProduct = async (req, res) => {
  const uploadedImages = [];

  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      colors,
      bestseller,
      inStock,
    } = req.body;

    // validate required fields
    if (
      !name?.trim() ||
      !description?.trim() ||
      !price ||
      !category ||
      !subCategory
    ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields.',
      });
    }

    // validate prices
    const numericPrice = Number(price);

    if (
      !name?.trim() ||
      !description?.trim() ||
      price === undefined ||
      price === '' ||
      Number.isNaN(numericPrice) ||
      numericPrice < 0 ||
      !category ||
      !subCategory
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing required fields.',
      });
    }

    const slug = await generateUniqueProductSlug(name);

    // validate images
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one product image is required.',
      });
    }

    if (req.files.length > 4) {
      return res.status(400).json({
        success: false,
        message: 'A maximum of 4 product images is allowed.',
      });
    }

    // upload images to ImageKit
    for (const file of req.files) {
      const imageFile = await toFile(file.buffer, file.originalname);

      const uploadedImage = await imagekit.files.upload({
        file: imageFile,
        fileName: `${Date.now()}-${file.originalname}`,
        folder: '/sudd-shop/products',
      });

      uploadedImages.push({
        url: uploadedImage.url,
        fileId: uploadedImage.fileId,
      });
    }

    // create product
    const product = await Product.create({
      name: name.trim(),
      slug,
      description: description.trim(),
      price: Number(price),
      category,
      subCategory,
      sizes: sizes ? JSON.parse(sizes) : [],
      colors: colors ? JSON.parse(colors) : [],
      images: uploadedImages,
      bestseller: bestseller === 'true',
      inStock: inStock !== 'false',
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      product,
    });
  } catch (error) {
    console.error('Create product error:', error);

    // delete uploaded images if something fails
    for (const image of uploadedImages) {
      try {
        await imagekit.files.delete(image.fileId);
      } catch (deleteError) {
        console.error('Image cleanup error:', deleteError);
      }
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to create product.',
    });
  }
};

// get all products by public
export const getProducts = async (_req, res) => {
  try {
    const products = await Product.find({ inStock: true }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error('Get products error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch products.',
    });
  }
};

// get product by slug
export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: 'Product slug is required.',
      });
    }

    const product = await Product.findOne({ slug });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Get product by slug error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch product.',
    });
  }
};

// get all products by admin
export const getProductsByAdmin = async (req, res) => {
  try {
    const products = await Product.find({}).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error('Get products error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch products.',
    });
  }
};

// get product by id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product id.',
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Get product by id error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch product.',
    });
  }
};

// delete product
export const deleteProductByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product id.',
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    // Keep the ImageKit file IDs before deleting the product
    const imageFileIds = product.images
      .map((image) => image.fileId)
      .filter(Boolean);

    // Delete product from database first
    await Product.findByIdAndDelete(id);

    // Clean up images from ImageKit
    for (const fileId of imageFileIds) {
      try {
        await imagekit.files.delete(fileId);
      } catch (error) {
        console.error(`Failed to delete ImageKit file ${fileId}:`, error);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully.',
    });
  } catch (error) {
    console.error('Delete product error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete product.',
    });
  }
};

// update product
export const updateProductByAdmin = async (req, res) => {
  const uploadedImages = [];

  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product id.',
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      colors,
      bestseller,
      inStock,
    } = req.body;

    // Update name and regenerate slug
    if (name !== undefined && name.trim() !== product.name) {
      const trimmedName = name.trim();

      if (!trimmedName) {
        return res.status(400).json({
          success: false,
          message: 'Product name cannot be empty.',
        });
      }

      product.name = trimmedName;

      product.slug = await generateUniqueProductSlug(trimmedName, product._id);
    }

    if (description !== undefined) {
      const trimmedDescription = description.trim();

      if (!trimmedDescription) {
        return res.status(400).json({
          success: false,
          message: 'Description cannot be empty.',
        });
      }

      product.description = trimmedDescription;
    }

    if (subCategory !== undefined) {
      const trimmedSubCategory = subCategory.trim();

      if (!trimmedSubCategory) {
        return res.status(400).json({
          success: false,
          message: 'Subcategory cannot be empty.',
        });
      }

      product.subCategory = trimmedSubCategory;
    }

    if (price !== undefined) {
      const numericPrice = Number(price);

      if (Number.isNaN(numericPrice) || numericPrice < 0) {
        return res.status(400).json({
          success: false,
          message: 'Price must be a valid number.',
        });
      }

      product.price = numericPrice;
    }

    if (category !== undefined) {
      product.category = category;
    }

    if (subCategory !== undefined) {
      product.subCategory = subCategory.trim();
    }

    if (sizes !== undefined) {
      product.sizes = Array.isArray(sizes) ? sizes : JSON.parse(sizes);
    }

    if (colors !== undefined) {
      product.colors = Array.isArray(colors) ? colors : JSON.parse(colors);
    }

    if (bestseller !== undefined) {
      product.bestseller =
        typeof bestseller === 'boolean' ? bestseller : bestseller === 'true';
    }

    if (inStock !== undefined) {
      product.inStock =
        typeof inStock === 'boolean' ? inStock : inStock === 'true';
    }

    // Keep old images before replacing them
    const oldImages = [...product.images];

    // Replace images only when new images are provided
    if (req.files?.length > 0) {
      if (req.files.length > 4) {
        return res.status(400).json({
          success: false,
          message: 'A maximum of 4 product images is allowed.',
        });
      }

      // Upload new images first
      for (const file of req.files) {
        const imageFile = await toFile(file.buffer, file.originalname);

        const uploadedImage = await imagekit.files.upload({
          file: imageFile,
          fileName: `${Date.now()}-${file.originalname}`,
          folder: '/sudd-shop/products',
        });

        uploadedImages.push({
          url: uploadedImage.url,
          fileId: uploadedImage.fileId,
        });
      }

      // Replace old images in MongoDB
      product.images = uploadedImages;
    }

    // Save updated product
    await product.save();

    // MongoDB update succeeded.
    // We can now safely remove the old ImageKit files.
    if (req.files?.length > 0) {
      for (const image of oldImages) {
        if (!image.fileId) continue;

        try {
          await imagekit.files.delete(image.fileId);
        } catch (error) {
          console.error(`Failed to delete old image ${image.fileId}:`, error);
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      product,
    });
  } catch (error) {
    console.error('Update product error:', error);

    // If the update failed after uploading new images,
    // clean up those new images.
    for (const image of uploadedImages) {
      try {
        await imagekit.files.delete(image.fileId);
      } catch (deleteError) {
        console.error(`Failed to clean up image ${image.fileId}:`, deleteError);
      }
    }

    if (error instanceof SyntaxError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid sizes or colors format.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to update product.',
    });
  }
};
