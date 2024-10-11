// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AgriVerify {

    struct Crop {
        uint cropId;
        string name;
        string location; // Geographic location of the farm (optional)
        address farmer;
        uint timestamp;
        bool isCertified;
    }

    // Mapping to store certified crops, mapped by a unique cropId
    mapping(uint => Crop) public certifiedCrops;

    // A mapping to track the crops each farmer has certified
    mapping(address => uint[]) public farmerCrops;

    // To store crop count and generate unique IDs for crops
    uint public cropCount;

    // Emit events for every crop certified and certification revoked
    event CropCertified(uint indexed cropId, string name, address indexed farmer, uint timestamp);
    event CertificationRevoked(uint indexed cropId, address indexed farmer, uint timestamp);

    // Modifier to ensure only the farmer who certified a crop can revoke it
    modifier onlyFarmer(uint _cropId) {
        require(certifiedCrops[_cropId].farmer == msg.sender, "Only the farmer who certified this crop can revoke it");
        _;
    }

    /**
     * @dev Function to certify a crop.
     * @param _name The name of the crop.
     * @param _location The geographic location of the farm (optional).
     */
    function certifyCrop(string memory _name, string memory _location) public {
        cropCount++; // Increment the global crop count to generate a new unique cropId

        // Create a new Crop and mark it as certified
        Crop memory newCrop = Crop({
            cropId: cropCount,
            name: _name,
            location: _location,
            farmer: msg.sender,
            timestamp: block.timestamp,
            isCertified: true
        });

        // Store the certified crop in the mapping
        certifiedCrops[cropCount] = newCrop;

        // Keep track of which crops the farmer has certified
        farmerCrops[msg.sender].push(cropCount);

        // Emit the CropCertified event
        emit CropCertified(cropCount, _name, msg.sender, block.timestamp);
    }

    /**
     * @dev Function to revoke a certification, if needed (e.g., fraud or error).
     * @param _cropId The unique ID of the crop to revoke.
     */
    function revokeCertification(uint _cropId) public onlyFarmer(_cropId) {
        require(certifiedCrops[_cropId].isCertified, "This crop is not certified");
        
        // Set the crop as uncertified
        certifiedCrops[_cropId].isCertified = false;

        // Emit a certification revoked event
        emit CertificationRevoked(_cropId, msg.sender, block.timestamp);
    }

    /**
     * @dev View function to get the details of a certified crop by its ID.
     * @param _cropId The unique ID of the crop.
     * @return Crop name, farmer address, timestamp, and certification status.
     */
    function getCropDetails(uint _cropId) public view returns (string memory, string memory, address, uint, bool) {
        Crop memory crop = certifiedCrops[_cropId];
        return (crop.name, crop.location, crop.farmer, crop.timestamp, crop.isCertified);
    }

    /**
     * @dev View function to get all crops certified by a specific farmer.
     * @param _farmer The address of the farmer.
     * @return Array of crop IDs certified by the farmer.
     */
    function getFarmerCrops(address _farmer) public view returns (uint[] memory) {
        return farmerCrops[_farmer];
    }
}
