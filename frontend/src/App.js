import React, { useState, useEffect, useCallback } from "react";
import { getContract } from "./contractUtils";
import CropQRCode from "./CropQRCode";

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [cropName, setCropName] = useState("");
  const [location, setLocation] = useState("");
  const [isCertifying, setIsCertifying] = useState(false);
  const [farmerCrops, setFarmerCrops] = useState([]);
  const [qrCodeCropId, setQrCodeCropId] = useState(null);

  // Check if MetaMask is installed
  useEffect(() => {
    if (!window.ethereum) {
      setErrorMessage("MetaMask is not installed. Please install it to use this app.");
    } else {
      const checkConnected = async () => {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0]);
          setIsConnected(true);
        }
      };
      checkConnected();
    }
  }, []);

  // Connect Wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setCurrentAccount(accounts[0]);
        setIsConnected(true);
        setErrorMessage("");
        console.log("Connected to account:", accounts[0]);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
        setErrorMessage("Could not connect to MetaMask");
      }
    } else {
      setErrorMessage("MetaMask is not installed. Please install it to use this app.");
    }
  };
  
  // Memoize fetchFarmerCrops with useCallback
  const fetchFarmerCrops = useCallback(async () => {
    const contract = await getContract();
    if (contract) {
      const crops = await contract.getFarmerCrops(currentAccount);
      setFarmerCrops(crops);
    }
  }, [currentAccount]); // Depend on currentAccount since it's used inside

  // Fetch crops when connected
  useEffect(() => {
    if (isConnected) {
      fetchFarmerCrops();
    }
  }, [isConnected, currentAccount, fetchFarmerCrops]);

  const certifyCrop = async () => {
    console.log("Attempting to certify crop...");
    if (cropName && location) {
        setIsCertifying(true);
        try {
            const contract = await getContract();
            if (!contract) {
                console.error("Contract instance not created");
                setIsCertifying(false);
                return;
            }

            console.log("Certifying crop with name:", cropName, "and location:", location);

            const gasEstimate = await contract.estimateGas.certifyCrop(cropName, location);
            console.log("Estimated gas:", gasEstimate.toString());

            const tx = await contract.certifyCrop(cropName, location);
            console.log("Transaction sent:", tx);

            const receipt = await tx.wait();
            console.log("Transaction mined. Receipt:", receipt);

            const cropId = receipt.events[0]?.args?.cropId?.toString();
            if (cropId) {
                alert("Crop certified successfully with ID: " + cropId);
                setQrCodeCropId(cropId);
                fetchFarmerCrops();
            } else {
                console.error("Failed to get cropId from receipt");
                setErrorMessage("Error: Could not retrieve cropId");
            }
        } catch (error) {
            console.error("Error certifying crop:", error);
            setErrorMessage("Error certifying crop: " + error.message);
        }
        setIsCertifying(false);
    } else {
        console.error("Please enter crop name and location.");
        setErrorMessage("Please enter crop name and location.");
    }
};

  return (
    <div className="App">
      <h1>AgriVerify: Farmer Onboarding</h1>
      {!isConnected ? (
        <button onClick={connectWallet}>Connect MetaMask Wallet</button>
      ) : (
        <div>
          <p>Connected account: {currentAccount}</p>
          <p>Welcome, Farmer!</p>
          <div>
            <h3>Certify a New Crop</h3>
            <input
              type="text"
              placeholder="Crop Name"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <button onClick={certifyCrop} disabled={isCertifying}>
              {isCertifying ? "Certifying..." : "Certify Crop"}
            </button>
          </div>

          <div>
            <h3>Your Certified Crops</h3>
            {farmerCrops.length > 0 ? (
              <ul>
                {farmerCrops.map((cropId) => (
                  <li key={cropId}>Crop ID: {cropId}</li>
                ))}
              </ul>
            ) : (
              <p>No certified crops found.</p>
            )}
          </div>

          {qrCodeCropId && <CropQRCode cropId={qrCodeCropId} />}
        </div>
      )}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
}

export default App;
