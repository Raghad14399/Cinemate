import React, { useState, useEffect } from 'react';
import { Input, Message } from '../UsedInputs';
import Uploader from '../Uploader';
import { FaPlus } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { snackService, imageService } from '../../api/services';
import { toast } from 'react-toastify';

function EditSnackModal({ modalOpen, setModalOpen, snack, refreshSnacks }) {
  const [snackName, setSnackName] = useState('');
  const [description, setDescription] = useState('');
  const [imageId, setImageId] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [selectedVariety, setSelectedVariety] = useState('');
  const [snakVariants, setSnakVariants] = useState([{ size: '', price: '' }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (snack) {
      setSnackName(snack.englishName || '');
      setDescription(snack.description || '');
      setImageId(snack.image?.id || null);

      let imageUrl = snack.image?.url || '';
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = `http://cinemate-001-site1.jtempurl.com/${imageUrl}`;
      }
      setImagePreview(imageUrl);

      setSelectedVariety(snack.type || '');

      // Corrected to use 'variants' from GET response, which contains 'size' and 'price'
      if (snack.variants && snack.variants.length > 0) {
        setSnakVariants(snack.variants.map(v => ({
          id: v.id,
          size: v.size || '',
          price: v.price || ''
        })));
      } else {
        setSnakVariants([{ size: '', price: '' }]);
      }
    } else {
      // Reset form when no snack is selected
      setSnackName('');
      setDescription('');
      setImageId(null);
      setImagePreview('');
      setSelectedVariety('');
      setSnakVariants([{ size: '', price: '' }]);
    }
  }, [snack]);

  const handleVariantChange = (idx, field, value) => {
    setSnakVariants((prev) => prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));
  };

  const addVariant = () => {
    setSnakVariants((prev) => [...prev, { size: '', price: '' }]);
  };

  const removeVariant = (idx) => {
    setSnakVariants((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    const toastId = toast.loading('Uploading image...');
    try {
      const formData = new FormData();
      formData.append('Image', file);
      const response = await imageService.uploadImage(formData);
      setImageId(response.data.id);
      setImagePreview(URL.createObjectURL(file));
      toast.update(toastId, { render: 'Image uploaded successfully!', type: 'success', isLoading: false, autoClose: 2000 });
    } catch (err) {
      toast.update(toastId, { render: 'Image upload failed!', type: 'error', isLoading: false, autoClose: 2000 });
    }
  };

  const handleSubmit = async () => {
    if (!snackName.trim() || !selectedVariety || !imageId) {
      return toast.error('Please fill all required fields.');
    }

    setLoading(true);
    const toastId = toast.loading('Updating snack...');
    try {
      const payload = {
        id: snack.id,
        arabicName: snackName,
        englishName: snackName,
        description,
        imageId,
        type: selectedVariety,
        snakVariants: snakVariants.map(v => ({ size: v.size, price: Number(v.price), id: v.id || 0 })),
      };
      await snackService.updateSnack(snack.id, payload);
      toast.update(toastId, { render: 'Snack updated successfully!', type: 'success', isLoading: false, autoClose: 2000 });
      refreshSnacks();
      setModalOpen(false);
    } catch (error) {
      toast.update(toastId, { render: 'Failed to update snack!', type: 'error', isLoading: false, autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto scrollbar-hide relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-red-600 transition-colors duration-200 text-2xl z-10"
            >
              <IoClose />
            </button>
            <h2 className="text-xl font-bold text-white mb-6">Edit Snack: <span className='text-beige3'>{snack?.englishName}</span></h2>
            
            <div className="flex flex-col gap-6">
              {/* Snack Name and Variety */}
              <div className="w-full grid md:grid-cols-2 gap-6">
                <Input label="Snack Name" placeholder="e.g. Classic Popcorn" type="text" bg={true} value={snackName} onChange={(e) => setSnackName(e.target.value)} />
                <div className="text-sm w-full">
                  <label className="text-border font-semibold">Variety</label>
                  <select className="w-full mt-3 p-4 bg-main border border-border text-white rounded-2xl" value={selectedVariety} onChange={(e) => setSelectedVariety(e.target.value)}>
                    <option value="">Select a variety</option>
                    <option value="Drink">Drink</option>
                    <option value="Snak">Snak</option>
                  </select>
                </div>
              </div>

              {/* Snack Variants */}
              <div className="w-full flex flex-col gap-4 border-2 border-beige3 rounded-2xl p-6 bg-main shadow-md">
                <label className="font-semibold text-base text-beige3 mb-2">Snack Price Variants</label>
                {snakVariants.map((variant, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end mb-4">
                    <div className="w-full md:col-span-5">
                      <Input label="Size" placeholder="e.g. Large" type="text" bg={true} value={variant.size} onChange={(e) => handleVariantChange(idx, 'size', e.target.value)} />
                    </div>
                    <div className="w-full md:col-span-5">
                      <Input
                        label="Price (SYP)"
                        type="text"
                        inputMode="numeric"
                        placeholder="e.g. 15000"
                        value={variant.price}
                        onChange={(e) => {
                          const val = e.target.value;
                          // Allow only numbers
                          if (/^\d*$/.test(val)) {
                            handleVariantChange(idx, 'price', val);
                          }
                        }}
                        bg={true}
                      />
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      {snakVariants.length > 1 && (
                        <button type="button" onClick={() => removeVariant(idx)} className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-3 text-sm transition-all">Remove</button>
                      )}
                    </div>
                  </div>
                ))}
                <div className="w-full flex justify-end mt-2">
                  <button type="button" onClick={addVariant} className="font-medium transitions border border-beige3 flex items-center gap-2 text-white py-2 px-8 rounded-2xl bg-main hover:bg-beige3">
                    <FaPlus className="mr-2" /> Add Variant
                  </button>
                </div>
              </div>

              {/* Image & Description */}
              <div className="w-full grid md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2 group">
                  <p className="text-border font-semibold text-sm">Image</p>
                  <Uploader onFileSelect={handleImageUpload} />
                  {(imagePreview) && (
                    <div className="w-32 h-32 p-2 bg-main border border-border rounded-2xl overflow-hidden mt-2">
                      <img src={imagePreview} alt="snack" className="w-full h-full object-cover rounded-2xl" />
                    </div>
                  )}
                </div>
                <Message label="Snack Description" placeholder="Make it short and sweet" value={description} onChange={(val) => setDescription(val)} />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 mt-4">
                <button onClick={() => setModalOpen(false)} className="font-medium transitions border border-gray-500 text-white py-3 px-8 rounded-2xl bg-gray-700 hover:bg-gray-600">Cancel</button>
                <button onClick={handleSubmit} disabled={loading} className="font-medium transitions border border-beige3 text-white py-3 px-8 rounded-2xl bg-main hover:bg-beige3">
                  {loading ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EditSnackModal;
