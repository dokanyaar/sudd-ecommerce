import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, ImagePlus, LoaderCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';

import {
  getProductById,
  updateProductByAdmin,
} from '../../services/product.service';

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [images, setImages] = useState([null, null, null, null]);
  const [existingImages, setExistingImages] = useState([
    null,
    null,
    null,
    null,
  ]);

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
  const [fetching, setFetching] = useState(true);

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

  // Fetch existing product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setFetching(true);

        const data = await getProductById(productId);

        if (data.success) {
          const product = data.product;

          setName(product.name || '');
          setDescription(product.description || '');
          setPrice(product.price || '');
          setCategory(product.category || 'Men');
          setSubCategory(product.subCategory || 'T-Shirts');
          setSizes(product.sizes || []);
          setColors(product.colors || []);
          setBestseller(Boolean(product.bestseller));
          setInStock(product.inStock ?? true);

          const currentImages = [null, null, null, null];

          product.images?.slice(0, 4).forEach((image, index) => {
            currentImages[index] = image;
          });

          setExistingImages(currentImages);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);

        toast.error(error.response?.data?.message || 'Failed to load product.');
      } finally {
        setFetching(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Select a new image
  const handleImageChange = (index, file) => {
    if (!file) return;

    setImages((prev) => {
      const updatedImages = [...prev];
      updatedImages[index] = file;

      return updatedImages;
    });
  };

  // Remove newly selected replacement image
  const removeNewImage = (index) => {
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

  // Update product
  const handleSubmit = async (e) => {
    e.preventDefault();

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

    try {
      setLoading(true);

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

      // Only send newly selected images
      images.filter(Boolean).forEach((image) => {
        formData.append('images', image);
      });

      const data = await updateProductByAdmin(productId, formData);

      if (data.success) {
        toast.success(data.message || 'Product updated successfully.');

        navigate('/dashboard/list');
      }
    } catch (error) {
      console.error('Failed to update product:', error);

      toast.error(error.response?.data?.message || 'Failed to update product.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex min-h-72 items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <LoaderCircle size={18} className="animate-spin" />
          Loading product...
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div>
        <button
          type="button"
          onClick={() => navigate('/dashboard/list')}
          className="mb-5 flex cursor-pointer items-center gap-2 text-sm text-gray-500 transition hover:text-black"
        >
          <ArrowLeft size={16} />
          Back to products
        </button>

        <p className="text-sm text-gray-500">Products</p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
          Edit product
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Update the information for this product.
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
                description="Update the basic information customers will see."
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
                description="Select a new image if you want to replace an existing product image."
              />

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {images.map((image, index) => (
                  <EditImageUpload
                    key={index}
                    image={image}
                    existingImage={existingImages[index]}
                    index={index}
                    onChange={handleImageChange}
                    onRemove={removeNewImage}
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
                description="Update the available sizes and colors."
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
                description="Update the selling price."
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

                {loading ? 'Updating product...' : 'Save changes'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/dashboard/list')}
                disabled={loading}
                className="mt-3 h-11 w-full cursor-pointer border border-gray-200 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
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

const EditImageUpload = ({
  image,
  existingImage,
  index,
  onChange,
  onRemove,
}) => {
  const newPreview = image ? URL.createObjectURL(image) : null;

  const preview = newPreview || existingImage?.url;

  return (
    <div>
      <div className="relative aspect-4/5 overflow-hidden border border-dashed border-gray-300 bg-gray-50">
        {preview ? (
          <>
            <img
              src={preview}
              alt={`Product ${index + 1}`}
              className="h-full w-full object-cover"
            />

            {image && (
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute right-2 top-2 flex h-7 w-7 cursor-pointer items-center justify-center bg-white text-gray-600 shadow-sm transition hover:text-red-600"
                aria-label="Remove new image"
              >
                <X size={15} />
              </button>
            )}

            <label className="absolute bottom-2 left-2 cursor-pointer bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50">
              Replace
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onChange(index, e.target.files?.[0])}
                className="hidden"
              />
            </label>
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

export default EditProduct;
