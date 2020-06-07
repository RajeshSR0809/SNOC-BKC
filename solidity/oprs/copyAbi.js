const fs = require('fs');

const abis = ['SupplyChainManagment', 'OrderManagment'];
for(let i=0; i<abis.length; i++){
    fs.copyFile(`../build/contracts/${abis[i]}.json`, `../../reactbkc/reactbkc_v2/src/contracts/${abis[i]}.json`, (e,d) => {
        if(e){
            console.error(e)     
        }
    });
    
}

