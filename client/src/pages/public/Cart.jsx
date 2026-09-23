import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';

import useCart from '../../hooks/useCart';

const Cart = () => {
  const { cartItems, cartCount, cartTotal, removeFromCart, updateQuantity } =
    useCart();

  const navigate = useNavigate();

  return (
    <main className="py-10 sm:py-14">
      {/* Header */}
      <div className="mb-10 border-b border-gray-200 pb-8">
        <h1 className="text-3xl font-medium tracking-tight text-gray-950 sm:text-4xl">
          Your cart
        </h1>

        <p className="mt-3 text-sm text-gray-500">
          {cartItems.length === 0
            ? 'Your cart is currently empty.'
            : `${cartCount} ${cartCount === 1 ? 'item' : 'items'} in your cart`}
        </p>
      </div>

      {cartItems.length > 0 ? (
        <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
          {/* Cart Items */}
          <div>
            {cartItems.map((product) => (
              <div
                key={`${product.productId}-${product.size}-${product.color}`}
                className="flex gap-4 border-b border-gray-200 py-6 first:pt-0 sm:gap-6"
              >
                {/* Image */}
                <Link
                  to={`/product/${product.slug}`}
                  className="h-32 w-24 shrink-0 overflow-hidden bg-gray-100 sm:h-40 sm:w-32"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </Link>

                {/* Product Details */}
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link
                        to={`/product/${product.slug}`}
                        className="text-sm font-medium text-gray-900 transition hover:text-gray-600 sm:text-base"
                      >
                        {product.name}
                      </Link>

                      {/* Variant */}
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                        {product.size && (
                          <p>
                            Size:{' '}
                            <span className="font-medium text-gray-700">
                              {product.size}
                            </span>
                          </p>
                        )}

                        {product.color && (
                          <p>
                            Color:{' '}
                            <span className="font-medium text-gray-700">
                              {product.color}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() =>
                        removeFromCart(
                          product.productId,
                          product.size,
                          product.color,
                        )
                      }
                      className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-red-500"
                      aria-label={`Remove ${product.name}`}
                    >
                      <Trash2 size={17} strokeWidth={1.7} />
                    </button>
                  </div>

                  {/* Bottom */}
                  <div className="mt-5 flex items-end justify-between gap-4">
                    {/* Quantity */}
                    <div className="flex h-10 items-center border border-gray-200">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            product.productId,
                            product.size,
                            product.color,
                            product.quantity - 1,
                          )
                        }
                        disabled={product.quantity <= 1}
                        className="flex h-full w-9 cursor-pointer items-center justify-center text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>

                      <span className="flex w-9 items-center justify-center text-sm font-medium text-gray-900">
                        {product.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            product.productId,
                            product.size,
                            product.color,
                            product.quantity + 1,
                          )
                        }
                        className="flex h-full w-9 cursor-pointer items-center justify-center text-gray-600 transition hover:bg-gray-50"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      {product.quantity > 1 && (
                        <p className="mb-1 text-xs text-gray-400">
                          KSh {product.price.toLocaleString()} each
                        </p>
                      )}

                      <p className="text-sm font-medium text-gray-950 sm:text-base">
                        KSh{' '}
                        {(product.price * product.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <Link
              to="/collection"
              className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-gray-700 transition hover:text-black"
            >
              Continue shopping
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Order Summary */}
          <aside>
            <div className="bg-gray-50 p-6 sm:p-7">
              <h2 className="text-lg font-medium text-gray-950">
                Order summary
              </h2>

              <div className="mt-6 space-y-4">
                {/* Subtotal */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>

                  <span className="font-medium text-gray-900">
                    KSh {cartTotal.toLocaleString()}
                  </span>
                </div>

                {/* Delivery */}
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-gray-500">Delivery</span>

                  <span className="text-right text-gray-500">
                    Calculated at checkout
                  </span>
                </div>
              </div>

              <div className="my-6 border-t border-gray-200" />

              {/* Total */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-950">Total</span>

                  <p className="mt-1 text-xs text-gray-400">
                    Excluding delivery
                  </p>
                </div>

                <span className="text-lg font-semibold text-gray-950">
                  KSh {cartTotal.toLocaleString()}
                </span>
              </div>

              <button
                type="button"
                onClick={() => navigate('/place-order')}
                className="group mt-7 flex w-full cursor-pointer items-center justify-center gap-3 bg-black px-5 py-3.5 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Checkout
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShoppingBag size={14} />
                Secure checkout
              </div>
            </div>
          </aside>
        </div>
      ) : (
        /* Empty Cart */
        <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <ShoppingBag
              size={26}
              strokeWidth={1.5}
              className="text-gray-500"
            />
          </div>

          <h2 className="mt-6 text-xl font-medium text-gray-950">
            Your cart is empty
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
            Looks like you haven't added anything to your cart yet. Explore the
            shop and find something you like.
          </p>

          <Link
            to="/collection"
            className="mt-7 inline-flex items-center gap-3 bg-black px-6 py-3.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Start shopping
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </main>
  );
};

export default Cart;
