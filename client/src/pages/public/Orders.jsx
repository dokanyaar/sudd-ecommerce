import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Package,
  ShoppingBag,
  Truck,
  XCircle,
} from 'lucide-react';

import { getMyOrders } from '../../services/order.service';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await getMyOrders();

        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);

        setError(error.response?.data?.message || 'Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-[600px] items-center justify-center">
        <p className="text-sm text-gray-500">Loading orders...</p>
      </main>
    );
  }

  if (error) {
    return <OrdersError message={error} />;
  }

  if (orders.length === 0) {
    return <EmptyOrders />;
  }

  return (
    <main className="py-10 sm:py-14">
      {/* Header */}
      <div className="mb-10 border-b border-gray-200 pb-8">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
          Your account
        </p>

        <h1 className="text-3xl font-medium tracking-tight text-gray-950 sm:text-4xl">
          My orders
        </h1>

        <p className="mt-3 max-w-lg text-sm leading-6 text-gray-500">
          View your recent purchases, payment details and delivery status.
        </p>
      </div>

      {/* Orders */}
      <div className="space-y-6">
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
    </main>
  );
};

const OrderCard = ({ order }) => {
  return (
    <article className="border border-gray-200">
      {/* Order Header */}
      <div className="flex flex-col gap-5 border-b border-gray-200 bg-gray-50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:flex sm:items-center sm:gap-10">
          <OrderInfo label="Order" value={`#${shortOrderId(order._id)}`} />

          <OrderInfo label="Date" value={formatDate(order.createdAt)} />

          <OrderInfo
            label="Total"
            value={`KSh ${order.total.toLocaleString()}`}
          />

          <OrderInfo
            label="Payment"
            value={formatPaymentMethod(order.paymentMethod)}
          />
        </div>

        <OrderStatus status={order.orderStatus} />
      </div>

      {/* Products */}
      <div className="divide-y divide-gray-100 px-5 sm:px-6">
        {order.items.map((product) => (
          <div
            key={`${product.product}-${product.size}-${product.color}`}
            className="flex gap-4 py-6 sm:gap-6"
          >
            {/* Image */}
            <div className="h-24 w-20 shrink-0 overflow-hidden bg-gray-100 sm:h-28 sm:w-24">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="flex min-w-0 flex-1 flex-col justify-between sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-medium text-gray-900 sm:text-base">
                  {product.name}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                  <span>Qty: {product.quantity}</span>

                  {product.size && <span>Size: {product.size}</span>}

                  {product.color && <span>Color: {product.color}</span>}
                </div>
              </div>

              <div className="mt-4 sm:mt-0 sm:text-right">
                <p className="text-sm font-medium text-gray-900">
                  KSh {(product.price * product.quantity).toLocaleString()}
                </p>

                {product.quantity > 1 && (
                  <p className="mt-1 text-xs text-gray-400">
                    KSh {product.price.toLocaleString()} each
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-4 border-t border-gray-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <PaymentStatus status={order.paymentStatus} />

        <Link
          to={`/orders/${order._id}`}
          className="group inline-flex items-center gap-2 text-sm font-medium text-gray-900"
        >
          View order
          <ArrowRight
            size={15}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>
    </article>
  );
};

const OrderInfo = ({ label, value }) => {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-xs font-medium text-gray-800 sm:text-sm">
        {value}
      </p>
    </div>
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
    <div className="flex w-fit items-center gap-2 border border-gray-200 bg-white px-3 py-2">
      <Icon size={14} strokeWidth={1.8} className="text-gray-600" />

      <span className="text-xs font-medium text-gray-700">{config.label}</span>
    </div>
  );
};

const PaymentStatus = ({ status }) => {
  if (status === 'PAID') {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <CheckCircle2 size={15} strokeWidth={1.7} />
        Payment confirmed
      </div>
    );
  }

  if (status === 'FAILED') {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <XCircle size={15} strokeWidth={1.7} />
        Payment failed
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs text-gray-500">
      <Clock3 size={15} strokeWidth={1.7} />
      Payment pending
    </div>
  );
};

const EmptyOrders = () => {
  return (
    <main className="flex min-h-[600px] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <ShoppingBag size={26} strokeWidth={1.5} className="text-gray-500" />
      </div>

      <h1 className="mt-6 text-xl font-medium text-gray-950">No orders yet</h1>

      <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
        When you place an order, you'll be able to view and track it here.
      </p>

      <Link
        to="/collection"
        className="group mt-7 inline-flex items-center gap-3 bg-black px-6 py-3.5 text-sm font-medium text-white transition hover:bg-gray-800"
      >
        Start shopping
        <ArrowRight
          size={16}
          className="transition-transform group-hover:translate-x-1"
        />
      </Link>
    </main>
  );
};

const OrdersError = ({ message }) => {
  return (
    <main className="flex min-h-[600px] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <Package size={26} strokeWidth={1.5} className="text-gray-500" />
      </div>

      <h1 className="mt-6 text-xl font-medium text-gray-950">
        Couldn't load orders
      </h1>

      <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">{message}</p>
    </main>
  );
};

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
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

const shortOrderId = (orderId) => {
  if (!orderId) return '';

  return orderId.slice(-8).toUpperCase();
};

export default Orders;
