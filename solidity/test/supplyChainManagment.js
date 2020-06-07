
const SupplyChainManagment = artifacts.require("./SupplyChainManagment.sol");
const OrderManagment = artifacts.require("./OrderManagment.sol");



contract("SND SC test", async accounts => {


    it('should have contract deployed ', async () => {
        const scInstance = await SupplyChainManagment.deployed();
        assert.isNotNull(scInstance, 'contract is not deployed');
    });

    it("should have createSpare", async () => {
        contract = await SupplyChainManagment.deployed();
        assert.isDefined(contract.createSpare, 'createSpare function is not available on the contract instance');
    });


    it('should create spare part', async () => {
            const scInstance = await SupplyChainManagment.deployed();
            const block = scInstance.createSpare("Wheel 23","wheel","CHASSI - 12324", {from: accounts[0]});
            const itemHash = web3.utils.soliditySha3(web3.utils.fromAscii("CHASSI - 12324"), accounts[0]);
            const sparePart = await scInstance.spareParts.call(itemHash);

            assert.equal(sparePart['partName'],"Wheel 23");
            assert.equal(sparePart['partType'],"wheel");
            assert.equal(sparePart['uniqueNumber'],"CHASSI - 12324");
            assert.equal(sparePart['manufacturer'], accounts[0]);
    });

    // it('should not create spare part with same unique number and sender', async () => {
    //     try{
    //         const scInstance = await SupplyChainManagment.deployed();
    //         const block = scInstance.createSpare("Wheel 231","wheel1","CHASSI - 12324", {from: accounts[0]});
            
    //         const itemHash = web3.utils.soliditySha3(web3.utils.fromAscii("CHASSI - 12324"), accounts[0]);
    //         const sparePart = await scInstance.spareParts.call(itemHash);
            
    //         assert.notEqual(sparePart['partName'],"Wheel 231");
    //         assert.notEqual(sparePart['partType'],"wheel1");
    //         assert.notEqual(sparePart['uniqueNumber'],"CHASSI - 12324");
    //         assert.notEqual(sparePart['manufacturer'], accounts[0]);
    //     }catch(error){
    //         assert.fail("rr")
    //     }
    // });

    // it("should add the sparepart/product to the inventory", async () => {
    //     const scInstance = await SupplyChainManagment.deployed();
    //     const itemHash = web3.utils.soliditySha3(web3.utils.fromAscii("CHASSI - 12324"), accounts[0]);

    //     const inventoryBlock = await scInstance.addSpareToInventory(itemHash);
    //     const owner = await scInstance.sparePartsInventory.call(itemHash);
    //     assert.equal(owner, accounts[0]);
    // });
    
    // it("should transfer the rights of the sparepart/product ", async () => {
    //     const scInstance = await SupplyChainManagment.deployed();
    //     const itemHash = web3.utils.soliditySha3(web3.utils.fromAscii("CHASSI - 12324"), accounts[0]);
    //     const inventoryBlock = await scInstance.tranferSparePartRights(itemHash, accounts[1]);
    //     const owner = await scInstance.sparePartsInventory.call(itemHash);
    //     assert.equal(owner, accounts[1]);

    // });

    it('should create Product', async () => {
        const scInstance = await SupplyChainManagment.deployed();
        const block11 = scInstance.createSpare("test11","test11","test11", {from: accounts[0]});
        const block12 = scInstance.createSpare("test12","test12","test12", {from: accounts[0]});

        const itemHash11 = web3.utils.soliditySha3(web3.utils.fromAscii("test11"), accounts[0]);
        const itemHash12 = web3.utils.soliditySha3(web3.utils.fromAscii("test12"), accounts[0]);

        const carBlock = scInstance.createProduct("car1","car1","car1",[itemHash11, itemHash12], {from: accounts[0]});
        const carHash = web3.utils.soliditySha3(web3.utils.fromAscii("car1"), accounts[0]);
        const owner = await scInstance.products.call(carHash);
        assert.equal(accounts[0], owner.manufacturer);
    });

    // it('should add Product to inventory', async () => {
    //     const scInstance = await SupplyChainManagment.deployed();
    //     const block11 = scInstance.createSpare("test21","test21","test21", {from: accounts[0]});
    //     const block12 = scInstance.createSpare("test22","test22","test22", {from: accounts[0]});
        
    //     const itemHash11 = web3.utils.soliditySha3(web3.utils.fromAscii("test21"), accounts[0]);
    //     const itemHash12 = web3.utils.soliditySha3(web3.utils.fromAscii("test22"), accounts[0]);
       
        
    //     const inventoryBlock11 = await scInstance.addSpareToInventory(itemHash11,{ from: accounts[0] } );
    //     const inventoryBlock12 = await scInstance.addSpareToInventory(itemHash12,{ from: accounts[0] } );

    //     const carBlock = scInstance.createProduct("car4","car4","car4",[itemHash11, itemHash12], {from: accounts[0]});
    //     const carHash = web3.utils.soliditySha3(web3.utils.fromAscii("car4"), accounts[0]);

    //     const owner = await scInstance.products.call(carHash);

    //     assert.equal(accounts[0], owner.manufacturer);
    // });

    it('should give the spares of product', async () => {
        const scInstance = await SupplyChainManagment.deployed();
        const block11 = scInstance.createSpare("test31","test31","test31", {from: accounts[0]});
        const block12 = scInstance.createSpare("test32","test32","test32", {from: accounts[0]});
        
        const itemHash11 = web3.utils.soliditySha3(web3.utils.fromAscii("test31"), accounts[0]);
        const itemHash12 = web3.utils.soliditySha3(web3.utils.fromAscii("test32"), accounts[0]);

        const carBlock = await scInstance.createProduct("car3","car3","car3",[itemHash11, itemHash12], {from: accounts[0]});
        const carHash = web3.utils.soliditySha3(web3.utils.fromAscii("car3"), accounts[0]);

        const spares = await scInstance.getParts(carHash, {from: accounts[0]})
        const owner = await scInstance.products.call(carHash);
        assert.isNotNull(spares);
    });

    // it('should transfer the product along with spare parts', async () => {
    //     const scInstance = await SupplyChainManagment.deployed();
    //     const carHash = web3.utils.soliditySha3(web3.utils.fromAscii("car3"), accounts[0]);
    //     await scInstance.tranferPrdRights(carHash, accounts[4], {from: accounts[0]});
    //     let newOwner = await scInstance.prdsInventory(carHash, {from: accounts[4]});
    //     const spares = await scInstance.getParts(carHash, {from: accounts[0]});
    //     const spr1Owner = await scInstance.spareParts(spares[0], {from: accounts[4]});
    //     assert(newOwner, accounts[4]);
    //     assert(spr1Owner, accounts[4]);
    // });

});


contract("SND Order test", async accounts => {
    let scC
    let orderC
    beforeEach(async function() {
        scC = await SupplyChainManagment.new({ from: accounts[0] })
        orderC = await OrderManagment.new(scC.address, { from: accounts[0] })
    })

    it("contracts should be available" , () => {
        //contract instance shd we available
        assert.isNotNull(scC);
        assert.isNotNull(orderC);
    });

    it("should add the spare part to the inventory", async () => {
        //create spare and add to the inventory        
        await scC.createSpare("123", "wheel", "21432", { from: accounts[0] })
        let itemhash = web3.utils.soliditySha3(web3.utils.fromAscii("21432"), accounts[0])
        await orderC.addSpareToInventory(itemhash, { from: accounts[0]});

        //check the spare part owner 
        result = await orderC.sparePartsInventory.call(itemhash,{ from: accounts[0] });
        assert.equal(result, accounts[0])
    });

    it("should add the product to the inventory", async () => {

        //create spare and add to the inventory
        await scC.createSpare("123", "wheel", "21432", { from: accounts[0] })
        let sparehash = web3.utils.soliditySha3(web3.utils.fromAscii("21432"), accounts[0])
        await scC.createProduct("123", "123", "123", [sparehash], { from: accounts[0] })

        //create prd and add to the inventory
        let prdhash = web3.utils.soliditySha3(web3.utils.fromAscii("123"), accounts[0])
        await orderC.addProductToInventory(prdhash, { from: accounts[0]});

        //check the prd owner which is fetched from inventory
        result = await orderC.prdsInventory.call(prdhash,{ from: accounts[0] });
        assert.equal(result, accounts[0])
    });

    it("should transfer the spare parts rights", async () => {

        //create spare and add to the inventory
        await scC.createSpare("123", "wheel", "21432", { from: accounts[0] })
        let sparehash = web3.utils.soliditySha3(web3.utils.fromAscii("21432"), accounts[0])
        await orderC.addSpareToInventory(sparehash, { from: accounts[0]});

        //transfer the spare part to the given address
        orderC.tranferSparePartRights(sparehash, accounts[1], {from: accounts[0]});

        //get the spre part and asser tof the owner ship
        result = await orderC.sparePartsInventory.call(sparehash,{ from: accounts[0] });
        assert.equal(result, accounts[1]);
    });

    it("should transfer the product and spare parts rights", async () => {

        //create spare and add to the inventory
        await scC.createSpare("123", "wheel", "21432", { from: accounts[0] })
        let sparehash = web3.utils.soliditySha3(web3.utils.fromAscii("21432"), accounts[0])
        await orderC.addSpareToInventory(sparehash, { from: accounts[0]});

        //crate prd and add to inventory
        await scC.createProduct("123", "123", "123", [sparehash], { from: accounts[0] })
        let prdhash = web3.utils.soliditySha3(web3.utils.fromAscii("123"), accounts[0])
        await orderC.addProductToInventory(prdhash, { from: accounts[0]});


        //transfer the prd and spare part to the given address
        orderC.tranferPrdRights(prdhash, accounts[1], {from: accounts[0]});

        //get the spre part and asser tof the owner ship
        result = await orderC.prdsInventory.call(prdhash,{ from: accounts[0] });
        assert.equal(result, accounts[1]);
    });

});