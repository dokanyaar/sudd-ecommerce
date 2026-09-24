import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import User from '../models/user.model.js';

// get admin dashboard overview
export const getAdminDashboard = async (req, res) => {
  try {
    const [
      totalOrders,
      ordersAwaitingFulfillment,
      totalProducts,
      availableProducts,
      totalCustomers,
      recentOrders,
    ] = await Promise.all([
      // total orders
      Order.countDocuments(),

      // orders that still need processing
      Order.countDocuments({
        orderStatus: {
          $in: ['PENDING', 'PROCESSING'],
        },
      }),

      // total products
      Product.countDocuments(),

      // products currently available
      Product.countDocuments({
        inStock: true,
      }),

      // registered customers only
      User.countDocuments({
        role: 'CUSTOMER',
      }),

      // latest 5 orders
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select(
          'user shippingAddress total orderStatus paymentMethod paymentStatus createdAt',
        )
        .populate('user', 'name email')
        .lean(),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        ordersAwaitingFulfillment,
        totalProducts,
        availableProducts,
        totalCustomers,
      },
      recentOrders,
    });
  } catch (error) {
    console.error('Failed to get admin dashboard:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to get dashboard data.',
    });
  }
};
