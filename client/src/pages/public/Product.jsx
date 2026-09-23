import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Heart,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from 'lucide-react';
import toast from 'react-hot-toast';

import RelatedProducts from '../../components/public/RelatedProducts';
import { getProductBySlug } from '../../services/product.service';
import useCart from '../../hooks/useCart';

const Product = () => {
  const { addToCart } = useCart();

  const { slug } = useParams();

  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  const fetchProduct = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getProductBySlug(slug);

      if (data.success) {
        setProductData(data.product);
        setSelectedImage(data.product.images?.[0]?.url || '');
        setSelectedSize('');
        setSelectedColor('');
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);

      setProductData(null);
      setError(error.response?.data?.message || 'Failed to fetch product.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  // handle add to cart
  const handleAddToCart = () => {
    if (productData.sizes?.length > 0 && !selectedSize) {
      toast.error('Please select a size.');
      return;
    }

    if (productData.colors?.length > 0 && !selectedColor) {
      toast.error('Please select a color.');
      return;
    }

    addToCart({
      productId: productData._id,
      name: productData.name,
      slug: productData.slug,
      image: productData.images?.[0]?.url,
      price: productData.price,
      size: selectedSize || null,
      color: selectedColor || null,
    });

    toast.success(`${productData.name} added to cart.`);
  };

  if (loading) {
    return (
      <main className="flex min-h-125 items-center justify-center">
        <p className="text-sm text-gray-500">Loading product...</p>
      </main>
    );
  }

  if (!productData) {
    return (
      <main className="flex min-h-125 flex-col items-center justify-center py-20 text-center">
        <ShoppingBag size={32} strokeWidth={1.4} className="text-gray-400" />

        <h1 className="mt-5 text-xl font-medium text-gray-950">
          Product not found
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          {error || 'This product may no longer be available.'}
        </p>

        <Link
          to="/collection"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to shop
        </Link>
      </main>
    );
  }

  return (
    <main className="py-8 sm:py-10">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 overflow-hidden text-xs text-gray-400">
        <Link to="/" className="shrink-0 transition hover:text-black">
          Home
        </Link>

        <ChevronRight size={13} />

        <Link to="/collection" className="shrink-0 transition hover:text-black">
          Shop
        </Link>

        <ChevronRight size={13} />

        <span className="truncate text-gray-600">{productData.name}</span>
      </nav>

      {/* Product */}
      <section className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          {/* Thumbnails */}
          {productData.images?.length > 1 && (
            <div className="flex w-full justify-between gap-2 overflow-x-auto sm:w-[18.7%] sm:flex-col sm:justify-start sm:overflow-y-auto">
              {productData.images.map((image, index) => (
                <button
                  type="button"
                  key={image.fileId}
                  onClick={() => setSelectedImage(image.url)}
                  className={`w-[24%] shrink-0 cursor-pointer overflow-hidden border transition sm:w-full ${
                    selectedImage === image.url
                      ? 'border-black'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                  aria-label={`View ${productData.name} image ${index + 1}`}
                >
                  <img
                    src={image.url}
                    alt={`${productData.name} view ${index + 1}`}
                    className="h-auto w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Image */}
          <div
            className={`relative ${
              productData.images?.length > 1 ? 'w-full sm:w-[80%]' : 'w-full'
            }`}
          >
            <img
              src={selectedImage || productData.images?.[0]?.url}
              alt={productData.name}
              className="h-auto w-full object-cover"
            />

            {/* Wishlist */}
            <button
              type="button"
              className="absolute right-4 top-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm backdrop-blur transition hover:bg-white hover:text-black"
              aria-label="Add to wishlist"
            >
              <Heart size={18} strokeWidth={1.7} />
            </button>
          </div>
        </div>

        {/* Product Information */}
        <div className="lg:py-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
            {productData.category}
          </p>

          <h1 className="mt-3 text-3xl font-medium tracking-tight text-gray-950 sm:text-4xl">
            {productData.name}
          </h1>

          {/* Rating */}
          <div className="mt-4 flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={14}
                  fill={star <= 4 ? 'currentColor' : 'none'}
                  strokeWidth={1.5}
                  className={star <= 4 ? 'text-gray-900' : 'text-gray-300'}
                />
              ))}
            </div>

            <span className="text-xs text-gray-400">4.0 · 122 reviews</span>
          </div>

          {/* Price */}
          <p className="mt-7 text-2xl font-medium text-gray-950">
            KSh {productData.price.toLocaleString()}
          </p>

          {/* Description */}
          <p className="mt-5 max-w-lg text-sm leading-7 text-gray-500">
            {productData.description}
          </p>

          {/* Availability */}
          {productData.inStock && (
            <div className="mt-5 flex items-center gap-2 text-xs font-medium text-gray-600">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100">
                <Check size={12} />
              </span>
              In stock
            </div>
          )}

          {/* Size */}
          {productData.sizes?.length > 0 && (
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Select size</p>

                <button
                  type="button"
                  className="cursor-pointer text-xs text-gray-500 underline underline-offset-4 transition hover:text-black"
                >
                  Size guide
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {productData.sizes.map((size) => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-12 cursor-pointer border px-4 py-2.5 text-sm transition ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {productData.colors?.length > 0 && (
            <div className="mt-7">
              <p className="mb-3 text-sm font-medium text-gray-900">
                Color
                {selectedColor && (
                  <span className="ml-2 font-normal text-gray-400">
                    {selectedColor}
                  </span>
                )}
              </p>

              <div className="flex flex-wrap gap-2">
                {productData.colors.map((color) => (
                  <button
                    type="button"
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`cursor-pointer border px-4 py-2 text-sm transition ${
                      selectedColor === color
                        ? 'border-black text-black'
                        : 'border-gray-200 text-gray-500 hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!productData.inStock}
            className="mt-8 flex w-full cursor-pointer items-center justify-center gap-2 bg-black px-6 py-4 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300 sm:max-w-lg"
          >
            <ShoppingBag size={18} strokeWidth={1.7} />
            {productData.inStock ? 'Add to cart' : 'Out of stock'}
          </button>

          {/* Benefits */}
          <div className="mt-8 max-w-lg divide-y divide-gray-100 border-y border-gray-100">
            <div className="flex items-center gap-4 py-4">
              <Truck
                size={19}
                strokeWidth={1.5}
                className="shrink-0 text-gray-600"
              />

              <div>
                <p className="text-sm font-medium text-gray-800">
                  Fast delivery
                </p>

                <p className="mt-0.5 text-xs text-gray-400">
                  Delivery options shown at checkout.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-4">
              <RotateCcw
                size={19}
                strokeWidth={1.5}
                className="shrink-0 text-gray-600"
              />

              <div>
                <p className="text-sm font-medium text-gray-800">
                  Easy returns
                </p>

                <p className="mt-0.5 text-xs text-gray-400">
                  Returns accepted within 7 days.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-4">
              <ShieldCheck
                size={19}
                strokeWidth={1.5}
                className="shrink-0 text-gray-600"
              />

              <div>
                <p className="text-sm font-medium text-gray-800">
                  Secure shopping
                </p>

                <p className="mt-0.5 text-xs text-gray-400">
                  Your payment information stays protected.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="mt-20 border-t border-gray-200 pt-10 sm:mt-24">
        <div className="grid gap-8 md:grid-cols-[220px_1fr] md:gap-16">
          <h2 className="text-lg font-medium text-gray-950">Product details</h2>

          <div className="max-w-2xl">
            <p className="text-sm leading-7 text-gray-500">
              {productData.description}
            </p>

            <div className="mt-7 grid gap-4 border-t border-gray-100 pt-6 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-400">Category</p>

                <p className="mt-1 font-medium text-gray-800">
                  {productData.category}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Product type</p>

                <p className="mt-1 font-medium text-gray-800">
                  {productData.subCategory}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <RelatedProducts product={productData} />
    </main>
  );
};

export default Product;
