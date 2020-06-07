const Web3 = require('web3');

const checkInit =  () => {
    let web3Lib = null;
    const init = async function(){
        try {
            if(web3Lib){
                return web3Lib;
            }
            else if(!web3Lib && 'ethereum' in window) {
                await window.ethereum.enable();
                web3Lib = new Web3(window.web3.currentProvider);
                return web3Lib;
            }
        }catch (error) {
            web3Lib = null;
        }
    };
    return init;
};


//checkInit() 
const Web3Utils = {
    init: ( () =>  checkInit())()
}
export default Web3Utils;