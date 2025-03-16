import React, { useState, useEffect } from 'react';
import SideBar from '../SideBar';
import { Input, Message } from '../../../Components/UsedInputs';
import Uploader from '../../../Components/Uploader';
import { Varieties } from '../../../Data/MovieData'; 
import { ImUpload } from 'react-icons/im';

function AddSnack() {
  const [varieties, setVarieties] = useState([]); 
  const [selectedVariety, setSelectedVariety] = useState('');

  useEffect(() => {
    setVarieties(Varieties); 
  }, []);

  const handleVarietiesChange = (e) => {
    setSelectedVariety(e.target.value);
  };

  return (
    <SideBar>
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold transition-transform duration-300 hover:scale-105 hover:text-beige3">
          Create Snack
        </h2>
        <div className="w-full grid md:grid-cols-2 gap-6">
          <Input label="Snack Name" placeholder="Enter the name of the food" type="text" bg={true} />
          <Input label="Price" placeholder="SAR" type="text" bg={true} />
        </div>
        <div className="w-full grid md:grid-cols-2 gap-6">
          <Input label="Allergens" placeholder="Milk, Coconut, Soy" type="text" bg={true} />
        </div>

        {/* Images */}
        <div className="w-full grid md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2 group">
            <p className="text-border font-semibold text-sm">Image Without Title</p>
            <Uploader />
            <div className="w-32 h-32 p-2 bg-main border border-border rounded-2xl overflow-hidden transition-transform duration-300 group-hover:scale-105">
              <img
                src="/images/Nachos/4.jpg"
                alt=""
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 group">
            <p className="text-border font-semibold text-sm">Image With Title</p>
            <Uploader />
            <div className="w-32 h-32 p-2 bg-main border border-border rounded-2xl overflow-hidden transition-transform duration-300 group-hover:scale-105">
              <img
                src="/images/Drink/2.jpg"
                alt=""
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <Message label="Snack Description" placeholder="Make it short and sweet" />

        {/* Category */}
        <div className="flex flex-col gap-2 text-border">
          <label htmlFor="Varieties" className="font-medium text-sm">
            Varieties
          </label>
          <select
            id="Varieties"
            value={selectedVariety}
            onChange={handleVarietiesChange}
            className="bg-main border border-border text-gray-400 rounded-2xl p-3 font-semibold text-sm transition-colors duration-300 hover:bg-dry hover:text-white"
          >
            <option value="">Select Varieties</option>
            {varieties.map((variety, index) => (
              <option key={index} value={variety.name}>
                {variety.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button className="bg-beige3 w-full flex-rows gap-6 font-medium transitions hover:bg-dry border border-beige3 flex-rows text-white py-4 rounded-2xl transition-transform duration-300 hover:scale-95">
          <ImUpload /> Publish Snack
        </button>
      </div>
    </SideBar>
  );
}

export default AddSnack;
