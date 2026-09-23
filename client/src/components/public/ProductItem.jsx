import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const ProductItem = ({ product }) => {
  const { slug, images, name, price, category } = product;

  const productImage = images?.[0]?.url;

  return (
    <Link to={`/product/${slug}`} className="group block">
      {/* Product Image */}
      <div className="relative aspect-4/5 overflow-hidden bg-gray-100">
        <img
          src={productImage}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />

        {/* Wishlist */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
          }}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 opacity-0 shadow-sm backdrop-blur-sm transition-all duration-300 hover:text-black group-hover:opacity-100"
          aria-label={`Add ${name} to wishlist`}
        >
          <Heart size={17} strokeWidth={1.7} />
        </button>
      </div>

      {/* Product Info */}
      <div className="pt-3">
        {category && <p className="mb-1 text-xs text-gray-400">{category}</p>}

        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-medium leading-5 text-gray-800 transition-colors group-hover:text-black">
            {name}
          </h3>

          <p className="shrink-0 text-sm font-medium text-gray-950">
            KSh {price?.toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
