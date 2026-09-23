import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import ProductItem from './ProductItem';
import { products } from '../../data/products';

const RelatedProducts = ({ category, subCategory, currentProductId }) => {
  // Products from the same subcategory
  const sameSubCategory = products.filter(
    (product) =>
      product._id !== currentProductId && product.subCategory === subCategory,
  );

  // Other products from the same category
  const sameCategory = products.filter(
    (product) =>
      product._id !== currentProductId &&
      product.category === category &&
      product.subCategory !== subCategory,
  );

  // Prioritize the closest matches
  const relatedProducts = [...sameSubCategory, ...sameCategory].slice(0, 4);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="mt-20 border-t border-gray-200 pt-16 sm:mt-24 sm:pt-20">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between gap-6 sm:mb-10">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
            You may also like
          </p>

          <h2 className="text-2xl font-medium tracking-tight text-gray-950 sm:text-3xl">
            Related products
          </h2>
        </div>

        <Link
          to="/collection"
          className="group hidden items-center gap-2 text-sm font-medium text-gray-700 transition hover:text-black sm:flex"
        >
          View all
          <ArrowRight
            size={16}
            strokeWidth={1.8}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* Products */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
        {relatedProducts.map((product) => (
          <ProductItem
            key={product._id}
            id={product._id}
            image={product.image}
            name={product.name}
            price={product.price}
            category={product.category}
          />
        ))}
      </div>

      {/* Mobile View All */}
      <div className="mt-10 flex justify-center sm:hidden">
        <Link
          to="/collection"
          className="group inline-flex items-center gap-2 text-sm font-medium text-gray-900"
        >
          View all
          <ArrowRight
            size={16}
            strokeWidth={1.8}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>
    </section>
  );
};

export default RelatedProducts;
