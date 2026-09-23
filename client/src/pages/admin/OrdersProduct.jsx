import { useEffect, useState } from 'react';

import {
  CheckCircle2,
  Clock3,
  Package,
  ShoppingBag,
  Truck,
  XCircle,
} from 'lucide-react';

import toast from 'react-hot-toast';

import { getAllOrders, updateOrderStatus } from '../../services/order.service';

const OrdersProduct = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await getAllOrders();

        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error('Failed to fetch admin orders:', error);

        setError(error.response?.data?.message || 'Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const statusHandler = async (event, orderId) => {
    const status = event.target.value;

    try {
      setUpdatingOrderId(orderId);

      const data = await updateOrderStatus(orderId, status);

      if (data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  orderStatus: data.order.orderStatus,
                }
              : order,
          ),
        );

        toast.success(`Order status updated to ${formatStatus(status)}.`);
      }
    } catch (error) {
      console.error('Failed to update order status:', error);

      toast.error(
        error.response?.data?.message || 'Failed to update order status.',
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-72 items-center justify-center">
        <p className="text-sm text-gray-500">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return <OrdersError message={error} />;
  }

  return (
    <div>
      {/* Header */}
      <div>
        <p className="text-sm text-gray-500">Orders</p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
          Customer orders
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Review, process and update orders placed through Sudd Shop.
        </p>
      </div>

      {/* Count */}
      <div className="mt-8 flex items-center justify-between border border-gray-200 bg-white px-5 py-4">
        <p className="text-sm font-medium text-gray-900">All orders</p>

        <p className="text-xs text-gray-400">
          {orders.length} {orders.length === 1 ? 'order' : 'orders'}
        </p>
      </div>

      {orders.length === 0 ? (
        <EmptyOrders />
      ) : (
        <div className="space-y-4 pt-4">
          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onStatusChange={statusHandler}
              updating={updatingOrderId === order._id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const OrderCard = ({ order, onStatusChange, updating }) => {
  const customerName = [
    order.shippingAddress?.firstName,
    order.shippingAddress?.lastName,
  ]
    .filter(Boolean)
    .join(' ');

  const location = [
    order.shippingAddress?.street,
    order.shippingAddress?.apartment,
    order.shippingAddress?.city,
    order.shippingAddress?.county,
    order.shippingAddress?.country,
    order.shippingAddress?.postalCode,
  ]
    .filter(Boolean)
    .join(', ');

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <article className="border border-gray-200 bg-white">
      {/* Order Header */}
      <div className="flex flex-col gap-4 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center bg-gray-100">
            <Package size={18} strokeWidth={1.6} />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900">
              Order #{order._id?.slice(-8).toUpperCase()}
            </p>

            <p className="mt-1 text-xs text-gray-400">{formattedDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <OrderStatus status={order.orderStatus} />

          <select
            value={order.orderStatus}
            onChange={(event) => onStatusChange(event, order._id)}
            disabled={updating}
            className="h-10 cursor-pointer border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 outline-none transition focus:border-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="PENDING">Order placed</option>

            <option value="PROCESSING">Processing</option>

            <option value="SHIPPED">Shipped</option>

            <option value="DELIVERED">Delivered</option>

            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Order Body */}
      <div className="grid gap-8 p-5 sm:p-6 lg:grid-cols-[1.4fr_1fr_0.8fr]">
        {/* Products */}
        <div>
          <p className="mb-4 text-xs font-medium uppercase tracking-wide text-gray-400">
            Items
          </p>

          <div className="space-y-4">
            {order.items?.map((item, index) => (
              <div
                key={`${order._id}-${item.product}-${item.size}-${item.color}-${index}`}
                className="flex justify-between gap-4"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {item.name}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Qty {item.quantity}
                    {item.size ? ` · Size ${item.size}` : ''}
                    {item.color ? ` · ${item.color}` : ''}
                  </p>
                </div>

                <p className="shrink-0 text-sm text-gray-600">
                  KSh {Number(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Customer */}
        <div>
          <p className="mb-4 text-xs font-medium uppercase tracking-wide text-gray-400">
            Customer
          </p>

          <p className="text-sm font-medium text-gray-900">
            {customerName || order.user?.name || 'Customer'}
          </p>

          {order.user?.email && (
            <p className="mt-1 text-xs text-gray-400">{order.user.email}</p>
          )}

          <p className="mt-3 text-sm leading-6 text-gray-500">
            {location || 'No address provided'}
          </p>

          {order.shippingAddress?.phone && (
            <p className="mt-2 text-sm text-gray-500">
              {order.shippingAddress.phone}
            </p>
          )}

          {order.shippingAddress?.email && (
            <p className="mt-1 text-sm text-gray-500">
              {order.shippingAddress.email}
            </p>
          )}
        </div>

        {/* Payment */}
        <div>
          <p className="mb-4 text-xs font-medium uppercase tracking-wide text-gray-400">
            Payment
          </p>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-gray-400">Method</span>

              <span className="text-right font-medium text-gray-700">
                {formatPaymentMethod(order.paymentMethod)}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-gray-400">Status</span>

              <PaymentStatus status={order.paymentStatus} />
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-gray-400">Subtotal</span>

              <span className="font-medium text-gray-700">
                KSh {Number(order.subtotal || 0).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-gray-400">Delivery</span>

              <span className="font-medium text-gray-700">
                KSh {Number(order.deliveryFee || 0).toLocaleString()}
              </span>
            </div>

            <div className="mt-4 flex justify-between gap-4 border-t border-gray-100 pt-4">
              <span className="font-medium text-gray-900">Total</span>

              <span className="font-semibold text-gray-950">
                KSh {Number(order.total || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

const OrderStatus = ({ status }) => {
  const statusConfig = {
    PENDING: {
      icon: Clock3,
      label: 'Order placed',
    },

    PROCESSING: {
      icon: Package,
      label: 'Processing',
    },

    SHIPPED: {
      icon: Truck,
      label: 'Shipped',
    },

    DELIVERED: {
      icon: CheckCircle2,
      label: 'Delivered',
    },

    CANCELLED: {
      icon: XCircle,
      label: 'Cancelled',
    },
  };

  const config = statusConfig[status] || {
    icon: Package,
    label: formatStatus(status),
  };

  const Icon = config.icon;

  return (
    <div className="hidden items-center gap-2 text-xs text-gray-500 sm:flex">
      <Icon size={14} strokeWidth={1.7} />

      <span>{config.label}</span>
    </div>
  );
};

const PaymentStatus = ({ status }) => {
  const statusConfig = {
    PAID: {
      label: 'Paid',
      className: 'text-green-600',
    },

    PENDING: {
      label: 'Pending',
      className: 'text-amber-600',
    },

    FAILED: {
      label: 'Failed',
      className: 'text-red-600',
    },
  };

  const config = statusConfig[status] || {
    label: formatStatus(status),
    className: 'text-gray-600',
  };

  return (
    <span className={`font-medium ${config.className}`}>{config.label}</span>
  );
};

const EmptyOrders = () => {
  return (
    <div className="mt-4 flex min-h-72 flex-col items-center justify-center border border-gray-200 bg-white px-5 text-center">
      <div className="flex h-12 w-12 items-center justify-center bg-gray-100">
        <ShoppingBag size={20} className="text-gray-500" />
      </div>

      <h3 className="mt-4 text-sm font-medium text-gray-900">No orders yet</h3>

      <p className="mt-2 max-w-xs text-sm leading-6 text-gray-400">
        Customer orders will appear here when purchases are made.
      </p>
    </div>
  );
};

const OrdersError = ({ message }) => {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center border border-gray-200 bg-white px-5 text-center">
      <div className="flex h-12 w-12 items-center justify-center bg-gray-100">
        <Package size={20} className="text-gray-500" />
      </div>

      <h3 className="mt-4 text-sm font-medium text-gray-900">
        Couldn't load orders
      </h3>

      <p className="mt-2 max-w-xs text-sm leading-6 text-gray-400">{message}</p>
    </div>
  );
};

const formatPaymentMethod = (method) => {
  const methods = {
    MPESA: 'M-Pesa',
    COD: 'Cash on delivery',
  };

  return methods[method] || method;
};

const formatStatus = (status) => {
  if (!status) return '';

  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

export default OrdersProduct;
