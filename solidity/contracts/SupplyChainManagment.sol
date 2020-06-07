pragma solidity 0.5.16;

contract SupplyChainManagment {
    struct SparePart {
        string partName;
        string partType;
        string uniqueNumber;
        address manufacturer;
    }

    struct Product{
        string prdName;
        string prdType;
        string uniqueNumber;
        address manufacturer;
        bytes32[] parts;
    }



    mapping(bytes32 => SparePart) public spareParts;
    mapping(bytes32 => Product) public products;

    constructor() public {}


    //add the sparePart to the Inventory
    //SparePart is updated to the map aganist hash
    //hash is generated using generateHash
    function createSpare(string memory partName, string memory partType, string memory uniqueNumber) public  returns(bytes32){
        address manufacturer = msg.sender;
        
        //generate the hash
        bytes32  itemHash = generateHash(uniqueNumber, manufacturer);
        
        
        //add SparePart
        require(spareParts[itemHash].manufacturer == address(0), "SparePart with same Serial Number is available in the inventory");
        SparePart memory item = createSparePart(partName, partType, uniqueNumber, manufacturer);
        spareParts[itemHash] = item;
        
        
        return itemHash;
    }

    // create the Product instance and add to the mapping
    //check for the spare parts avaialable
    function createProduct(string memory partName, string memory partType, string memory uniqueNumber, bytes32[] memory spare_parts) public returns (bytes32){
        address manufacturer = msg.sender;
        uint i;
        uint upperBound = spare_parts.length;
        for(i = 0;i < upperBound; i++){
            require(spareParts[spare_parts[i]].manufacturer != address(0), "Inexistent part used on product");
        }

        //Create hash
        bytes32 itemHash = generateHash(uniqueNumber, manufacturer);
        
        require(products[itemHash].manufacturer == address(0), "Product ID already used");
        Product memory product = createProductObj(partName, partType, uniqueNumber, manufacturer, spare_parts);
        products[itemHash] = product;

        return itemHash;
    }


    //will return the parts- mapping of the product
    function getParts(bytes32 product_hash) public view returns (bytes32[] memory){
        require(products[product_hash].manufacturer != address(0), "Product inexistent");
        return products[product_hash].parts;
    }

    
    //create the object from the SparePart struct
    function createSparePart(string memory partName, string memory partType, string memory uniqueNumber, address manufacturer) private pure returns(SparePart memory sparePart){
        return SparePart(partName, partType, uniqueNumber, manufacturer);
    }

    //create the object from the Product struct
    function createProductObj(string memory prdName, string memory prdType, string memory uniqueNumber, address manufacturer, bytes32[] memory spare_parts) private pure returns(Product memory prd){
        return Product(prdName, prdType, uniqueNumber, manufacturer, spare_parts);
    }

    //will generate the keccak256 hash
    //this will serve as the unique key for the item accros the blockchain
    function generateHash(string memory uniqueNumber, address manufacturer) private pure returns(bytes32  hash){
        bytes20  manB = bytes20(manufacturer);
        bytes32  itemHash = keccak256(abi.encodePacked(uniqueNumber,manB));
        return itemHash;
    }
}
