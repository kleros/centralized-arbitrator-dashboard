import {
  centralizedArbitratorInstance,
  getArbitrationCost,
  setArbitrationPrice
} from '../ethereum/centralized-arbitrator'
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
    const { contractAddress, web3 } = this.props

    this.setState({
      arbitrationCost: web3.utils.fromWei(
        await getArbitrationCost(
          centralizedArbitratorInstance(contractAddress),
          ''
        ),
        'ether'
      )
    })
  }

  async componentDidUpdate(prevProps) {
    const { activeWallet, contractAddress, web3 } = this.props

    if (
      contractAddress !== prevProps.contractAddress ||
      activeWallet !== prevProps.activeWallet
    )
      this.setState({
        arbitrationCost: web3.utils.fromWei(
          await getArbitrationCost(
            centralizedArbitratorInstance(contractAddress),
            ''
          ),
          'ether'
        )
      })
  }

  handleSetArbitrationPriceButtonClick = newCost => async e => {
    const { activeWallet, contractAddress, web3 } = this.props

    const centralizedArbitrator = centralizedArbitratorInstance(contractAddress)
    e.preventDefault()
    this.setState({ arbitrationCost: 'awaiting...' })
    await setArbitrationPrice(
      activeWallet,
      centralizedArbitrator,
      web3.utils.toWei(newCost, 'ether')
    )
    const arbitrationCost = web3.utils.fromWei(
      await getArbitrationCost(centralizedArbitrator, ''),
      'ether'
    )
    this.setState({ arbitrationCost })
  }

  handleArbitrationPriceChange = () => e => {
    console.log(e)
    this.setState({ arbitrationCost: e.target.value })
  }

  render() {
    const { arbitrationCost } = this.state
    return (
      <div className="input-group mb-3">
        <div className="input-group-append">
          <label className="input-group-text" id="">
            Arbitration Price (ETH)
          </label>
        </div>
        <input
          aria-describedby="basic-addon"
          aria-label=""
          className="form-control"
          onChange={this.handleArbitrationPriceChange()}
          placeholder="Arbitration Price"
          type="text"
          value={arbitrationCost}
        />
        <div className="input-group-prepend">
          <button
            className="btn btn-primary primary"
            onClick={this.handleSetArbitrationPriceButtonClick(arbitrationCost)}
            type="button"
          >
            Change Price
          </button>
        </div>
      </div>
    )
  }
}

ArbitrationPrice.propTypes = {
  activeWallet: PropTypes.string.isRequired,
  contractAddress: PropTypes.string.isRequired
}

export default ArbitrationPrice
