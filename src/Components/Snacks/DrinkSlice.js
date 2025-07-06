import React, { useEffect, useState } from 'react';
import { snackService } from '../../api/snackService';
import { useNavigate } from 'react-router-dom';

function DrinkSlice() {
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrinks = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await snackService.getAllSnacks({ SnakType: 'Drink' });
        if (res && res.data && Array.isArray(res.data)) {
          const englishDrinks = res.data.filter(item => item.englishName);
          setDrinks(englishDrinks);
        } else {
          setError("No drinks found.");
        }
      } catch (err) {
        setError("Failed to load drinks.");
      } finally {
        setLoading(false);
      }
    };
    fetchDrinks();
  }, []);

  const handleClick = (drink) => {
    navigate(`/drink/${drink.id}`);
  };

  return (
    <div className="my-12 px-0">
      <h2 className="text-2xl font-bold mb-6 text-main">Drinks</h2>
      {loading ? (
        <div className="text-center py-12 text-main font-bold">Loading...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500 font-bold">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {drinks.map((drink) => (
            <div
              key={drink.id}
              onClick={() => handleClick(drink)}
              className="bg-dry border border-border shadow-md rounded-2xl p-4 flex flex-col items-center text-center transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:bg-lightGray relative cursor-pointer"
            >
              <div className="w-full h-64 overflow-hidden rounded-2xl relative">
                <img
                  src={drink.image && drink.image.url ? drink.image.url : '/images/logo1.png'}
                  alt={drink.englishName}
                  className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
                  style={{ display: 'block' }}
                />
                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 flex justify-center items-center text-white text-xl font-semibold">
                  <h3>{drink.englishName}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DrinkSlice;
