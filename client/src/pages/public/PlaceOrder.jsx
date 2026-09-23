import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Banknote,
  Check,
  LockKeyhole,
  Smartphone,
} from 'lucide-react';
import toast from 'react-hot-toast';

import useCart from '../../hooks/useCart';
import { createOrder } from '../../services/order.service';

const PlaceOrder = () => {
  const navigate = useNavigate();

  const { cartItems, cartCount, cartTotal, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    apartment: '',
    city: '',
    county: '',
    postalCode: '',
    country: 'Kenya',
  });

  const deliveryFee = 300;

  const total = cartTotal + deliveryFee;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error('Your cart is empty.');
      navigate('/cart');
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.productId,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
        })),

        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          street: formData.street,
          apartment: formData.apartment,
          city: formData.city,
          county: formData.county,
          postalCode: formData.postalCode,
          country: formData.country,
        },

        paymentMethod: paymentMethod.toUpperCase(),
      };

      const data = await createOrder(orderData);

      if (data.success) {
        clearCart();

        toast.success(data.message);

        navigate(`/orders/${data.order._id}`);
      }
    } catch (error) {
      console.error('Failed to create order:', error);

      toast.error(error.response?.data?.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <main className="flex min-h-[500px] flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-medium text-gray-950">
          Your cart is empty
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Add some products before proceeding to checkout.
        </p>

        <button
          type="button"
          onClick={() => navigate('/collection')}
          className="mt-6 bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Continue shopping
        </button>
      </main>
    );
  }

  return (
    <main className="py-10 sm:py-14">
      {/* Header */}
      <div className="mb-10 border-b border-gray-200 pb-8">
        <h1 className="text-3xl font-medium tracking-tight text-gray-950 sm:text-4xl">
          Complete your order
        </h1>

        <p className="mt-3 max-w-lg text-sm leading-6 text-gray-500">
          Enter your delivery information and choose how you would like to pay.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid items-start gap-12 lg:grid-cols-[1fr_400px] lg:gap-16"
      >
        {/* Left Side */}
        <div>
          {/* Contact */}
          <section>
            <div className="mb-6">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                01
              </p>

              <h2 className="mt-2 text-xl font-medium text-gray-950">
                Contact information
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="First name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                autoComplete="given-name"
                required
              />

              <Input
                label="Last name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Agata"
                autoComplete="family-name"
                required
              />

              <Input
                label="Email address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                autoComplete="email"
                required
              />

              <Input
                label="Phone number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="07XX XXX XXX"
                autoComplete="tel"
                required
              />
            </div>
          </section>

          {/* Delivery */}
          <section className="mt-12 border-t border-gray-200 pt-10">
            <div className="mb-6">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                02
              </p>

              <h2 className="mt-2 text-xl font-medium text-gray-950">
                Delivery address
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input
                  label="Street address"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="Street and house number"
                  autoComplete="street-address"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <Input
                  label="Apartment, building or landmark"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </div>

              <Input
                label="Town / City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Nairobi"
                autoComplete="address-level2"
                required
              />

              <Input
                label="County"
                name="county"
                value={formData.county}
                onChange={handleChange}
                placeholder="Nairobi"
                autoComplete="address-level1"
                required
              />

              <Input
                label="Postal code"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="00100"
                autoComplete="postal-code"
              />

              <Input
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                autoComplete="country-name"
                required
              />
            </div>
          </section>

          {/* Payment */}
          <section className="mt-12 border-t border-gray-200 pt-10">
            <div className="mb-6">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                03
              </p>

              <h2 className="mt-2 text-xl font-medium text-gray-950">
                Payment method
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Select how you would like to pay for your order.
              </p>
            </div>

            <div className="space-y-3">
              <PaymentOption
                active={paymentMethod === 'mpesa'}
                onClick={() => setPaymentMethod('mpesa')}
                icon={<Smartphone size={20} strokeWidth={1.6} />}
                title="M-Pesa"
                description="Pay securely using your M-Pesa mobile number."
              />

              <PaymentOption
                active={paymentMethod === 'cod'}
                onClick={() => setPaymentMethod('cod')}
                icon={<Banknote size={20} strokeWidth={1.6} />}
                title="Cash on delivery"
                description="Pay when your order is delivered."
              />
            </div>

            {paymentMethod === 'mpesa' && (
              <div className="mt-4 bg-gray-50 p-4">
                <p className="text-sm leading-6 text-gray-500">
                  After placing your order, an M-Pesa payment request will be
                  sent to your phone.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Order Summary */}
        <aside className="lg:sticky lg:top-24">
          <div className="bg-gray-50 p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-950">
                Order summary
              </h2>

              <span className="text-xs text-gray-400">
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </span>
            </div>

            {/* Products */}
            <div className="mt-6 space-y-5">
              {cartItems.map((product) => (
                <div
                  key={`${product.productId}-${product.size}-${product.color}`}
                  className="flex gap-4"
                >
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-gray-200">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />

                    <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[10px] text-white">
                      {product.quantity}
                    </span>
                  </div>

                  <div className="flex min-w-0 flex-1 justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {product.name}
                      </p>

                      <div className="mt-1 space-y-1 text-xs text-gray-400">
                        {product.size && <p>Size: {product.size}</p>}

                        {product.color && <p>Color: {product.color}</p>}
                      </div>
                    </div>

                    <p className="shrink-0 text-sm font-medium text-gray-800">
                      KSh {(product.price * product.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-7 border-t border-gray-200 pt-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>

                <span className="font-medium text-gray-800">
                  KSh {cartTotal.toLocaleString()}
                </span>
              </div>

              <div className="mt-4 flex justify-between text-sm">
                <span className="text-gray-500">Delivery</span>

                <span className="font-medium text-gray-800">
                  KSh {deliveryFee.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="my-6 border-t border-gray-200" />

            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-950">Total</span>

              <span className="text-xl font-semibold text-gray-950">
                KSh {total.toLocaleString()}
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group mt-7 flex w-full cursor-pointer items-center justify-center gap-3 bg-black px-6 py-4 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? 'Processing...'
                : paymentMethod === 'mpesa'
                  ? 'Pay with M-Pesa'
                  : 'Place order'}

              {!loading && (
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              )}
            </button>

            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
              <LockKeyhole size={13} />
              Secure checkout
            </div>
          </div>
        </aside>
      </form>
    </main>
  );
};

const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete,
}) => {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-gray-600">
        {label}

        {required && <span className="ml-1 text-gray-400">*</span>}
      </span>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className="h-12 w-full border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-300 focus:border-gray-500"
      />
    </label>
  );
};

const PaymentOption = ({ active, onClick, icon, title, description }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full cursor-pointer items-center gap-4 border p-4 text-left transition ${
        active ? 'border-black' : 'border-gray-200 hover:border-gray-400'
      }`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-gray-50 text-gray-700">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900">{title}</p>

        <p className="mt-1 text-xs leading-5 text-gray-400">{description}</p>
      </div>

      <div
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
          active ? 'border-black bg-black text-white' : 'border-gray-300'
        }`}
      >
        {active && <Check size={12} strokeWidth={2} />}
      </div>
    </button>
  );
};

export default PlaceOrder;
