import {
  centralizedArbitratorInstance,
  getArbitrationCost,
  setArbitrationPrice
} from './ethereum/centralized-arbitrator'
import PropTypes from 'prop-types'
import React from 'react'

class ArbitrationPrice extends React.Component {
  constructor(props) {
    super(props)
    console.log('ARBITRATIONPRICE PROPS')
    console.log(props)
    this.state = {
      arbitrationCost: 'Fetching...'
    }
  }

  async componentDidMount() {
    const { contractAddress } = this.props

    this.setState({
      arbitrationCost: await getArbitrationCost(
        centralizedArbitratorInstance(contractAddress),
        ''
      )
    })
  }

  async componentDidUpdate(prevProps) {
    const { activeWallet, contractAddress } = this.props

    if (
      contractAddress !== prevProps.contractAddress ||
      activeWallet !== prevProps.activeWallet
    )
      this.setState({
        arbitrationCost: await getArbitrationCost(
          centralizedArbitratorInstance(contractAddress),
          ''
        )
      })
  }

  setArbitrationCost = async newCost => {
    const { contractAddress } = this.props

    this.setState({ arbitrationCost: 'awaiting...' })
    await setArbitrationPrice(newCost)
    const arbitrationCost = await getArbitrationCost(
      centralizedArbitratorInstance(contractAddress),
      ''
    )
    this.setState({ arbitrationCost })
  }

  handleSetArbitrationPriceButtonClick = newCost => async e => {
    const { activeWallet, contractAddress } = this.props

    const centralizedArbitrator = centralizedArbitratorInstance(contractAddress)
    e.preventDefault()
    this.setState({ arbitrationCost: 'awaiting...' })
    await setArbitrationPrice(activeWallet, centralizedArbitrator, newCost)
    const arbitrationCost = await getArbitrationCost(centralizedArbitrator, '')
    this.setState({ arbitrationCost })
  }

  handleArbitrationPriceChange = () => e => {
    console.log(e)
    this.setState({ arbitrationCost: e.target.value })
  }

  render() {
    const { arbitrationCost } = this.state
    return (
      <form
        onSubmit={this.handleSetArbitrationPriceButtonClick(arbitrationCost)}
      >
        <label>
          Arbitration Price:{' '}
          <input
            onChange={this.handleArbitrationPriceChange()}
            type="text"
            value={arbitrationCost}
          />
          <input className="primary" type="submit" value="Change Price" />{' '}
          {/* Why not a button but an input? */}
        </label>
      </form>
    )
  }
}

ArbitrationPrice.propTypes = {
  contractAddress: PropTypes.string.isRequired
}

export default ArbitrationPrice
