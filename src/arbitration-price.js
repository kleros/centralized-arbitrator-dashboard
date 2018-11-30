import PropTypes from 'prop-types'
import React from 'react'
import {
  centralizedArbitratorInstance,
  getArbitrationCost,
  getDispute,
  getDisputeStatus,
  getOwner,
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
        centralizedArbitratorInstance(this.props.contractAddress),
        ''
      )
    })
  }

  async componentDidUpdate(prevProps) {
    if (
      this.props.contractAddress != prevProps.contractAddress ||
      this.props.activeWallet != prevProps.activeWallet
    )
      this.setState({
        arbitrationCost: await getArbitrationCost(
          centralizedArbitratorInstance(this.props.contractAddress),
          ''
        )
      })
  }

  setArbitrationCost = async newCost => {
    this.setState({ arbitrationCost: 'awaiting...' })
    await setArbitrationPrice(newCost)
    const arbitrationCost = await getArbitrationCost(
      centralizedArbitratorInstance(this.props.contractAddress),
      ''
    )
    this.setState({ arbitrationCost })
  }

  handleSetArbitrationPriceButtonClick = newCost => async e => {
    const centralizedArbitrator = centralizedArbitratorInstance(
      this.props.contractAddress
    )
    e.preventDefault()
    this.setState({ arbitrationCost: 'awaiting...' })
    await setArbitrationPrice(
      this.props.activeWallet,
      centralizedArbitrator,
      newCost
    )
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
            onChange={this.handleArbitrationPriceChange()}
            type="text"
            value={this.state.arbitrationCost}
          />
          <input className="primary" type="submit" value="Change Price" />{' '}
          {/* Why not a button but an input? */}
        </label>
      </form>
    )
  }
}

export default ArbitrationPrice
