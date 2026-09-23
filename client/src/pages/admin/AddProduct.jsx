import { useState } from 'react';
import { Check, ImagePlus, LoaderCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { createProductByAdmin } from '../../services/product.service';

const AddProduct = () => {
  const [images, setImages] = useState([null, null, null, null]);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Men');
  const [subCategory, setSubCategory] = useState('T-Shirts');

  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);

  const [bestseller, setBestseller] = useState(false);
  const [inStock, setInStock] = useState(true);

  const [loading, setLoading] = useState(false);

  const categories = ['Men', 'Women', 'Shoes', 'Accessories'];

  const subCategories = [
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

  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];

  const availableColors = [
    'Black',
    'White',
    'Gray',
    'Blue',
    'Brown',
    'Green',
    'Red',
  ];

  const handleImageChange = (index, file) => {
    if (!file) return;

    setImages((prev) => {
      const updatedImages = [...prev];
      updatedImages[index] = file;

      return updatedImages;
    });
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const updatedImages = [...prev];
      updatedImages[index] = null;

      return updatedImages;
    });
  };

  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size)
        ? prev.filter((item) => item !== size)
        : [...prev, size],
    );
  };

  const toggleColor = (color) => {
    setColors((prev) =>
      prev.includes(color)
        ? prev.filter((item) => item !== color)
        : [...prev, color],
    );
  };

  const resetForm = () => {
    setImages([null, null, null, null]);

    setName('');
    setDescription('');
    setPrice('');

    setCategory('Men');
    setSubCategory('T-Shirts');

    setSizes([]);
    setColors([]);

    setBestseller(false);
    setInStock(true);
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedImages = images.filter(Boolean);

    if (selectedImages.length === 0) {
      toast.error('Please upload at least one product image.');
      return;
    }

    if (!name.trim()) {
      toast.error('Product name is required.');
      return;
    }

    if (!description.trim()) {
      toast.error('Product description is required.');
      return;
    }

    if (!price || Number(price) <= 0) {
      toast.error('Please enter a valid product price.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append('name', name.trim());
      formData.append('description', description.trim());
      formData.append('price', price);
      formData.append('category', category);
      formData.append('subCategory', subCategory);

      formData.append('sizes', JSON.stringify(sizes));
      formData.append('colors', JSON.stringify(colors));

      formData.append('bestseller', String(bestseller));
      formData.append('inStock', String(inStock));

      selectedImages.forEach((image) => {
        formData.append('images', image);
      });

      const data = await createProductByAdmin(formData);

      if (data.success) {
        toast.success(data.message);
        resetForm();
      }
    } catch (error) {
      console.error('Failed to create product:', error);

      toast.error(error.response?.data?.message || 'Failed to add product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div>
        <p className="text-sm text-gray-500">Products</p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
          Add product
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Create a new product for your store.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          {/* Left */}
          <div className="space-y-6">
            {/* Basic information */}
            <section className="border border-gray-200 bg-white p-5 sm:p-6">
              <SectionHeader
                title="Product information"
                description="Enter the basic information customers will see."
              />

              <div className="mt-6 space-y-5">
                <Field label="Product name" required>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Essential Cotton T-Shirt"
                    className="input"
                  />
                </Field>

                <Field label="Description" required>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    placeholder="Describe the product, material, fit and other useful details..."
                    className="input resize-none py-3"
                  />
                </Field>
              </div>
            </section>

            {/* Images */}
            <section className="border border-gray-200 bg-white p-5 sm:p-6">
              <SectionHeader
                title="Product images"
                description="Upload up to four product images. The first image will be the main image."
              />

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {images.map((image, index) => (
                  <ImageUpload
                    key={index}
                    image={image}
                    index={index}
                    onChange={handleImageChange}
                    onRemove={removeImage}
                  />
                ))}
              </div>
            </section>

            {/* Organization */}
            <section className="border border-gray-200 bg-white p-5 sm:p-6">
              <SectionHeader
                title="Organization"
                description="Organize the product so customers can find it easily."
              />

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field label="Category">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="input"
                  >
                    {categories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Product type">
                  <select
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    className="input"
                  >
                    {subCategories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </section>

            {/* Variants */}
            <section className="border border-gray-200 bg-white p-5 sm:p-6">
              <SectionHeader
                title="Product options"
                description="Select the available sizes and colors."
              />

              <div className="mt-6 space-y-7">
                <Field label="Available sizes">
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => {
                      const selected = sizes.includes(size);

                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => toggleSize(size)}
                          className={`min-w-12 border px-4 py-2.5 text-sm transition ${
                            selected
                              ? 'border-black bg-black text-white'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </Field>

                <Field label="Available colors">
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map((color) => {
                      const selected = colors.includes(color);

                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => toggleColor(color)}
                          className={`flex items-center gap-2 border px-4 py-2.5 text-sm transition ${
                            selected
                              ? 'border-black bg-gray-50 text-black'
                              : 'border-gray-200 text-gray-600 hover:border-gray-400'
                          }`}
                        >
                          {selected && <Check size={14} />}

                          {color}
                        </button>
                      );
                    })}
                  </div>
                </Field>
              </div>
            </section>
          </div>

          {/* Right */}
          <div className="space-y-6">
            {/* Pricing */}
            <section className="border border-gray-200 bg-white p-5 sm:p-6">
              <SectionHeader
                title="Pricing"
                description="Set the selling price."
              />

              <div className="mt-6">
                <Field label="Price" required>
                  <div className="flex">
                    <div className="flex h-11 items-center border border-r-0 border-gray-200 bg-gray-50 px-4 text-sm text-gray-500">
                      KSh
                    </div>

                    <input
                      type="number"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0"
                      className="h-11 min-w-0 flex-1 border border-gray-200 px-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-gray-500"
                    />
                  </div>
                </Field>
              </div>
            </section>

            {/* Product status */}
            <section className="border border-gray-200 bg-white p-5 sm:p-6">
              <SectionHeader
                title="Product status"
                description="Control how this product appears in your store."
              />

              <div className="mt-6 space-y-5">
                <Toggle
                  label="In stock"
                  description="Customers can purchase this product."
                  checked={inStock}
                  onChange={() => setInStock((prev) => !prev)}
                />

                <div className="border-t border-gray-100" />

                <Toggle
                  label="Bestseller"
                  description="Feature this product as a bestseller."
                  checked={bestseller}
                  onChange={() => setBestseller((prev) => !prev)}
                />
              </div>
            </section>

            {/* Actions */}
            <section className="border border-gray-200 bg-white p-5 sm:p-6">
              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 bg-black px-5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && <LoaderCircle size={17} className="animate-spin" />}

                {loading ? 'Adding product...' : 'Add product'}
              </button>

              <button
                type="button"
                onClick={resetForm}
                disabled={loading}
                className="mt-3 h-11 w-full cursor-pointer border border-gray-200 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear form
              </button>
            </section>
          </div>
        </div>
      </form>
    </div>
  );
};

const SectionHeader = ({ title, description }) => {
  return (
    <div>
      <h2 className="text-sm font-medium text-gray-950">{title}</h2>

      <p className="mt-1 text-xs leading-5 text-gray-400">{description}</p>
    </div>
  );
};

const Field = ({ label, required = false, children }) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {children}
    </div>
  );
};

const ImageUpload = ({ image, index, onChange, onRemove }) => {
  const preview = image ? URL.createObjectURL(image) : null;

  return (
    <div>
      <div className="relative aspect-4/5 overflow-hidden border border-dashed border-gray-300 bg-gray-50">
        {preview ? (
          <>
            <img
              src={preview}
              alt={`Product upload ${index + 1}`}
              className="h-full w-full object-cover"
            />

            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute right-2 top-2 flex h-7 w-7 cursor-pointer items-center justify-center bg-white text-gray-600 shadow-sm transition hover:text-red-600"
              aria-label="Remove image"
            >
              <X size={15} />
            </button>
          </>
        ) : (
          <label className="flex h-full cursor-pointer flex-col items-center justify-center px-3 text-center">
            <ImagePlus size={22} strokeWidth={1.5} className="text-gray-400" />

            <span className="mt-2 text-xs font-medium text-gray-600">
              Upload image
            </span>

            <span className="mt-1 text-[11px] text-gray-400">
              {index === 0 ? 'Main image' : `Image ${index + 1}`}
            </span>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => onChange(index, e.target.files?.[0])}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );
};

const Toggle = ({ label, description, checked, onChange }) => {
  return (
    <div className="flex items-start justify-between gap-5">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>

        <p className="mt-1 text-xs leading-5 text-gray-400">{description}</p>
      </div>

      <button
        type="button"
        onClick={onChange}
        aria-pressed={checked}
        className={`relative mt-0.5 h-6 w-11 shrink-0 cursor-pointer rounded-full transition ${
          checked ? 'bg-black' : 'bg-gray-200'
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
            checked ? 'left-6' : 'left-1'
          }`}
        />
      </button>
    </div>
  );
};

export default AddProduct;
