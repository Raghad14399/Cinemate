import React, { useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { Link } from 'react-router-dom';

function NachosInfo({ nachos }) {
  const [size, setSize] = useState('Small');
  const [price, setPrice] = useState(20); 
  const [quantity, setQuantity] = useState(1);

  // التحقق من حالة تسجيل الدخول
  const isLoggedIn = localStorage.getItem('token'); // افترض أن التوكن يُخزن في localStorage

  const handleSizeChange = (selectedSize) => {
    setSize(selectedSize);
    if (selectedSize === 'Small') {
      setPrice(20); 
    } else if (selectedSize === 'Medium') {
      setPrice(20 + 2);
    } else if (selectedSize === 'Large') {
      setPrice(20 + 4); 
    }
  };

  const handleQuantityChange = (event) => {
    const newQuantity = event.target.value;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  if (!nachos) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-white bg-gradient-to-b">
        <AiOutlineLoading3Quarters className="animate-spin text-6xl text-beige3" />
      </div>
    );
  }

  const totalPrice = price * quantity;

  return (
    <div
      className="w-full h-screen flex flex-col lg:flex-row text-white animate-fadeIn sm:px-4 lg:px-32 py-8 sm:py-12 lg:py-16 gap-6 shadow-lg"
      style={{
        backgroundImage: `url(/images/Nachos/${nachos?.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundColor: 'rgba(0, 0.8, 10.8, 0.9)',  
        boxShadow: 'inherit',
        backgroundBlendMode: 'overlay',  
      }}
    >
      <div className="w-full lg:w-1/3 h-1/2 lg:h-full lg:ml-auto">
        <img
          src={`/images/Nachos/${nachos?.image}`}
          alt={nachos?.name}
          className="w-full h-full object-cover rounded-3xl lg:rounded-l-3xl shadow-lg"
        />
      </div>

      <div className="w-full lg:w-2/3 bg-opacity-95 p-6 sm:p-8 lg:p-12 flex flex-col justify-center gap-8 rounded-md lg:rounded-r-xl shadow-lg">
        <h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-beige3 tracking-wide">
          {nachos?.name}
        </h1>
        <div className="text-sm sm:text-base lg:text-lg text-gray-400 leading-relaxed">
          <p>{nachos?.description}</p>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <h3 className="font-semibold text-lg text-gray-400">Choose Size</h3>
            <div className="flex gap-4 mt-3">
              {['Small', 'Medium', 'Large'].map((sizeOption) => (
                <button
                  key={sizeOption}
                  onClick={() => handleSizeChange(sizeOption)}
                  className={`px-14 py-2 rounded-full text-sm font-semibold border transition-all duration-300 ${
                    size === sizeOption
                      ? 'bg-beige3 text-gray-900 border-beige3 shadow-lg scale-105'
                      : 'bg-transparent text-gray-300 border-gray-500 hover:bg-beige3 hover:text-gray-900 hover:shadow-lg'
                  }`}
                >
                  {sizeOption}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-gray-400">Quantity</h3>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              className="w-24 p-2 mt-3 text-center border border-beige3 rounded-full bg-transparent text-white shadow-md focus:outline-none focus:ring-2 focus:ring-beige3"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 mt-4">
          <div className="text-2xl sm:text-xl font-semibold text-gray-400">
            ${totalPrice} ({size})
          </div>
          {/* إظهار زر "Order Now" فقط إذا كان المستخدم مسجل الدخول */}
          {isLoggedIn && (
            <Link
              to={`/order/${nachos?.name}`}
              className="w-8/12 bg-dry py-4 px-28 text-center text-white hover:bg-beige3 border border-beige3 text-base font-semibold rounded-full shadow-lg hover:bg-opacity-90 transition-transform transform hover:scale-105 duration-300"
            >
              Order Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default NachosInfo;