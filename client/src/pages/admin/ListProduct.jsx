import { useEffect, useMemo, useState } from 'react';
import { Package, Plus, Search, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  deleteProductByAdmin,
  getProductsByAdmin,
} from '../../services/product.service';

const ListProduct = () => {
  const [list, setList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const getProducts = async () => {
    setLoading(true);

    try {
      const data = await getProductsByAdmin();

      if (data.success) {
        setList(data.products || []);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this product?',
    );

    if (!confirmed) return;

    try {
      const data = await deleteProductByAdmin(id);

      if (data.success) {
        setList((prev) => prev.filter((product) => product._id !== id));

        toast.success(data.message);
      }
    } catch (error) {
      console.error('Failed to delete product:', error);

      toast.error(error.response?.data?.message || 'Failed to delete product.');
    }
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

  useEffect(() => {
    getProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

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
            <table className="w-full min-w-190 text-left">
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
                          {product.images?.[0]?.url ? (
                            <img
                              src={product.images[0].url}
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
