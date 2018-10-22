import React from 'react';
import {getOwner, getArbitrationCost, setArbitrationPrice} from './ethereum/centralizedArbitrator'

class Dashboard extends React.Component {
  constructor() {
    super()
    this.state = {owner: "", arbitrationCost: ""}
  }
  async componentDidMount(){
    const owner = await getOwner()
    const arbitrationCost = await getArbitrationCost("")
    this.setState({owner, arbitrationCost})
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
      </div>
    )
  }
}

export default Dashboard
