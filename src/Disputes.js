import React from 'react';
import centralizedArbitrator from './ethereum/centralizedArbitrator'

class Disputes extends React.Component {
  constructor(props) {
    super(props)
    this.state = {owner: ""}
  }
  async componentDidMount(){
    console.log(centralizedArbitrator)
    const owner = await centralizedArbitrator.methods.owner().call()
    this.setState({owner});
  }

  render() {
    return <div>The owner is: {this.state.owner}</div>
  }
}

export default Dashboard
