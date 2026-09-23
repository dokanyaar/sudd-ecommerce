import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { products } from '../../data/products';

const Wishlist = () => {
  // Temporary frontend data.
  // Later this will come from WishlistContext/backend.
  const [wishlistItems, setWishlistItems] = useState([
    products[0],
    products[4],
    products[6],
    products[7],
  ]);

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) =>
      prev.filter((product) => product._id !== productId),
    );
  };

  const handleAddToCart = (product) => {
    // Later:
    // addToCart(product._id, selectedSize)

    console.log('Add to cart:', product);
  };

  if (wishlistItems.length === 0) {
    return <EmptyWishlist />;
  }

  return (
    <main className="py-10 sm:py-14">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-5 border-b border-gray-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
            Saved items
          </p>

          <h1 className="text-3xl font-medium tracking-tight text-gray-950 sm:text-4xl">
            My wishlist
          </h1>

          <p className="mt-3 max-w-lg text-sm leading-6 text-gray-500">
            Keep track of the products you love and come back to them whenever
            you're ready.
          </p>
        </div>

        <p className="text-sm text-gray-500">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      {/* Products */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
        {wishlistItems.map((product) => (
          <WishlistItem
            key={product._id}
            product={product}
            onRemove={removeFromWishlist}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </main>
  );
};

const WishlistItem = ({ product, onRemove, onAddToCart }) => {
  const hasSizes = product.sizes?.length > 0;

  return (
    <article className="group">
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <Link to={`/product/${product._id}`}>
          <img
            src={product.image?.[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </Link>

        {/* Remove */}
        <button
          type="button"
          onClick={() => onRemove(product._id)}
          className="absolute right-3 top-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/95 text-gray-600 shadow-sm backdrop-blur-sm transition hover:bg-white hover:text-black"
          aria-label={`Remove ${product.name} from wishlist`}
        >
          <Trash2 size={16} strokeWidth={1.7} />
        </button>

        {/* Stock */}
        {!product.inStock && (
          <div className="absolute inset-x-0 bottom-0 bg-white/95 px-4 py-3 text-center text-xs font-medium text-gray-600 backdrop-blur-sm">
            Out of stock
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="pt-3">
        <p className="mb-1 text-xs text-gray-400">{product.category}</p>

        <div className="flex items-start justify-between gap-3">
          <Link
            to={`/product/${product._id}`}
            className="text-sm font-medium leading-5 text-gray-800 transition hover:text-black"
          >
            {product.name}
          </Link>

          <p className="shrink-0 text-sm font-medium text-gray-950">
            KSh {product.price.toLocaleString()}
          </p>
        </div>

        {/* Action */}
        <button
          type="button"
          disabled={!product.inStock}
          onClick={() => {
            if (hasSizes) {
              // User needs to select a size first.
              // Send them to the product page for now.
              return;
            }

            onAddToCart(product);
          }}
          className="mt-4 flex h-10 w-full cursor-pointer items-center justify-center gap-2 border border-gray-200 text-xs font-medium text-gray-800 transition hover:border-black hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
        >
          <ShoppingBag size={15} strokeWidth={1.7} />

          {product.inStock
            ? hasSizes
              ? 'Choose options'
              : 'Add to cart'
            : 'Out of stock'}
        </button>

        {/* Products with size options */}
        {product.inStock && hasSizes && (
          <Link
            to={`/product/${product._id}`}
            className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-400 transition hover:text-black"
          >
            Select size
            <ArrowRight size={12} />
          </Link>
        )}
      </div>
    </article>
  );
};

const EmptyWishlist = () => {
  return (
    <main className="flex min-h-[600px] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <Heart size={27} strokeWidth={1.5} className="text-gray-500" />
      </div>

      <h1 className="mt-6 text-xl font-medium text-gray-950">
        Your wishlist is empty
      </h1>

      <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
        Save the products you love and they'll appear here for you to find
        later.
      </p>

      <Link
        to="/collection"
        className="group mt-7 inline-flex items-center gap-3 bg-black px-6 py-3.5 text-sm font-medium text-white transition hover:bg-gray-800"
      >
        Explore products
        <ArrowRight
          size={16}
          className="transition-transform group-hover:translate-x-1"
        />
      </Link>
    </main>
  );
};

export default Wishlist;
