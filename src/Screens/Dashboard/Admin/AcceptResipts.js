import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // استيراد useNavigate
import SideBar from './../SideBar';
import Uploader from '../../../Components/Uploader';
import { Input } from '../../../Components/UsedInputs';
import { CiBellOn, CiBellOff } from 'react-icons/ci';
import { IoClose } from 'react-icons/io5'; // استيراد أيقونة الإغلاق

function Respits() {
  const [bellOn, setBellOn] = useState(true);
  const navigate = useNavigate(); // استخدام useNavigate للتنقل بين الصفحات

  // دالة للعودة إلى الصفحة السابقة
  const handleClose = () => {
    navigate(-1); // العودة إلى الصفحة السابقة
  };

  return (
    <SideBar>
      <div className="relative flex flex-col gap-6">
        {/* زر الجرس */}
        <button
          onClick={() => setBellOn(!bellOn)}
          className="absolute top-2 right-12 text-beige3 text-2xl sm:text-3xl"
        >
          {bellOn ? <CiBellOn /> : <CiBellOff />}
        </button>

        {/* زر الإغلاق الجديد */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-2xl sm:text-3xl transition duration-300"
        >
          <IoClose />
        </button>

        <h2 className="text-xl font-bold">Accept Resipts</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Name"
            placeholder="Raghad"
            type="text"
            bg={true}
          />
          <Input
            label="Phone Number"
            placeholder="0537865768"
            type="text"
            bg={true}
          />
          <Input
            label="Hall Number"
            placeholder="1"
            type="text"
            bg={true}
          />
          <Input
            label="Movie Name"
            placeholder="Harry Potter"
            type="text"
            bg={true}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Seat"
            placeholder="C7"
            type="text"
            bg={true}
          />
          <Input
            label="Date"
            placeholder="12, Jan 2024"
            type="text"
            bg={true}
          />
          <Input
            label="Time"
            placeholder="12.AM"
            type="text"
            bg={true}
          />
        </div>

        <Uploader />

        <div className="flex gap-2 flex-wrap flex-col-reverse sm:flex-row justify-between items-center my-4">
          <button className="bg-red-500 font-medium transitions hover:bg-red-900 border border-red-400 flex-rows gap-4 text-white py-3 px-24 rounded-2xl w-full sm:w-auto">
            Deny
          </button>
          <button className="bg-main font-medium transitions hover:bg-beige3 border border-beige3 flex-rows gap-4 text-white py-3 px-20 rounded-2xl w-full sm:w-auto">
            Accept
          </button>
        </div>
      </div>
    </SideBar>
  );
}

export default Respits;