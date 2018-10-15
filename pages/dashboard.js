import React from 'react';
import CentralizedArbitrator from '../ethereum/centralizedArbitrator'

class Dashboard extends React.Component {
  async componentDidMount(){
    const owner = await CentralizedArbitrator.owner()
    console.log(owner)
  }

  render() {
    return <div>Dashboard</div>
  }
}

export default Dashboard
