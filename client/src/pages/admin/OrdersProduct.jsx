import { useState } from 'react';
import { Package, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

const staticOrders = [
  {
    _id: '68d10a7b001',
    createdAt: '2026-09-22T06:30:00.000Z',
    status: 'Order Placed',
    paymentMethod: 'M-Pesa',
    payment: true,
    amount: 6300,

    address: {
      firstName: 'James',
      lastName: 'Deng',
      street: 'Kenyatta Avenue',
      city: 'Nakuru',
      state: 'Nakuru',
      country: 'Kenya',
      zipcode: '20100',
      phone: '0712345678',
    },

    items: [
      {
        _id: '1',
        name: 'Essential Cotton T-Shirt',
        price: 1800,
        quantity: 1,
        size: 'L',
      },
      {
        _id: '2',
        name: 'Classic White Sneakers',
        price: 4500,
        quantity: 1,
        size: '42',
      },
    ],
  },

  {
    _id: '68d10a7b002',
    createdAt: '2026-09-21T14:20:00.000Z',
    status: 'Packing',
    paymentMethod: 'M-Pesa',
    payment: true,
    amount: 7100,

    address: {
      firstName: 'Mary',
      lastName: 'Atong',
      street: 'Section 58',
      city: 'Nakuru',
      state: 'Nakuru',
      country: 'Kenya',
      zipcode: '20100',
      phone: '0723456789',
    },

    items: [
      {
        _id: '3',
        name: 'Everyday Hoodie',
        price: 3200,
        quantity: 1,
        size: 'M',
      },
      {
        _id: '5',
        name: 'Classic Denim Jacket',
        price: 3900,
        quantity: 1,
        size: 'M',
      },
    ],
  },

  {
    _id: '68d10a7b003',
    createdAt: '2026-09-20T09:15:00.000Z',
    status: 'Shipped',
    paymentMethod: 'Cash on Delivery',
    payment: false,
    amount: 9000,

    address: {
      firstName: 'Peter',
      lastName: 'Chol',
      street: 'Milimani Estate',
      city: 'Nakuru',
      state: 'Nakuru',
      country: 'Kenya',
      zipcode: '20100',
      phone: '0734567890',
    },

    items: [
      {
        _id: '6',
        name: 'Casual Leather Sneakers',
        price: 4500,
        quantity: 2,
        size: '43',
      },
    ],
  },

  {
    _id: '68d10a7b004',
    createdAt: '2026-09-19T11:45:00.000Z',
    status: 'Out for Delivery',
    paymentMethod: 'M-Pesa',
    payment: true,
    amount: 7300,

    address: {
      firstName: 'Rebecca',
      lastName: 'Ajak',
      street: 'Lanet',
      city: 'Nakuru',
      state: 'Nakuru',
      country: 'Kenya',
      zipcode: '20100',
      phone: '0745678901',
    },

    items: [
      {
        _id: '4',
        name: 'Minimal Backpack',
        price: 3500,
        quantity: 1,
      },
      {
        _id: '7',
        name: 'Classic Sunglasses',
        price: 1800,
        quantity: 1,
      },
      {
        _id: '1',
        name: 'Essential Cotton T-Shirt',
        price: 2000,
        quantity: 1,
        size: 'XL',
      },
    ],
  },

  {
    _id: '68d10a7b005',
    createdAt: '2026-09-18T08:10:00.000Z',
    status: 'Delivered',
    paymentMethod: 'M-Pesa',
    payment: true,
    amount: 5500,

    address: {
      firstName: 'Samuel',
      lastName: 'Majok',
      street: 'Free Area',
      city: 'Nakuru',
      state: 'Nakuru',
      country: 'Kenya',
      zipcode: '20100',
      phone: '0756789012',
    },

    items: [
      {
        _id: '8',
        name: 'Minimal Wrist Watch',
        price: 5500,
        quantity: 1,
      },
    ],
  },
];

const OrdersProduct = () => {
  const [orders, setOrders] = useState(staticOrders);

  const statusHandler = (e, orderId) => {
    const status = e.target.value;

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId
          ? {
              ...order,
              status,
            }
          : order,
      ),
    );

    toast.success(`Order status updated to ${status}.`);
  };

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
            />
          ))}
        </div>
      )}
    </div>
  );
};

const OrderCard = ({ order, onStatusChange }) => {
  const customerName = [order.address?.firstName, order.address?.lastName]
    .filter(Boolean)
    .join(' ');

  const location = [
    order.address?.street,
    order.address?.city,
    order.address?.state,
    order.address?.country,
    order.address?.zipcode,
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

        <select
          value={order.status}
          onChange={(e) => onStatusChange(e, order._id)}
          className="h-10 cursor-pointer border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 outline-none transition focus:border-gray-500"
        >
          <option value="Order Placed">Order Placed</option>

          <option value="Packing">Packing</option>

          <option value="Shipped">Shipped</option>

          <option value="Out for Delivery">Out for Delivery</option>

          <option value="Delivered">Delivered</option>

          <option value="Cancelled">Cancelled</option>
        </select>
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
                key={`${order._id}-${item._id}-${index}`}
                className="flex justify-between gap-4"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {item.name}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Qty {item.quantity}
                    {item.size ? ` · Size ${item.size}` : ''}
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
            {customerName || 'Customer'}
          </p>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {location || 'No address provided'}
          </p>

          {order.address?.phone && (
            <p className="mt-2 text-sm text-gray-500">{order.address.phone}</p>
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
                {order.paymentMethod}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-gray-400">Status</span>

              <span
                className={`font-medium ${
                  order.payment ? 'text-green-600' : 'text-amber-600'
                }`}
              >
                {order.payment ? 'Paid' : 'Pending'}
              </span>
            </div>

            <div className="mt-4 flex justify-between gap-4 border-t border-gray-100 pt-4">
              <span className="font-medium text-gray-900">Total</span>

              <span className="font-semibold text-gray-950">
                KSh {Number(order.amount || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
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

export default OrdersProduct;
