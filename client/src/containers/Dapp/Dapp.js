import React, { Component } from 'react';
import './Dapp.css';

import { Switch,  Route} from 'react-router-dom';

import Spare from '../../containers/Spare/Spare';
import Product from '../../containers/Products/Products';
import Sale from '../../containers/Sale/Sale';
import Contact from '../../containers/Contact/Contact';
import ProductSale from '../../containers/ProductSale/ProductSale';

import Web3Utils from '../../utils/web3';
import data from '../../contracts/SupplyChainManagment.json'
import orderJSON from '../../contracts/OrderManagment.json';
import contractAddress from '../../contracts/address.json'

class Dapp extends Component {
    state = {
        address: null
    };

    constructor(props){
        super(props)
        
        this.abi = data['abi'];
        this.orderABI = orderJSON['abi'];

        this.SCAddress = data.networks['5777'].address;
        this.orderAddress = orderJSON.networks['5777'].address;
    }
    proxiedWeb3 = null;
    SCContract = null;
    OrderContract= null;
    abi = [];
    orderABI = [];
    SCAddress = null;
    orderAddress = null;

    async componentDidMount(){
        this.proxiedWeb3 = await Web3Utils.init();
        const accounts = await this.proxiedWeb3.eth.getAccounts();
        const address = accounts[0];
        this.SCContract =  new this.proxiedWeb3.eth.Contract(this.abi , this.SCAddress , {from: address});
        this.OrderContract =  new this.proxiedWeb3.eth.Contract(this.orderABI , this.orderAddress , {from: address});
        window.ethereum.on('accountsChanged', function (accounts) {
            window.location.reload();
        });
        this.setState({address})
    }
    render(){
        return (
        <Switch>
            <Route exact path="/spare" render={() => <Spare address={this.state.address} OrderContract={this.OrderContract} SCContract={this.SCContract} web3={this.proxiedWeb3}></Spare>}></Route>
            <Route exact path="/product" render={() => <Product address={this.state.address} OrderContract={this.OrderContract} SCContract={this.SCContract} web3={this.proxiedWeb3}></Product>}></Route>
            <Route exact path="/sale" render={() => <Sale address={this.state.address} OrderContract={this.OrderContract} SCContract={this.SCContract} web3={this.proxiedWeb3}></Sale>} ></Route>
            <Route exact path="/prdSale" render={() => <ProductSale address={this.state.address} OrderContract={this.OrderContract} SCContract={this.SCContract} web3={this.proxiedWeb3}></ProductSale>} ></Route>
            {/* <Route exact path="/contact" component={Contact}></Route> */}
        </Switch>

        );
    }
}

export default Dapp;