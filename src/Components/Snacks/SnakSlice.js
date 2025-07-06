import React, { useEffect, useState } from 'react';
import { snackService } from '../../api/snackService';
import { useNavigate } from 'react-router-dom';

function SnakSlice() {
  const [snaks, setSnaks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSnaks = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await snackService.getAllSnacks({ SnakType: 'Snak' });
        if (res && res.data && Array.isArray(res.data)) {
          const englishSnaks = res.data.filter(item => item.englishName);
          setSnaks(englishSnaks);
        } else {
          setError("No snacks found.");
        }
      } catch (err) {
        setError("Failed to load snacks.");
      } finally {
        setLoading(false);
      }
    };
    fetchSnaks();
  }, []);

  // لا يوجد انتقال أو حدث عند النقر

  return (
    <div className="my-12 px-0">
      <h2 className="text-2xl font-bold mb-6 text-main">Snak</h2>
      {loading ? (
        <div className="text-center py-12 text-main font-bold">Loading...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500 font-bold">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {snaks.map((snak) => {
            // معالجة رابط الصورة بنفس منطق SnackList
            let imgSrc = snak.image?.url || '';
            if (!imgSrc || imgSrc === 'default-movie.jpg') {
              imgSrc = '/images/placeholder.png';
            } else if (imgSrc.startsWith('Images/')) {
              imgSrc = `http://cinemate-001-site1.jtempurl.com/${imgSrc}`;
            } else if (!imgSrc.startsWith('http')) {
              imgSrc = `/images/snacks/${imgSrc}`;
            }
            return (
              <div
                key={snak.id}
                className="bg-dry border border-border shadow-md rounded-2xl p-4 flex flex-col items-center text-center transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:bg-lightGray relative"
              >
                <div className="relative w-full h-64 rounded-2xl overflow-hidden">
                  <img
                    src={imgSrc}
                    alt={snak.englishName}
                    className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                  />
                </div>
                <div className="absolute flex-btn gap-2 bottom-0 right-0 left-0 bg-main bg-opacity-60 text-white px-4 py-3">
                  <h3 className="font-semibold truncate">{snak.englishName}</h3>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SnakSlice;
