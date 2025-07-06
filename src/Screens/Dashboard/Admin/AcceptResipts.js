import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SideBar from './../SideBar';
import Uploader from '../../../Components/Uploader';
import { Input } from '../../../Components/UsedInputs';
import { CiBellOn, CiBellOff } from 'react-icons/ci';
import { IoClose } from 'react-icons/io5';
import api from '../../../api/config';
import imageApi from '../../../api/imageApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Respits() {
  const navigate = useNavigate();
  const location = useLocation();
  const [payment, setPayment] = useState({ email: "-", imageUrl: null });
  const [loadingButton, setLoadingButton] = useState(null);

  const { email: stateEmail = "-", id, receiptImage: stateReceiptImage } = location.state || {};
  const imageIdFromState = stateReceiptImage?.id;

  useEffect(() => {
    try {
      let imageUrl = null;
      if (stateReceiptImage && stateReceiptImage.url) {
        imageUrl = stateReceiptImage.url.startsWith('http')
          ? stateReceiptImage.url
          : `http://cinemate-001-site1.jtempurl.com/${stateReceiptImage.url}`;
      }
      setPayment({
        email: stateEmail,
        imageUrl,
      });
    } catch (err) {
      toast.error("Failed to load receipt image");
    } finally {

    }
  }, [stateEmail, stateReceiptImage]);

  const handleClose = () => {
    navigate(-1);
  };

  const handleStatusUpdate = async (status) => {
    if (!id) {
      toast.error("Payment ID is required");
      return;
    }

    try {
      setLoadingButton(status);
      console.log('Current status:', payment.status); // Log current status

      // Update local status first
      const newStatus = status.toLowerCase(); // Convert status to lowercase
      setPayment(prev => ({ ...prev, status: newStatus }));

      // Send request to server with query parameters
      const response = await api.put(`/api/Payment/${id}?Status=${newStatus}`);

      if (response.data.success) {
        console.log('Updated status:', newStatus); // Log new status
        toast.success(`Payment status updated to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`);
        // Redirect after one second
        setTimeout(() => {
          navigate(-1, { state: { refresh: true } }); // Add refresh for reload
        }, 1000);
      } else {
        console.log('Update failed:', response.data); // Log failure reason
        // If request fails, revert previous status
        setPayment(prev => ({ ...prev, status: prev.status }));
        toast.error("Failed to update payment status");
      }
    } catch (err) {
      console.log('Error:', err.response?.data); // Log error
      // If error occurs, revert previous status
      setPayment(prev => ({ ...prev, status: prev.status }));
      toast.error(err.response?.data?.message || "Failed to update payment status");
    } finally {
      setLoadingButton(null);
    }
  };

  return (
    <SideBar>
      <div className="max-w-4xl mx-auto bg-main">
        <div className="rounded-2xl p-6 mt-8 shadow-lg border border-beige3 border-solid">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">Payment Details</h2>
            <button
              onClick={handleClose}
              className="text-white hover:text-red-600 transition-colors"
              title="Back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>





          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <Input
                  type="email"
                  value={payment.email || "-"}
                  disabled
                  className="w-full bg-gray-800 border-gray-700 border-[1px] border-solid text-white placeholder-gray-400"
                />
                {!payment.imageUrl && (
                  <div className="flex items-center justify-center ">
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="w-full">
                {payment.imageUrl ? (
                  <div className="relative aspect-[4/3]">
                    <img
                      src={payment.imageUrl}
                      alt="Receipt"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute bottom-0 left-0 p-2">
                      <button
                        onClick={() => window.open(payment.imageUrl, '_blank')}
                        className="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-100"
                      >
                        View Larger
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8 bg-gray-800 rounded-lg">
                    <p className="text-gray-400 ">No receipt image uploaded</p>
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-8">
                <button
                  onClick={() => handleStatusUpdate('Canceled')}
                  disabled={loadingButton === 'Canceled'}
                  className={`bg-red-500 font-medium transitions hover:bg-red-900 border border-red-400 flex-rows gap-4 text-white py-3 px-16 rounded-2xl h-12 ${loadingButton === 'Canceled' ? 'opacity-50' : ''}`}
                >
                  {loadingButton === 'Canceled' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </>
                  ) : (
                    'Rject'
                  )}
                </button>
                <button
                  onClick={() => handleStatusUpdate('Accepted')}
                  disabled={loadingButton === 'Accepted'}
                  className={`bg-main font-medium transitions hover:bg-beige3 border border-beige3 flex-rows gap-4 text-white py-3 px-16 rounded-2xl h-12 ${loadingButton === 'Accepted' ? 'opacity-50' : ''}`}
                >
                  {loadingButton === 'Accepted' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </>
                  ) : (
                    'Accept'
                  )}
                </button>
              </div>
            </div>



          </div>
        </div>
      </div>
    </SideBar>
  );
}

export default Respits;