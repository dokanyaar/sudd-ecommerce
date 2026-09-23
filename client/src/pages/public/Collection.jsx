import { useMemo, useState } from 'react';
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';

import ProductItem from '../../components/public/ProductItem';
import { products } from '../../data/products';

const Collection = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [sortType, setSortType] = useState('relevant');

  const categoryOptions = ['Men', 'Women', 'Shoes', 'Accessories'];

  const subCategoryOptions = [
    'T-Shirts',
    'Shirts',
    'Hoodies',
    'Jackets',
    'Dresses',
    'Sneakers',
    'Running Shoes',
    'Bags',
    'Watches',
    'Sunglasses',
  ];

  const toggleCategory = (value) => {
    setCategories((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const toggleSubCategory = (value) => {
    setSubCategories((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const clearFilters = () => {
    setCategories([]);
    setSubCategories([]);
  };

  const clearAll = () => {
    setSearchQuery('');
    setCategories([]);
    setSubCategories([]);
    setSortType('relevant');
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    const normalizedSearch = searchQuery.trim().toLowerCase();

    // Search
    if (normalizedSearch) {
      result = result.filter((product) => {
        const searchableText = [
          product.name,
          product.description,
          product.category,
          product.subCategory,
          ...(product.colors || []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return searchableText.includes(normalizedSearch);
      });
    }

    // Category filter
    if (categories.length > 0) {
      result = result.filter((product) =>
        categories.includes(product.category),
      );
    }

    // Product type filter
    if (subCategories.length > 0) {
      result = result.filter((product) =>
        subCategories.includes(product.subCategory),
      );
    }

    // Sort
    if (sortType === 'low-high') {
      result.sort((a, b) => a.price - b.price);
    }

    if (sortType === 'high-low') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [searchQuery, categories, subCategories, sortType]);

  const activeFilterCount = categories.length + subCategories.length;

  const hasActiveFilters = activeFilterCount > 0 || searchQuery.trim();

  return (
    <main className="py-10 sm:py-14">
      {/* Page Header */}
      <div className="mb-10 border-b border-gray-200 pb-8 sm:mb-12">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
          Sudd Shop
        </p>

        <h1 className="text-3xl font-medium tracking-tight text-gray-950 sm:text-4xl">
          Shop
        </h1>

        <p className="mt-3 max-w-lg text-sm leading-6 text-gray-500">
          Explore clothing, footwear and everyday accessories selected for
          simple, effortless style.
        </p>

        {/* Search */}
        <div className="relative mt-7 w-full max-w-2xl">
          <Search
            size={19}
            strokeWidth={1.7}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="h-12 w-full border border-gray-200 bg-white pl-12 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500"
            aria-label="Search products"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center text-gray-400 transition hover:text-black"
              aria-label="Clear search"
            >
              <X size={17} strokeWidth={1.7} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Filter + Sort */}
      <div className="mb-8 flex items-center justify-between gap-3 lg:hidden">
        <button
          type="button"
          onClick={() => setShowFilters(true)}
          className="flex h-11 items-center gap-2 border border-gray-200 px-4 text-sm font-medium text-gray-800 transition hover:border-gray-400"
        >
          <SlidersHorizontal size={17} strokeWidth={1.8} />
          Filters
          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1.5 text-[10px] text-white">
              {activeFilterCount}
            </span>
          )}
        </button>

        <div className="relative">
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="h-11 appearance-none border border-gray-200 bg-white pl-4 pr-9 text-sm text-gray-700 outline-none transition focus:border-gray-400"
          >
            <option value="relevant">Featured</option>
            <option value="low-high">Price: Low to high</option>
            <option value="high-low">Price: High to low</option>
          </select>

          <ChevronDown
            size={15}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
        </div>
      </div>

      <div className="flex items-start gap-10">
        {/* Desktop Filters */}
        <aside className="hidden w-52 shrink-0 lg:block">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <h2 className="text-sm font-medium text-gray-950">Filters</h2>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="cursor-pointer text-xs text-gray-500 transition hover:text-black"
              >
                Clear
              </button>
            )}
          </div>

          {/* Categories */}
          <FilterGroup title="Category">
            {categoryOptions.map((category) => (
              <FilterCheckbox
                key={category}
                label={category}
                checked={categories.includes(category)}
                onChange={() => toggleCategory(category)}
              />
            ))}
          </FilterGroup>

          {/* Product Types */}
          <FilterGroup title="Product type">
            {subCategoryOptions.map((subCategory) => (
              <FilterCheckbox
                key={subCategory}
                label={subCategory}
                checked={subCategories.includes(subCategory)}
                onChange={() => toggleSubCategory(subCategory)}
              />
            ))}
          </FilterGroup>
        </aside>

        {/* Products */}
        <div className="min-w-0 flex-1">
          {/* Desktop Toolbar */}
          <div className="mb-7 hidden items-center justify-between lg:flex">
            <div>
              <p className="text-sm text-gray-500">
                {filteredProducts.length}{' '}
                {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>

              {searchQuery.trim() && (
                <p className="mt-1 text-xs text-gray-400">
                  Results for "{searchQuery.trim()}"
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Sort by</span>

              <div className="relative">
                <select
                  value={sortType}
                  onChange={(e) => setSortType(e.target.value)}
                  className="appearance-none border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm text-gray-700 outline-none transition focus:border-gray-400"
                >
                  <option value="relevant">Featured</option>

                  <option value="low-high">Price: Low to high</option>

                  <option value="high-low">Price: High to low</option>
                </select>

                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Mobile Product Count */}
          <div className="mb-5 lg:hidden">
            <p className="text-sm text-gray-500">
              {filteredProducts.length}{' '}
              {filteredProducts.length === 1 ? 'product' : 'products'}
            </p>

            {searchQuery.trim() && (
              <p className="mt-1 text-xs text-gray-400">
                Results for "{searchQuery.trim()}"
              </p>
            )}
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
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
          ) : (
            <div className="flex min-h-80 flex-col items-center justify-center border border-gray-200 px-5 text-center">
              <Search size={25} strokeWidth={1.5} className="text-gray-300" />

              <h3 className="mt-4 text-base font-medium text-gray-900">
                {searchQuery.trim()
                  ? `No results for "${searchQuery.trim()}"`
                  : 'No products found'}
              </h3>

              <p className="mt-2 max-w-xs text-sm leading-6 text-gray-500">
                {searchQuery.trim()
                  ? 'Try another search term or clear your filters.'
                  : 'Try changing or clearing your filters to see more products.'}
              </p>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="mt-5 cursor-pointer border-b border-black pb-1 text-sm font-medium"
                >
                  Clear search and filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Backdrop */}
      <div
        onClick={() => setShowFilters(false)}
        className={`fixed inset-0 z-[60] bg-black/30 transition-opacity duration-300 lg:hidden ${
          showFilters ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      />

      {/* Mobile Filter Drawer */}
      <aside
        className={`fixed bottom-0 left-0 top-0 z-[70] w-[88%] max-w-sm overflow-y-auto bg-white transition-transform duration-300 ease-in-out lg:hidden ${
          showFilters ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="sticky top-0 z-10 flex h-[72px] items-center justify-between border-b border-gray-100 bg-white px-5">
          <div className="flex items-center gap-2">
            <h2 className="font-medium text-gray-950">Filters</h2>

            {activeFilterCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1.5 text-[10px] text-white">
                {activeFilterCount}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowFilters(false)}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition hover:bg-gray-100"
            aria-label="Close filters"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Filters */}
        <div className="px-5 pb-28">
          <FilterGroup title="Category">
            {categoryOptions.map((category) => (
              <FilterCheckbox
                key={category}
                label={category}
                checked={categories.includes(category)}
                onChange={() => toggleCategory(category)}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Product type">
            {subCategoryOptions.map((subCategory) => (
              <FilterCheckbox
                key={subCategory}
                label={subCategory}
                checked={subCategories.includes(subCategory)}
                onChange={() => toggleSubCategory(subCategory)}
              />
            ))}
          </FilterGroup>
        </div>

        {/* Drawer Footer */}
        <div className="fixed bottom-0 left-0 w-[88%] max-w-sm border-t border-gray-100 bg-white p-4">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={clearFilters}
              className="flex-1 border border-gray-300 px-4 py-3 text-sm font-medium text-gray-800 transition hover:bg-gray-50"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={() => setShowFilters(false)}
              className="flex-1 bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              View {filteredProducts.length}
            </button>
          </div>
        </div>
      </aside>
    </main>
  );
};

const FilterGroup = ({ title, children }) => {
  return (
    <div className="border-b border-gray-200 py-6">
      <h3 className="mb-4 text-sm font-medium text-gray-900">{title}</h3>

      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
};

const FilterCheckbox = ({ label, checked, onChange }) => {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-600 transition hover:text-black">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 cursor-pointer accent-black"
      />

      <span>{label}</span>
    </label>
  );
};

export default Collection;
