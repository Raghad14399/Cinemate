import React, { useState, useEffect } from 'react';
import SideBar from '../SideBar';
import { Input, Message } from '../../../Components/UsedInputs';
import Uploader from '../../../Components/Uploader';
import { CategoriesData } from '../../../Data/CategoriesData';
import { UsersData } from '../../../Data/MovieData';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import { ImUpload } from 'react-icons/im';
import EditCastModal from '../../../Components/Modals/EditCastModal'; 

function AddMovie() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCast, setSelectedCast] = useState(null); 

  useEffect(() => {
    setCategories(CategoriesData);
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const openModal = (cast) => {
    setSelectedCast(cast);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCast(null);
  };

  return (
    <SideBar>
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold">Create Movie</h2>
        <div className="w-full grid md:grid-cols-2 gap-6">
          <Input label="Movie Title" placeholder="Game of Thrones" type="text" bg={true} />
          <Input label="Hours" placeholder="2hr" type="text" bg={true} />
        </div>
        <div className="w-full grid md:grid-cols-2 gap-6">
          <Input label="Language used" placeholder="English" type="text" bg={true} />
          <Input label="Translation language" placeholder="Arabic" type="text" bg={true} />
          <Input label="Year of Release" placeholder="2022" type="number" bg={true} />
        </div>

        {/* Images */}
        <div className="w-full grid md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2 group">
            <p className="text-border font-semibold text-sm">Image Without Title</p>
            <Uploader />
            <div className="w-32 h-32 p-2 bg-main border border-border rounded-2xl overflow-hidden transition-transform duration-300 group-hover:scale-105">
              <img src="/images/Movies/1.jpg" alt="" className="w-full h-full object-cover rounded-2xl" />
            </div>
          </div>
          <div className="flex flex-col gap-2 group">
            <p className="text-border font-semibold text-sm">Image With Title</p>
            <Uploader />
            <div className="w-32 h-32 p-2 bg-main border border-border rounded-2xl overflow-hidden transition-transform duration-300 group-hover:scale-105">
              <img src="/images/Movies/2.jpg" alt="" className="w-full h-full object-cover rounded-2xl" />
            </div>
          </div>
        </div>

        {/* Description */}
        <Message label="Movie Description" placeholder="Make it short and sweet" />

        {/* Category */}
        <div className="flex flex-col gap-2 text-border">
          <label htmlFor="category" className="font-medium text-sm">Category</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="bg-main border border-border text-gray-400 rounded-2xl p-3 font-semibold text-sm transition-colors duration-300 hover:bg-dry hover:text-white"
          >
            <option value="">Select Category</option>
            {categories.map((category, index) => (
              <option key={index} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
        </div>

        {/* Casts */}
        <div className="w-full grid lg:grid-cols-2 gap-6 items-start">
          <button
            onClick={() => openModal({})} 
            className="w-full py-4 bg-main border border-beige3 border-dashed text-white rounded-2xl hover:bg-beige3 transition-colors duration-300"
          >
            Add Cast
          </button>
          <div className="grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-4 grid-cols-2 gap-4">
            {UsersData.map((user, i) => (
              <div
                key={i}
                className="p-2 italic text-xs text-text rounded-2xl flex-colo bg-main border border-border transition-transform duration-300 hover:scale-105"
              >
                <img
                  src={`/images/${user.image ? user.image : 'user.png'}`}
                  alt={user.name}
                  className="w-full h-24 object-cover rounded-2xl mb-2"
                />
                <p>{user.name}</p>
                <div className="flex flex-rows mt-2 w-full gap-2 justify-center">
                  <button className="w-6 h-6 flex justify-center items-center bg-dry border border-border text-beige3 rounded-2xl hover:bg-beige3 hover:text-white transition-colors duration-300">
                    <MdDelete />
                  </button>
                  <button
                    onClick={() => openModal(user)} 
                    className="w-6 h-6 flex justify-center items-center bg-dry border border-border text-gray-500 rounded-2xl hover:bg-green-500 hover:text-white transition-colors duration-300"
                  >
                    <FaEdit />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="bg-beige3 w-full flex-rows gap-6 font-medium transitions hover:bg-dry border border-beige3 flex-rows text-white py-4 rounded-2xl transition-transform duration-300 hover:scale-95">
          <ImUpload /> Publish Movie
        </button>
      </div>

      <EditCastModal isOpen={isModalOpen} onClose={closeModal} cast={selectedCast} />
    </SideBar>
  );
}

export default AddMovie;
