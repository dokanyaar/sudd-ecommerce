import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Package,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import { products } from '../../data/products';

const Orders = () => {
  // Temporary frontend data.
  // Replace this with API data later.
  const orders = [
    {
      _id: 'ORD-1001',
      createdAt: '2026-09-20T10:30:00.000Z',
      status: 'Processing',
      paymentMethod: 'M-Pesa',
      paymentStatus: 'Paid',
      total: 6300,
      items: [
        {
          ...products[0],
          quantity: 1,
          selectedSize: 'M',
        },
        {
          ...products[1],
          quantity: 1,
          selectedSize: '42',
        },
      ],
    },
    {
      _id: 'ORD-1002',
      createdAt: '2026-09-14T14:20:00.000Z',
      status: 'Delivered',
      paymentMethod: 'Cash on delivery',
      paymentStatus: 'Paid',
      total: 3800,
      items: [
        {
          ...products[6],
          quantity: 1,
          selectedSize: null,
        },
        {
          ...products[9],
          quantity: 1,
          selectedSize: null,
        },
      ],
    },
  ];

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
          <OrderInfo label="Order" value={`#${order._id}`} />

          <OrderInfo label="Date" value={formatDate(order.createdAt)} />

          <OrderInfo
            label="Total"
            value={`KSh ${order.total.toLocaleString()}`}
          />

          <OrderInfo label="Payment" value={order.paymentMethod} />
        </div>

        <OrderStatus status={order.status} />
      </div>

      {/* Products */}
      <div className="divide-y divide-gray-100 px-5 sm:px-6">
        {order.items.map((product) => (
          <div
            key={`${product._id}-${product.selectedSize}`}
            className="flex gap-4 py-6 sm:gap-6"
          >
            {/* Image */}
            <Link
              to={`/product/${product._id}`}
              className="h-24 w-20 shrink-0 overflow-hidden bg-gray-100 sm:h-28 sm:w-24"
            >
              <img
                src={product.image?.[0]}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </Link>

            {/* Product Info */}
            <div className="flex min-w-0 flex-1 flex-col justify-between sm:flex-row sm:items-center">
              <div>
                <p className="mb-1 text-xs text-gray-400">{product.category}</p>

                <Link
                  to={`/product/${product._id}`}
                  className="text-sm font-medium text-gray-900 transition hover:text-gray-600 sm:text-base"
                >
                  {product.name}
                </Link>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                  <span>Qty: {product.quantity}</span>

                  {product.selectedSize && (
                    <span>Size: {product.selectedSize}</span>
                  )}
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
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {order.paymentStatus === 'Paid' && (
            <>
              <CheckCircle2 size={15} strokeWidth={1.7} />
              Payment confirmed
            </>
          )}
        </div>

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
    Processing: {
      icon: Clock3,
      label: 'Processing',
    },

    Shipped: {
      icon: Truck,
      label: 'Shipped',
    },

    Delivered: {
      icon: CheckCircle2,
      label: 'Delivered',
    },
  };

  const config = statusConfig[status] || {
    icon: Package,
    label: status,
  };

  const Icon = config.icon;

  return (
    <div className="flex w-fit items-center gap-2 border border-gray-200 bg-white px-3 py-2">
      <Icon size={14} strokeWidth={1.8} className="text-gray-600" />

      <span className="text-xs font-medium text-gray-700">{config.label}</span>
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

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
};

export default Orders;
