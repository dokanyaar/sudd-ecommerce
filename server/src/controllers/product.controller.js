import { toFile } from '@imagekit/nodejs';

import imagekit from '../config/imagekit.js';
import Product from '../models/product.model.js';

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
