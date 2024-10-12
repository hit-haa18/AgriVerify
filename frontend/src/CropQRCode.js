import React from 'react';
import QRCode from 'qrcode';

const CropQRCode = ({ cropId }) => {
  const [qrCode, setQRCode] = React.useState("");

  const generateQRCode = async () => {
    try {
      const url = `https://sepolia.etherscan.io/address/${cropId}`; // Link to the blockchain
      const qrCodeUrl = await QRCode.toDataURL(url); // Generate QR code image
      return qrCodeUrl;
    } catch (err) {
      console.error("Error generating QR code: ", err);
    }
  };

  React.useEffect(() => {
    const fetchQRCode = async () => {
      const qrCodeUrl = await generateQRCode();
      setQRCode(qrCodeUrl);
    };
    if (cropId) { // Ensure cropId is valid before fetching
      fetchQRCode();
    }
  }, [cropId]);

  return (
    <div>
      {qrCode && (
        <div>
          <h3>Scan to Verify Your Crop:</h3>
          <img src={qrCode} alt="QR Code for Crop Verification" />
        </div>
      )}
    </div>
  );
};

export default CropQRCode;

