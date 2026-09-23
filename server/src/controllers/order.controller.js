import mongoose from 'mongoose';

import Order from '../models/order.model.js';
import Product from '../models/product.model.js';

export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    // 1. Validate cart items
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty.',
      });
    }

    // 2. Validate shipping address
    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required.',
      });
    }

    const { firstName, lastName, email, phone, street, city, county, country } =
      shippingAddress;

    if (
      !firstName?.trim() ||
      !lastName?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !street?.trim() ||
      !city?.trim() ||
      !county?.trim() ||
      !country?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required shipping information.',
      });
    }

    // 3. Validate payment method
    const allowedPaymentMethods = ['MPESA', 'COD'];

    if (!allowedPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method.',
      });
    }

    // 4. Validate product IDs before querying MongoDB
    const hasInvalidProductId = items.some(
      (item) => !mongoose.Types.ObjectId.isValid(item.productId),
    );

    if (hasInvalidProductId) {
      return res.status(400).json({
        success: false,
        message: 'One or more cart items contain an invalid product ID.',
      });
    }

    // 5. Get unique product IDs from cart
    const productIds = [...new Set(items.map((item) => item.productId))];

    // 6. Fetch the real products from MongoDB
    const products = await Product.find({
      _id: {
        $in: productIds,
      },
    });

    // 7. Make product lookup faster
    const productMap = new Map(
      products.map((product) => [product._id.toString(), product]),
    );

    const orderItems = [];
    let subtotal = 0;

    // 8. Build trusted order items
    for (const item of items) {
      const product = productMap.get(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'One or more products in your cart no longer exist.',
        });
      }

      if (!product.inStock) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is currently out of stock.`,
        });
      }

      // Validate quantity
      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for ${product.name}.`,
        });
      }

      // Validate size
      let size = null;

      if (product.sizes?.length > 0) {
        if (!item.size || !product.sizes.includes(item.size)) {
          return res.status(400).json({
            success: false,
            message: `Please select a valid size for ${product.name}.`,
          });
        }

        size = item.size;
      }

      // Validate color
      let color = null;

      if (product.colors?.length > 0) {
        if (!item.color || !product.colors.includes(item.color)) {
          return res.status(400).json({
            success: false,
            message: `Please select a valid color for ${product.name}.`,
          });
        }

        color = item.color;
      }

      // IMPORTANT:
      // Price comes from MongoDB, not req.body
      const price = product.price;

      const itemTotal = price * quantity;

      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0]?.url || '',
        price,
        size,
        color,
        quantity,
      });
    }

    // 9. Calculate totals on server
    const deliveryFee = 300;
    const total = subtotal + deliveryFee;

    // 10. Create permanent order
    const order = await Order.create({
      user: req.user._id,

      items: orderItems,

      shippingAddress: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        street: street.trim(),
        apartment: shippingAddress.apartment?.trim() || '',
        city: city.trim(),
        county: county.trim(),
        postalCode: shippingAddress.postalCode?.trim() || '',
        country: country.trim(),
      },

      paymentMethod,
      paymentStatus: 'PENDING',
      orderStatus: 'PENDING',

      subtotal,
      deliveryFee,
      total,
    });

    return res.status(201).json({
      success: true,
      message: 'Order created successfully.',
      order,
    });
  } catch (error) {
    console.error('Create order error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to create order.',
    });
  }
};

// get order by id
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID.',
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Get order error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve order.',
    });
  }
};

// get my orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error('Get my orders error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders.',
    });
  }
};

// get all orders by admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error('Admin get all orders error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders.',
    });
  }
};

// update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID.',
      });
    }

    const allowedStatuses = [
      'PENDING',
      'PROCESSING',
      'SHIPPED',
      'DELIVERED',
      'CANCELLED',
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status.',
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    order.orderStatus = status;

    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully.',
      order,
    });
  } catch (error) {
    console.error('Update order status error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update order status.',
    });
  }
};
