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
      <div className="input-group mb-3">
        <div className="input-group-append">
          <label className="input-group-text" id="">
            Arbitration Price
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
  contractAddress: PropTypes.string.isRequired
}

export default ArbitrationPrice
