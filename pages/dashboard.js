import React from 'react';
import centralizedArbitrator from '../ethereum/centralizedArbitrator'

class Dashboard extends React.Component {
  static async getInitialProps() {
    const owner = await centralizedArbitrator.methods.owner().call()
    console.log(owner)
    return {owner}
  }
  async componentDidMount(){

  }

  render() {
    return <div>The owner is: {this.props.owner}</div>
  }
}

export default Dashboard
