import React, { Component } from 'react';
import "./Products.css";

export default class Product extends Component {
    state = {
        prdForm: {
            prdName: '',
            prdType: '',
            uniqueNumber: '',
            spareParts: [],
        }
    };

    onDataChange = (event, control, index = undefined) => {
        event.preventDefault();
        const value = event.currentTarget.value;
        const state = { ...this.state };
        const formData = { ...state.prdForm }
        if(index == undefined)
            formData[control] = value;
        else {
            formData[control][index] = value;
        }    
        this.setState({ prdForm: formData })
    }

    submitSpare = async (event) => {
        event.preventDefault();
        await this.props.SCContract.methods.createProduct(this.state.prdForm.prdName, this.state.prdForm.prdType, this.state.prdForm.uniqueNumber, this.state.prdForm.spareParts).send({ from: this.props.address});
        const itemHash = this.props.web3.utils.soliditySha3(this.props.web3.utils.fromAscii(this.state.prdForm.uniqueNumber), this.props.address);
        await this.props.OrderContract.methods.addProductToInventory(itemHash).send({ from: this.props.address})
    }

    actionOnSpare = (event, action) => {
        event.preventDefault();
        const form = { ...this.state.prdForm , spareParts: [...this.state.prdForm.spareParts]}
        if(action == 'add')
            form.spareParts.push('');
        else 
        form.spareParts.pop();
        this.setState({prdForm: form});
    }

    render() {
        return (
            <div className='create'>
                <h3 className="title"> Create Product </h3>
                <form >
                    <div className="form-group">
                        <label >Product Name</label>
                        <input type="text" className="form-control" onChange={(event) => this.onDataChange(event, 'prdName')} value={this.state.prdForm.prdName} name="partName" placeholder="Product Name" />
                    </div>
                    <div className="form-group">
                        <label >Product Type</label>
                        <input type="text" className="form-control" onChange={(event) => this.onDataChange(event, 'prdType')} value={this.state.prdForm.prdType} name="partType" placeholder="Product Type" />
                    </div>
                    <div className="form-group">
                        <label >Product Number</label>
                        <input type="text" className="form-control" onChange={(event) => this.onDataChange(event, 'uniqueNumber')} value={this.state.prdForm.uniqueNumber} name="uniqueNumber" placeholder="Product Number" />
                    </div>
                    {this.state.prdForm.spareParts.map((value, index) => {

                        return (
                                <div className="form-group">
                                    <label >{`Spare Part Number ${index+1}`}</label>
                                    <input type="text" className="form-control" onChange={(event) => this.onDataChange(event, 'spareParts', index)} value={this.state.prdForm.spareParts[index]} name={`spare_${index}`} placeholder={`Spare Part ${index+1}`} />
                                </div>
                        );
                    })}
                    
                    <div className="actions"><button onClick={ (event) => this.actionOnSpare(event, 'add') } className="btn btn-success">Add</button><button onClick={ (event) => this.actionOnSpare(event, 'remove') } className="btn btn-success">Remove</button></div>

                </form>
                <button onClick={this.submitSpare} type="submit" className="btn btn-success" >Submit</button>
            </div>

        );
    }
}