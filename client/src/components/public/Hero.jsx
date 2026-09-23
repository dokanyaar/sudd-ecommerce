import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const heroImage =
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=90';

  return (
    <section className="overflow-hidden bg-[#f5f5f3]">
      <div className="grid min-h-140 md:grid-cols-2 lg:min-h-162.5">
        {/* Content */}
        <div className="flex items-center px-6 py-16 sm:px-10 md:px-12 lg:px-16">
          <div className="max-w-lg">
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
              New Arrivals
            </p>

            <h1 className="text-4xl font-medium leading-[1.1] tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
              Find your
              <br />
              everyday style.
            </h1>

            <p className="mt-6 max-w-md text-sm leading-7 text-gray-600 sm:text-base">
              Shop clothing, footwear and accessories selected for comfort,
              quality and everyday wear.
            </p>

            <Link
              to="/collection"
              className="group mt-8 inline-flex items-center gap-3 bg-black px-6 py-3.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Shop collection
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="relative min-h-105 md:min-h-full">
          <img
            src={heroImage}
            alt="Sudd Shop collection"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
