import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

const NewsLetter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const onSubmitHandler = (e) => {
    e.preventDefault();

    // Temporary frontend behavior.
    // Connect this to the backend later.
    setSubscribed(true);
    setEmail('');
  };

  return (
    <section className="border-y border-gray-200 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
          Stay in the loop
        </p>

        <h2 className="text-3xl font-medium tracking-tight text-gray-950 sm:text-4xl">
          New styles, straight to your inbox.
        </h2>

        <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-gray-500 sm:text-base">
          Be the first to discover new arrivals, special offers and updates from
          Sudd Shop.
        </p>

        {subscribed ? (
          <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-2 border border-gray-200 px-5 py-4 text-sm text-gray-700">
            <Check size={17} strokeWidth={1.7} />
            Thanks for subscribing.
          </div>
        ) : (
          <form
            onSubmit={onSubmitHandler}
            className="mx-auto mt-8 flex w-full max-w-lg flex-col gap-3 sm:flex-row sm:gap-0"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>

            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              autoComplete="email"
              required
              className="h-12 min-w-0 flex-1 border border-gray-300 bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black"
            />

            <button
              type="submit"
              className="group flex h-12 cursor-pointer items-center justify-center gap-2 bg-black px-6 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Subscribe
              <ArrowRight
                size={16}
                strokeWidth={1.7}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </form>
        )}

        <p className="mt-4 text-xs leading-5 text-gray-400">
          By subscribing, you agree to receive marketing emails from Sudd Shop.
          You can unsubscribe at any time.
        </p>
      </div>
    </section>
  );
};

export default NewsLetter;
