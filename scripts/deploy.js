const { ethers } = require("hardhat");

async function main() {
    // Get the list of signers
    const [deployer] = await ethers.getSigners();

    // Log the address of the deployer
    console.log("Deploying contracts with the account:", deployer.address);

    // Get the balance of the deployer using ethers provider
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", ethers.formatEther(balance)); // Updated for ethers v6
    
    // Load your contract and deploy it
    const YourContract = await ethers.getContractFactory("AgriVerify"); // Replace with your contract name
    const yourContract = await YourContract.deploy(); // Deploy contract

    // Wait for the deployment transaction to be mined
    console.log("Waiting for the contract deployment...");
    await yourContract.waitForDeployment(); // Use waitForDeployment in ethers v6

    // Log the address where the contract has been deployed
    console.log("Contract deployed to address:", yourContract.target); // 'target' is used in ethers v6 to get the contract address
}

// Run the main function and handle errors
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Deployment failed:", error);
        process.exit(1);
    });
