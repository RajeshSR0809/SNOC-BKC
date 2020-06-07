const fs = require('fs');


const SupplyChainManagment = artifacts.require("SupplyChainManagment");
const OrderManagment = artifacts.require("./OrderManagment.sol");

module.exports = async function(deployer) {
  deployer.deploy(SupplyChainManagment).
  then((SCContract) => {
    return deployer.deploy(OrderManagment,SCContract.address);
  })
  .catch( (error) => {
    console.error(error)
  });
};
