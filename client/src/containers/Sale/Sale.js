import React, { Component } from 'react';
import './Sale.css';

export default class Sale extends Component {
    state = {
        history: null,
        selectedItem: null,
        toAddr: '',
        parts: [],
    }

    async componentDidMount() {
        const parts = await this.getParts();
        this.setState({ parts });
    }


    getParts = async () => {
        let data = [];
        let latestItem = null;
        data = await this.props.OrderContract.getPastEvents('ChangeInPartOwner',
            { filter: { account: this.props.address }, fromBlock: 0, toBlock: 'latest' }
        )
        return data;
    }



    selectSparePart = async (item) => {
        const inventoryOwner = await this.props.OrderContract.methods.sparePartsInventory(item).call({ from: this.props.account })
        if (inventoryOwner == this.props.address)
            this.setState({ toAddr: '', selectedItem: item });
        else
            alert('Spare part is not with this account');
    }

    onDataChange = (event) => {
        event.preventDefault();
        const value = event.currentTarget.value;
        this.setState({ toAddr: value })
    }

    sale = async () => {
        let rigths = await this.props.OrderContract.methods.tranferSparePartRights(this.state.selectedItem, this.state.toAddr).send({ from: this.props.address });
        const parts = await this.getParts();
                
        this.setState({ history: null, selectedItem: null, toAddr: '',parts });
    }

    getHistory = async (itemHash) => {
        this.setState({history: null});
        const itemDtls = await this.props.SCContract.methods.spareParts(itemHash).call({ from: this.props.address });
        const itemHistory = await this.props.OrderContract.getPastEvents("ChangeInPartOwner", { filter: { itemIndex: itemHash }, fromBlock: 0, toBlock: 'latest' });

        const historyObj = {
            of: itemHash,
            accounts: itemHistory.map(item => item.returnValues.account),
            info: {
                partName: itemDtls.partName,
                partType: itemDtls.partType,
                uniqueNumber: itemDtls.uniqueNumber,
                manufacturer: itemDtls.manufacturer
            }
        }

        this.setState({ history: historyObj })
        //console.log(historyObj);
    }

    render() {
        return (
            <div className='sales'>

                <div className='parts-grid'>
                    <div className='sale-header'>
                        <h4>Spare Parts</h4>
                    </div>
                    <div className="content">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Spare Part</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.parts.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{item.returnValues.itemIndex}</td>
                                            <td className="actionItems">
                                                <i onClick={() => this.selectSparePart(item.returnValues.itemIndex)} className="fas fa-paper-plane"></i>
                                                <i onClick={() => this.getHistory(item.returnValues.itemIndex)} className="fas fa-history"></i>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>



                <h3>{this.state.selectedItem ? `# ${this.state.selectedItem}` : null}</h3>
                <div className='send-container' >
                    <div className="form-row">
                        <form>
                            <div className="form-group">
                                <div className="addr-element"><span className='addr'>@</span><input onChange={(event) => this.onDataChange(event, 'to')} type="text" className="form-control" name="to" value={this.state.toAddr} placeholder="To Address" /></div>
                            </div>
                        </form>
                        <button disabled={!this.state.selectedItem} onClick={this.sale} className="btn btn-success" ><i className="fas fa-paper-plane"></i></button>

                    </div>
                    <div className="accounts">

                    </div>
                </div>

                {this.state.history ?
                    <div className="history">
                        <h5>History of <span className="hash thm-col">#{this.state.history.of}</span></h5>    
                        <div className="info">
                            {Object.keys(this.state.history.info).map(key => {
                                return (
                                <div className='info-item'>
                                    <span className="key thm-col">{key} : </span>
                                    <span>{this.state.history.info[key]}</span>
                                </div>
                                );
                            })}
                        </div>
                        <div className="accounts">
                            <h5>Accounts</h5>
                            {this.state.history.accounts.map(acc => {
                                return (
                                    <div className={this.props.address == acc ? 'current-account' : null }>{acc}</div>
                                );
                            })}
                        </div>
                    </div>
                    : null
                }
            </div>
        );
    }
}