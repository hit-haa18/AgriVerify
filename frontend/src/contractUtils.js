import { ethers } from "ethers";
import abi from './artifacts/contracts/AgriVerify.json'; // Ensure this path is correct

const contractAddress = "0x9B9b88414Eff0cA62cbC7f4e04D5143a71932860"; // Sepolia testnet address

// Get the contract instance
const getContract = async () => {
  if (typeof window.ethereum !== "undefined") {
    try {
      // Create a provider using the Web3 provider
      const provider = new ethers.BrowserProvider(window.ethereum); // Updated for ethers v6
      const signer = await provider.getSigner(); // Get the signer correctly in v6
      
      console.log("Signer: ", signer); // Log the signer object to ensure it's working

      // Create the contract instance
      const agriVerifyContract = new ethers.Contract(contractAddress, abi.abi, signer); // Access the ABI from the imported object
      console.log("Contract Instance: ", agriVerifyContract); // Log the contract instance to verify it
      
      return agriVerifyContract;
    } catch (error) {
      console.error("Error creating contract instance:", error); // Log any errors in contract creation
      return null;
    }
  } else {
    console.error("Ethereum object doesn't exist. Please install MetaMask."); // Log if MetaMask is not available
    return null;
  }
};

export { getContract };
