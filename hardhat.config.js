require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // Import dotenv to use the .env file

module.exports = {
  solidity: "0.8.27",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`, // Infura URL with Project ID
      accounts: [`0x${process.env.PRIVATE_KEY}`], // Your account private key
    },
  },
};
