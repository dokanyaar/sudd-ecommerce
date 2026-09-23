import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Banknote,
  Package,
  ShoppingBag,
  Users,
} from 'lucide-react';

const DashboardHome = () => {
  const stats = [
    {
      label: 'Total revenue',
      value: 'KSh 128,400',
      change: 'All time sales',
      icon: Banknote,
    },
    {
      label: 'Orders',
      value: '48',
      change: '12 awaiting fulfilment',
      icon: ShoppingBag,
    },
    {
      label: 'Products',
      value: '36',
      change: '32 currently available',
      icon: Package,
    },
    {
      label: 'Customers',
      value: '124',
      change: 'Registered customers',
      icon: Users,
    },
  ];

  const recentOrders = [
    {
      id: 'ORD-1048',
      customer: 'James Deng',
      amount: 6300,
      status: 'Order Placed',
    },
    {
      id: 'ORD-1047',
      customer: 'Mary Atong',
      amount: 4800,
      status: 'Packing',
    },
    {
      id: 'ORD-1046',
      customer: 'Peter Chol',
      amount: 9200,
      status: 'Shipped',
    },
    {
      id: 'ORD-1045',
      customer: 'Rebecca Ajak',
      amount: 3500,
      status: 'Delivered',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Store overview</p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Monitor your store and manage day-to-day activity.
          </p>
        </div>

        <Link
          to="/dashboard/add"
          className="inline-flex w-fit items-center gap-2 bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Add product
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="border border-gray-200 bg-white p-5"
            >
              <div className="flex items-start justify-between">
                <p className="text-sm text-gray-500">{stat.label}</p>

                <div className="flex h-9 w-9 items-center justify-center bg-gray-100 text-gray-700">
                  <Icon size={17} strokeWidth={1.7} />
                </div>
              </div>

              <p className="mt-5 text-2xl font-semibold tracking-tight text-gray-950">
                {stat.value}
              </p>

              <p className="mt-2 text-xs text-gray-400">{stat.change}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_320px]">
        {/* Recent Orders */}
        <section className="border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-medium text-gray-950">Recent orders</h2>

              <p className="mt-1 text-xs text-gray-400">
                Latest orders placed in your store.
              </p>
            </div>

            <Link
              to="/dashboard/orders"
              className="text-sm font-medium text-gray-600 transition hover:text-black"
            >
              View all
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  <th className="px-6 py-3">Order</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Total</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {order.id}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.customer}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>

                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      KSh {order.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="border border-gray-200 bg-white p-5 sm:p-6">
          <h2 className="font-medium text-gray-950">Quick actions</h2>

          <p className="mt-1 text-xs leading-5 text-gray-400">
            Common store management tasks.
          </p>

          <div className="mt-6 space-y-2">
            <QuickAction
              to="/dashboard/add"
              title="Add new product"
              description="Create a product listing"
            />

            <QuickAction
              to="/dashboard/list"
              title="Manage products"
              description="View and manage inventory"
            />

            <QuickAction
              to="/dashboard/orders"
              title="Manage orders"
              description="Process customer orders"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

const QuickAction = ({ to, title, description }) => {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between border border-gray-200 p-4 transition hover:border-gray-400"
    >
      <div>
        <p className="text-sm font-medium text-gray-900">{title}</p>

        <p className="mt-1 text-xs text-gray-400">{description}</p>
      </div>

      <ArrowRight
        size={16}
        className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-black"
      />
    </Link>
  );
};

const StatusBadge = ({ status }) => {
  return (
    <span className="inline-flex bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
      {status}
    </span>
  );
};

export default DashboardHome;
