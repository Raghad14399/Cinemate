import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import QRCode from 'react-qr-code';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import SideBar from './SideBar';

const BookNow = () => {
  const navigate = useNavigate(); 
  const { state } = useLocation();
  const {
    hallType = 'Unknown Hall',
    movieTime = 'Not Selected',
    selectedSeats = [],
    totalPrice = 0,
    movieTitle = 'Movie Ticket',
    centerName = 'Center Name',
    bookingID = '123456',
  } = state || {};
  const issueDate = new Date().toLocaleDateString();

  const handleDownloadPDF = async () => {
    const ticketElement = document.getElementById('ticket');

    const canvas = await html2canvas(ticketElement, {
      backgroundColor: null,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [210, 297],
    });

    pdf.setFillColor(8, 10, 26);
    pdf.rect(0, 0, 210, 297, 'F');

    const imgWidth = 100;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 55, 10, imgWidth, imgHeight);

    const pdfBlob = pdf.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'MovieTicket.pdf';
    link.click();
  };

  const handleQRCodeScan = () => {
    handleDownloadPDF();
  };

  const qrCodeValue = `${window.location.origin}/download-ticket?movie=${movieTitle}&hall=${hallType}&time=${movieTime}&seats=${selectedSeats.join(', ')}&id=${bookingID}`;

  return (
    <SideBar>
      <div className="relative">
        <button
          className="absolute top-4 right-4 text-gray-500 font-bold py-1 px-3 rounded-full"
          onClick={() => navigate('/favorites')} 
          aria-label="Close"
        >
          ✕
        </button>

        <div
          id="ticket"
          className="ticket-container p-8 w-full max-w-lg mx-auto bg-gradient-to-b from-main to-main border-2 border-border border-dashed shadow-xl rounded-lg text-white"
          style={{
            minHeight: '500px',
            paddingLeft: '40px',
            paddingRight: '40px',
          }}
        >
          <div className="ticket-header text-center mb-6">
            <h2 className="text-4xl font-bold text-beige3">Movie Ticket</h2>
            <p className="text-lg text-gray-300 mt-2">Issued on: {issueDate}</p>
          </div>
          <div className="border-b border-dashed border-gray-700 py-2 mb-4" />

          <div className="ticket-details text-lg mt-2">
            <div className="grid grid-cols-2 mb-4">
              <p><strong>Center:</strong></p>
              <p className="text-right">{centerName}</p>
            </div>
            <div className="border-b border-dashed border-gray-700 py-2 mb-4" />

            <div className="grid grid-cols-2 mb-4">
              <p><strong>Hall Type:</strong></p>
              <p className="text-right">{hallType}</p>
            </div>
            <div className="border-b border-dashed border-gray-700 py-2 mb-4" />

            <div className="grid grid-cols-2 mb-4">
              <p><strong>Movie Time:</strong></p>
              <p className="text-right">{movieTime}</p>
            </div>
            <div className="border-b border-dashed border-gray-700 py-2 mb-4" />

            <div className="grid grid-cols-2 mb-4">
              <p><strong>Selected Seats:</strong></p>
              <p className="text-right">
                <span className={selectedSeats.length > 0 ? 'text-green-500' : 'text-gray-500'}>
                  {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'No seats selected'}
                </span>
              </p>
            </div>
            <div className="border-b border-dashed border-gray-700 py-2 mb-4" />

            <div className="grid grid-cols-2 mb-4">
              <p><strong>Total Price:</strong></p>
              <p className="text-right">${totalPrice}</p>
            </div>
            <div className="border-b border-dashed border-gray-700 py-2 mb-4" />

            <div className="grid grid-cols-2 mb-6">
              <p><strong>Booking ID:</strong></p>
              <p className="text-right">{bookingID}</p>
            </div>
          </div>
          <div className="border-b border-dashed border-gray-700 py-2 mb-4" />

          <div className="flex justify-center mb-10">
            <QRCode
              value={qrCodeValue}
              onClick={handleQRCodeScan} 
            />
          </div>

          <p className="text-sm text-center text-white mt-4">Scan this barcode at the entrance.</p>
        </div>

        {/* Download Button */}
        <div className="text-center mt-4">
          <button
            onClick={handleDownloadPDF}
            className="bg-beige3 hover:bg-main border border-beige3 text-white font-bold py-2 px-4 rounded-2xl"
          >
            Download Ticket as PDF
          </button>
        </div>
      </div>
    </SideBar>
  );
};

export default BookNow;
