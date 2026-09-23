import { useMemo, useState } from 'react';
import { Package, Plus, Search, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const staticProducts = [
  {
    _id: '1',
    name: 'Essential Cotton T-Shirt',
    category: 'Men',
    subCategory: 'T-Shirts',
    price: 1800,
    bestseller: true,
    image: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80',
    ],
  },
  {
    _id: '2',
    name: 'Classic White Sneakers',
    category: 'Shoes',
    subCategory: 'Sneakers',
    price: 4200,
    bestseller: true,
    image: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80',
    ],
  },
  {
    _id: '3',
    name: 'Everyday Hoodie',
    category: 'Men',
    subCategory: 'Hoodies',
    price: 3200,
    bestseller: false,
    image: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=500&q=80',
    ],
  },
  {
    _id: '4',
    name: 'Minimal Backpack',
    category: 'Accessories',
    subCategory: 'Bags',
    price: 3500,
    bestseller: true,
    image: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80',
    ],
  },
  {
    _id: '5',
    name: 'Classic Denim Jacket',
    category: 'Women',
    subCategory: 'Jackets',
    price: 3900,
    bestseller: false,
    image: [
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=500&q=80',
    ],
  },
  {
    _id: '6',
    name: 'Casual Leather Sneakers',
    category: 'Shoes',
    subCategory: 'Sneakers',
    price: 4500,
    bestseller: false,
    image: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=500&q=80',
    ],
  },
  {
    _id: '7',
    name: 'Classic Sunglasses',
    category: 'Accessories',
    subCategory: 'Sunglasses',
    price: 1800,
    bestseller: true,
    image: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=500&q=80',
    ],
  },
  {
    _id: '8',
    name: 'Minimal Wrist Watch',
    category: 'Accessories',
    subCategory: 'Watches',
    price: 5500,
    bestseller: true,
    image: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=500&q=80',
    ],
  },
  {
    _id: '9',
    name: 'Relaxed Summer Shirt',
    category: 'Men',
    subCategory: 'Shirts',
    price: 2600,
    bestseller: false,
    image: [
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=500&q=80',
    ],
  },
  {
    _id: '10',
    name: 'Everyday Tote Bag',
    category: 'Accessories',
    subCategory: 'Bags',
    price: 2200,
    bestseller: false,
    image: [
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=500&q=80',
    ],
  },
];

const ListProduct = () => {
  const [list, setList] = useState(staticProducts);
  const [searchQuery, setSearchQuery] = useState('');

  const removeProduct = (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this product?',
    );

    if (!confirmed) return;

    setList((prev) => prev.filter((product) => product._id !== id));

    toast.success('Product removed successfully.');
  };

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return list;

    return list.filter((product) =>
      [product.name, product.category, product.subCategory]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query),
    );
  }, [list, searchQuery]);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Products</p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
            All products
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage products available in your store.
          </p>
        </div>

        <Link
          to="/dashboard/add"
          className="flex w-fit items-center gap-2 bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          <Plus size={17} />
          Add product
        </Link>
      </div>

      {/* Search */}
      <div className="mt-8 border border-gray-200 bg-white p-4">
        <div className="relative max-w-md">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="h-11 w-full border border-gray-200 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-gray-500"
          />
        </div>
      </div>

      {/* Products */}
      <div className="mt-4 overflow-hidden border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-6">
          <p className="text-sm font-medium text-gray-900">Products</p>

          <p className="text-xs text-gray-400">
            {filteredProducts.length}{' '}
            {filteredProducts.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <EmptyState searching={Boolean(searchQuery.trim())} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  <th className="px-6 py-3">Product</th>

                  <th className="px-6 py-3">Category</th>

                  <th className="px-6 py-3">Type</th>

                  <th className="px-6 py-3">Price</th>

                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    {/* Product */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-12 shrink-0 overflow-hidden bg-gray-100">
                          {product.image?.[0] ? (
                            <img
                              src={product.image[0]}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Package size={18} className="text-gray-300" />
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="max-w-60 truncate text-sm font-medium text-gray-900">
                            {product.name}
                          </p>

                          {product.bestseller && (
                            <p className="mt-1 text-xs text-gray-400">
                              Bestseller
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.category}
                    </td>

                    {/* Type */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.subCategory || '—'}
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      KSh {Number(product.price).toLocaleString()}
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => removeProduct(product._id)}
                        className="inline-flex h-9 w-9 cursor-pointer items-center justify-center text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                        aria-label={`Delete ${product.name}`}
                      >
                        <Trash2 size={17} strokeWidth={1.7} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ searching }) => {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center px-5 text-center">
      <div className="flex h-11 w-11 items-center justify-center bg-gray-100">
        <Package size={20} className="text-gray-500" />
      </div>

      <h3 className="mt-4 text-sm font-medium text-gray-900">
        {searching ? 'No matching products' : 'No products yet'}
      </h3>

      <p className="mt-2 max-w-xs text-sm leading-6 text-gray-400">
        {searching
          ? 'Try another product name, category or product type.'
          : 'Add your first product to start building your catalogue.'}
      </p>
    </div>
  );
};

export default ListProduct;
