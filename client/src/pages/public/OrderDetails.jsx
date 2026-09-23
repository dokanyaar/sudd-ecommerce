import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  Package,
  Truck,
  XCircle,
} from 'lucide-react';

import { getOrderById } from '../../services/order.service';

const OrderDetails = () => {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await getOrderById(orderId);

        if (data.success) {
          setOrder(data.order);
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);

        setError(error.response?.data?.message || 'Failed to load order.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <main className="flex min-h-[600px] items-center justify-center">
        <p className="text-sm text-gray-500">Loading order...</p>
      </main>
    );
  }

  if (error || !order) {
    return <OrderNotFound />;
  }

  return (
    <main className="py-10 sm:py-14">
      {/* Back */}
      <Link
        to="/orders"
        className="group mb-8 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-black"
      >
        <ArrowLeft
          size={16}
          className="transition-transform group-hover:-translate-x-1"
        />
        Back to orders
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-6 border-b border-gray-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
            Order details
          </p>

          <h1 className="text-2xl font-medium tracking-tight text-gray-950 sm:text-3xl">
            #{order._id}
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>

        <OrderStatus status={order.orderStatus} />
      </div>

      {/* Tracking */}
      <section className="border-b border-gray-200 py-10">
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-950">Order status</h2>

          <p className="mt-1 text-sm text-gray-500">
            Follow the progress of your order.
          </p>
        </div>

        {order.orderStatus === 'CANCELLED' ? (
          <div className="flex items-center gap-3 border border-gray-200 p-4">
            <XCircle size={20} strokeWidth={1.7} className="text-gray-600" />

            <div>
              <p className="text-sm font-medium text-gray-900">
                Order cancelled
              </p>

              <p className="mt-1 text-xs text-gray-500">
                This order has been cancelled.
              </p>
            </div>
          </div>
        ) : (
          <OrderTracker status={order.orderStatus} />
        )}
      </section>

      <div className="grid gap-12 py-10 lg:grid-cols-[1fr_360px] lg:gap-16">
        {/* Left */}
        <div>
          {/* Products */}
          <section>
            <h2 className="mb-6 text-lg font-medium text-gray-950">Items</h2>

            <div className="divide-y divide-gray-100 border-y border-gray-200">
              {order.items.map((product) => (
                <div
                  key={`${product.product}-${product.size}-${product.color}`}
                  className="flex gap-4 py-6 sm:gap-6"
                >
                  <div className="h-28 w-22 shrink-0 overflow-hidden bg-gray-100 sm:h-32 sm:w-26">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-between sm:flex-row sm:items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900 sm:text-base">
                        {product.name}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                        <span>Quantity: {product.quantity}</span>

                        {product.size && <span>Size: {product.size}</span>}

                        {product.color && <span>Color: {product.color}</span>}
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-0 sm:text-right">
                      <p className="text-sm font-medium text-gray-950">
                        KSh{' '}
                        {(product.price * product.quantity).toLocaleString()}
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
          </section>

          {/* Delivery */}
          <section className="mt-10">
            <div className="mb-5 flex items-center gap-2">
              <MapPin size={18} strokeWidth={1.6} />

              <h2 className="text-lg font-medium text-gray-950">
                Delivery information
              </h2>
            </div>

            <div className="border border-gray-200 p-5 sm:p-6">
              <p className="text-sm font-medium text-gray-900">
                {order.shippingAddress.firstName}{' '}
                {order.shippingAddress.lastName}
              </p>

              <div className="mt-3 space-y-1 text-sm leading-6 text-gray-500">
                <p>{order.shippingAddress.street}</p>

                {order.shippingAddress.apartment && (
                  <p>{order.shippingAddress.apartment}</p>
                )}

                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.county}
                </p>

                {order.shippingAddress.postalCode && (
                  <p>{order.shippingAddress.postalCode}</p>
                )}

                <p>{order.shippingAddress.country}</p>
              </div>

              <div className="mt-5 border-t border-gray-100 pt-4 text-sm text-gray-500">
                <p>{order.shippingAddress.phone}</p>

                <p className="mt-1">{order.shippingAddress.email}</p>
              </div>
            </div>
          </section>
        </div>

        {/* Right */}
        <aside className="space-y-6">
          {/* Summary */}
          <div className="bg-gray-50 p-6">
            <h2 className="text-lg font-medium text-gray-950">Order summary</h2>

            <div className="mt-6 space-y-4">
              <SummaryRow
                label="Subtotal"
                value={`KSh ${order.subtotal.toLocaleString()}`}
              />

              <SummaryRow
                label="Delivery"
                value={`KSh ${order.deliveryFee.toLocaleString()}`}
              />
            </div>

            <div className="my-6 border-t border-gray-200" />

            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-950">Total</span>

              <span className="text-lg font-semibold text-gray-950">
                KSh {order.total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment */}
          <div className="border border-gray-200 p-6">
            <div className="flex items-center gap-2">
              <CreditCard size={18} strokeWidth={1.6} />

              <h2 className="font-medium text-gray-950">Payment</h2>
            </div>

            <div className="mt-5 space-y-4">
              <SummaryRow
                label="Method"
                value={formatPaymentMethod(order.paymentMethod)}
              />

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Status</span>

                <span className="flex items-center gap-1.5 font-medium text-gray-800">
                  {order.paymentStatus === 'PAID' && (
                    <CheckCircle2 size={14} strokeWidth={1.8} />
                  )}

                  {formatStatus(order.paymentStatus)}
                </span>
              </div>
            </div>
          </div>

          {/* Help */}
          <div className="border border-gray-200 p-6">
            <h2 className="font-medium text-gray-950">Need help?</h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Have a question about this order? Contact our customer support
              team.
            </p>

            <Link
              to="/contact"
              className="mt-4 inline-block border-b border-gray-900 pb-1 text-sm font-medium text-gray-900"
            >
              Contact support
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
};

const OrderTracker = ({ status }) => {
  const steps = [
    {
      value: 'PENDING',
      name: 'Order placed',
      icon: Clock3,
    },
    {
      value: 'PROCESSING',
      name: 'Processing',
      icon: Package,
    },
    {
      value: 'SHIPPED',
      name: 'Shipped',
      icon: Truck,
    },
    {
      value: 'DELIVERED',
      name: 'Delivered',
      icon: CheckCircle2,
    },
  ];

  const currentStep = steps.findIndex((step) => step.value === status);

  return (
    <div className="relative">
      {/* Desktop line */}
      <div className="absolute left-0 right-0 top-5 hidden h-px bg-gray-200 sm:block" />

      <div className="relative grid gap-6 sm:grid-cols-4 sm:gap-0">
        {steps.map((step, index) => {
          const Icon = step.icon;

          const completed = currentStep !== -1 && index <= currentStep;

          return (
            <div
              key={step.value}
              className="flex items-center gap-4 sm:flex-col sm:gap-3 sm:text-center"
            >
              <div
                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                  completed
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 bg-white text-gray-400'
                }`}
              >
                {index < currentStep ? (
                  <Check size={16} />
                ) : (
                  <Icon size={16} strokeWidth={1.7} />
                )}
              </div>

              <div>
                <p
                  className={`text-sm font-medium ${
                    completed ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {step.name}
                </p>

                {index === currentStep && (
                  <p className="mt-1 text-xs text-gray-400">Current status</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const OrderStatus = ({ status }) => {
  const statusConfig = {
    PENDING: Clock3,
    PROCESSING: Package,
    SHIPPED: Truck,
    DELIVERED: CheckCircle2,
    CANCELLED: XCircle,
  };

  const Icon = statusConfig[status] || Package;

  return (
    <div className="flex w-fit items-center gap-2 border border-gray-200 px-3 py-2">
      <Icon size={15} strokeWidth={1.7} />

      <span className="text-xs font-medium text-gray-700">
        {formatStatus(status)}
      </span>
    </div>
  );
};

const SummaryRow = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-gray-500">{label}</span>

      <span className="font-medium text-gray-800">{value}</span>
    </div>
  );
};

const OrderNotFound = () => {
  return (
    <main className="flex min-h-[600px] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <Package size={27} strokeWidth={1.5} className="text-gray-500" />
      </div>

      <h1 className="mt-6 text-xl font-medium text-gray-950">
        Order not found
      </h1>

      <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
        We couldn't find the order you're looking for.
      </p>

      <Link
        to="/orders"
        className="mt-7 inline-flex items-center gap-2 bg-black px-6 py-3.5 text-sm font-medium text-white transition hover:bg-gray-800"
      >
        <ArrowLeft size={16} />
        Back to orders
      </Link>
    </main>
  );
};

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric',
    month: 'long',
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

export default OrderDetails;
