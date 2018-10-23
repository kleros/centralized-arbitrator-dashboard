import web3 from './ethereum/web3'
import React from 'react';
import {instance, getOwner, getArbitrationCost, getDispute, setArbitrationPrice, disputeCreationEvent} from './ethereum/centralizedArbitrator'
import Disputes from './Disputes'

class Dashboard extends React.Component {
  constructor() {
    super()
    this.state = {
      owner: "",
      arbitrationCost: "",
      disputes: []
    }
  }
  async componentDidMount(){
    const owner = await getOwner()
    const arbitrationCost = await getArbitrationCost("")
    this.setState({owner, arbitrationCost})

    // let disputes = await Promise.all([0,1,2,3,4].map(async x => getDispute(x)))
    // for(let key = 0; key < 5; key++){
    //   disputes[key].key = key
    // }
    // console.log(disputes)
    // this.setState({disputes})

    let result
    instance.events.DisputeCreation()
    .on('data', (event) => {
        console.log(event); // same results as the optional callback above
        this.updateDisputes(event)
    })
    .on('changed', function(event){
        // remove event from local database
    })
    .on('error', console.error);


  }

  updateDisputes = (event) => {
    let disputes = this.state.disputes
    disputes.push({key: event.returnValues._disputeID, arbitrable: event.returnValues._arbitrable})
    this.setState({disputes: disputes})
  }

  setArbitrationCost = async (newCost) => {
    this.setState({arbitrationCost: "awaiting..."})
    await setArbitrationPrice(newCost)
    const arbitrationCost = await getArbitrationCost("")
    this.setState({arbitrationCost})
  }


  render() {
    return (
      <div>
        <label>
          Owner: {this.state.owner}
        </label>

        <form onSubmit={(e) => {e.preventDefault();this.setArbitrationCost(this.state.arbitrationCost)}} >
          <label>
            Arbitration cost: <input type="text" value={this.state.arbitrationCost} onChange={(e) => {this.setState({arbitrationCost: e.target.value})}} />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <Disputes items={this.state.disputes}/>
      </div>
    )
  }
}

export default Dashboard
