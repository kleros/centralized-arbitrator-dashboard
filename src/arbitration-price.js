import PropTypes from 'prop-types'
import React from 'react'

import {
  arbitratorInstance,
  getOwner,
  getArbitrationCost,
  getDispute,
  getDisputeStatus,
  setArbitrationPrice
} from './ethereum/centralized-arbitrator'

class ArbitrationPrice extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      arbitrationCost: 'Fetching...'
    }
  }

  async componentDidMount() {
    this.setState({
      arbitrationCost: await getArbitrationCost(
        arbitratorInstance(this.props.contractAddress),
        ''
      )
    })
  }

   static getDerivedStateFromProps (nextProps, prevState) {
    console.log("prop change")
    if(nextProps.selectedAddress != prevState.selectedAddress)
    {
      return {
        selectedAddress: nextProps.selectedAddress
      };
    }
  }

  async componentDidUpdate(prevProps) {
    if(this.props.contractAddress != prevProps.contractAddress)
    {
      this.setState({
        arbitrationCost: await getArbitrationCost(
          arbitratorInstance(this.props.contractAddress),
          ''
        )
      })
    }
}

  setArbitrationCost = async newCost => {
    this.setState({ arbitrationCost: 'awaiting...' })
    await setArbitrationPrice(newCost)
    const arbitrationCost = await getArbitrationCost(
      arbitratorInstance(this.props.contractAddress),
      ''
    )
    this.setState({ arbitrationCost })
  }

  handleSetArbitrationPriceButtonClick = newCost => async e => {
    const centralizedArbitrator = arbitratorInstance(this.props.contractAddress)
    e.preventDefault()
    this.setState({ arbitrationCost: 'awaiting...' })
    await setArbitrationPrice(centralizedArbitrator, newCost)
    const arbitrationCost = await getArbitrationCost(centralizedArbitrator, '')
    this.setState({ arbitrationCost })
  }

  handleArbitrationPriceChange = () => e => {
    console.log(e)
    this.setState({ arbitrationCost: e.target.value })
  }

  render() {
    return (
      <form
        onSubmit={this.handleSetArbitrationPriceButtonClick(
          this.state.arbitrationCost
        )}
      >
        <label>
          Arbitration Price:{' '}
          <input
            type="text"
            value={this.state.arbitrationCost}
            onChange={this.handleArbitrationPriceChange()}
          />
          <input className="primary" type="submit" value="Change Price" />
        </label>
      </form>
    )
  }
}

export default ArbitrationPrice
