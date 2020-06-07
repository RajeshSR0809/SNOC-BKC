pragma solidity 0.5.16;
import './SupplyChainManagment.sol';

contract OrderManagment {

    mapping(bytes32 => address) public sparePartsInventory;
    mapping(bytes32 => address)  public prdsInventory;

    event ChangeInPartOwner(bytes32 indexed itemIndex, address indexed account);
    event changeInProductOwner(bytes32 indexed itemIndex, address indexed account);

    SupplyChainManagment private sc;
    constructor(address scAddrs) public {
        sc = SupplyChainManagment(scAddrs);
    }

    //this is like adding the item to the inventory 
    //only the itemHash <--> owner address is mapped
    //the no. of items is not managed
    //like regular inventory idea
    //push the event to transitionlogs
    //Dapp can access the logs to show the history
    function addSpareToInventory(bytes32 itemHash) public returns(address){
        address manufacturer;
        ( , , , manufacturer) = sc.spareParts(itemHash);
        require(manufacturer != address(0), "Spare not found to add to the inventory");
        require(sparePartsInventory[itemHash] == address(0), "Spare part is registered in the inventory");
        require(manufacturer == msg.sender, "Spare Part is not created by the user");
        sparePartsInventory[itemHash] = msg.sender;
        emit ChangeInPartOwner(itemHash, msg.sender);
        return manufacturer;
    }

    //will transfer the rights of the spare to the given to address
    function tranferSparePartRights(bytes32 itemHash, address to) public {
        require(sparePartsInventory[itemHash] == msg.sender, "Illegal Operation! User is not permited"); //only item owner can do the sale
        sparePartsInventory[itemHash] = to;
        emit ChangeInPartOwner(itemHash, to);
    }



    //this is like doing sale (Secondary / PO / PR)
    //only the itemHash <--> owner address in the map is changed
    //push the event to transitionlogs
    //Dapp can access the logs to show the history
    function addProductToInventory(bytes32 itemHash) public {
        address manufacturer;
        ( , , , manufacturer) = sc.products(itemHash);
        require(manufacturer != address(0), "Spare not found to add to the inventory"); //item should be created
        require(prdsInventory[itemHash] == address(0), "Product was already registered");
        require(manufacturer == msg.sender, "Spare Part is not created by the user"); //item can be put into inventory only by its owner
        prdsInventory[itemHash] = msg.sender;
        emit changeInProductOwner(itemHash, msg.sender);
    }


    function tranferPrdRights(bytes32 itemHash, address to) public {
        require(prdsInventory[itemHash] == msg.sender, "Product is not with this account");
        prdsInventory[itemHash] = to;
        emit changeInProductOwner(itemHash, to);
        bytes32[] memory spare_parts = sc.getParts(itemHash);
        for(uint i = 0; i < spare_parts.length; i++){
            sparePartsInventory[spare_parts[i]] = to;
            emit ChangeInPartOwner(spare_parts[i], to);
        }
    }



}