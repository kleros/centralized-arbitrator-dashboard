import Archon from '@kleros/archon'
import EvidenceList from './evidence-list'
import Identicon from './identicon.js'
import PropTypes from 'prop-types'
import React from 'react'
import _ from 'lodash'
import {
  giveRuling,
  giveAppealableRuling
} from '../ethereum/auto-appealable-arbitrator'
import web3 from '../ethereum/web3'
import TimeAgo from 'react-timeago'

class DisputeDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      appealable: true,
      appealFee: 0.1,
      timeToAppeal: 240
    }
  }

  handleGiveRulingButtonClick = (account, instance, id, ruling) => () => {
    console.log(ruling)
    if (this.state.appealable)
      giveAppealableRuling(
        account,
        instance,
        id,
        ruling,
        web3.utils.toWei(this.state.appealFee.toString(), 'ether'),
        this.state.timeToAppeal
      )
    /* Why don't we await? */ else
      giveRuling(account, instance, id, ruling) /* Why don't we await? */
  }

  handleAppealableRulingCheckboxClick = () => () => {
    console.log('handlecheckbox')
    this.setState(prevState => ({ appealable: !prevState.appealable }))
  }

  handleTimeToAppealChange = () => e => {
    console.log('handletimetoappeal')
    this.setState({ timeToAppeal: e.target.value })
  }

  handleAppealFeeChange = () => e => {
    console.log('handleAppealFeeChange')
    this.setState({ appealFee: e.target.value })
  }

  renderedRulingOptions = (
    options,
    activeWallet,
    centralizedArbitratorInstance,
    id
  ) =>
    _.zip(options.titles, options.descriptions).map((option, key) => (
      <div className="col">
        <button
          className="btn btn-primary btn-lg primary "
          key={key + 1}
          onClick={this.handleGiveRulingButtonClick(
            activeWallet,
            centralizedArbitratorInstance,
            id,
            key + 1
          )}
        >
          {option[0]}
        </button>
      </div>
    ))

  render() {
    console.log('PRERENDER DISPUTEDETAIL')
    console.log(this.props)
    const {
      activeWallet,
      aliases,
      archon,
      category,
      centralizedArbitratorInstance,
      description,
      evidences,
      fileURI,
      fileHash,
      fileValid,
      id,
      ipfsGateway,
      metaEvidenceJSONValid,
      question,
      rulingOptions,
      title
    } = this.props

    console.log(this.state)
    return (
      <div className="container">
        <div className="row p-0">
          <div className="col p-0">
            <h3 className="float-left">
              <b>{`${title}`}</b>
            </h3>
          </div>
          <div className="col p-0">
            <h3 className="float-right">
              <b>{`${category}`}</b>
            </h3>
          </div>
        </div>
        <br />
        <div className="row p-0">
          <div className="col p-0 text-left">
            <h4 className="">{description}</h4>
          </div>
        </div>
        <br />
        <div className="row border p-3" id="fileURICard">
          <div className="col-md-1">
            <a
              href={ipfsGateway + fileURI}
              rel="noopener noreferrer"
              target="_blank"
            >
              <img alt="" src="text.svg" />
            </a>
          </div>

          {(!fileValid || !metaEvidenceJSONValid) && (
            <div className="col-md-2">
              <div className="row">
                <div className="col-md-8 py-2 ">
                  <h6 className="">Integrity Broken!</h6>
                </div>
                <div className="col-md-3 ">
                  <img className="" src="warning.svg" />
                </div>
                <div className="offset-md-1" />
              </div>
            </div>
          )}
        </div>

        <br />
        {aliases && (
          <div className="row">
            <div className="col-md-6 p-0" key={Object.keys(aliases)[0]}>
              <div className="col-md-11 border">
                <EvidenceList
                  address={Object.keys(aliases)[0]}
                  aliases={aliases}
                  archon={archon}
                  evidences={evidences[Object.keys(aliases)[0]]}
                  ipfsGateway={ipfsGateway}
                  name={aliases[Object.keys(aliases)[0]]}
                />
              </div>
            </div>

            <div className="col-md-6 p-0" key={Object.keys(aliases)[1]}>
              <div className="offset-md-1 col-md-11 border">
                <EvidenceList
                  address={Object.keys(aliases)[1]}
                  aliases={aliases}
                  archon={archon}
                  evidences={evidences[Object.keys(aliases)[1]]}
                  ipfsGateway={ipfsGateway}
                  name={aliases[Object.keys(aliases)[1]]}
                />
              </div>
            </div>
          </div>
        )}
        <br />

        {this.props.status == 0 && (
          <div>
            <div className="row" id="appealable-ruling">
              <div className="col">
                <input
                  type="checkbox"
                  aria-label="Checkbox for following text input"
                  defaultChecked={this.state.appealable}
                  onClick={this.handleAppealableRulingCheckboxClick()}
                />
                <label>Give an appealable ruling</label>
              </div>
            </div>
            {this.state.appealable && (
              <>
                <div className="row border background-shade mb-5 pt-3">
                  <div className="col-4 offset-1">
                    <div className="input-group input-group-sm mb-3">
                      <div className="input-group-prepend">
                        <span
                          className="input-group-text background-shade border-0"
                          id="inputGroup-sizing-sm"
                        >
                          Appeal Fee(ETH)
                        </span>
                      </div>
                      <input
                        type="number"
                        className="form-control"
                        aria-label="Small"
                        aria-describedby="inputGroup-sizing-sm"
                        value={this.state.appealFee}
                        onChange={this.handleAppealFeeChange()}
                      />
                    </div>
                  </div>
                  <div className="col-2">
                    <hr
                      className="mt-0"
                      style={{
                        width: '1px',
                        height: '30px',
                        background: '#CCCCCC',
                        border: 'none'
                      }}
                    />
                  </div>
                  <div className="col-4">
                    <div className="input-group input-group-sm mb-3">
                      <div className="input-group-prepend">
                        <span
                          className="input-group-text background-shade border-0"
                          id="inputGroup-sizing-sm"
                        >
                          Time to Appeal(Seconds)
                        </span>
                      </div>
                      <input
                        type="number"
                        className="form-control"
                        aria-label="Small"
                        aria-describedby="inputGroup-sizing-sm"
                        value={this.state.timeToAppeal}
                        onChange={this.handleTimeToAppealChange()}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="row">
              <div className="col">
                <h4 className="">{question}</h4>
              </div>
            </div>
            <br />
            <div className="row">
              <div className="offset-md-2 col-md-3">
                <button
                  className="btn btn-primary btn-lg btn-block primary"
                  onClick={this.handleGiveRulingButtonClick(
                    activeWallet,
                    centralizedArbitratorInstance,
                    id,
                    1
                  )}
                >
                  {rulingOptions && rulingOptions.titles[0]}
                </button>
              </div>
              <div className="col-md-2">X</div>
              <div className="col-md-3">
                <button
                  className="btn btn-primary btn-lg btn-block primary"
                  onClick={this.handleGiveRulingButtonClick(
                    activeWallet,
                    centralizedArbitratorInstance,
                    id,
                    2
                  )}
                >
                  {rulingOptions && rulingOptions.titles[1]}
                </button>
              </div>
            </div>
            <br />
            <div className="row">
              <div className="offset-md-4 col-md-4 mb-5">
                <button
                  className="btn btn-primary btn-lg btn-block secondary"
                  onClick={this.handleGiveRulingButtonClick(
                    activeWallet,
                    centralizedArbitratorInstance,
                    id,
                    0
                  )}
                >
                  {rulingOptions && `Refuse to Arbitrate`}
                </button>
              </div>
            </div>
          </div>
        )}

        {this.props.status == 1 && (
          <div className="row">
            <div className="col">
              <h1>
                <b>
                  {' '}
                  You voted for{' '}
                  {this.props.ruling &&
                    aliases[Object.keys(aliases)[this.props.ruling - 1]]}{' '}
                </b>
              </h1>
              {this.props.appealPeriodEnd * 1000 < new Date().getTime() && (
                <h1>Appeal period is over.</h1>
              )}
              {this.props.appealPeriodEnd * 1000 > new Date().getTime() && (
                <h1>
                  The case can still be appealable until{' '}
                  <TimeAgo date={this.props.appealPeriodEnd * 1000} />
                </h1>
              )}
            </div>
          </div>
        )}

        {this.props.status == 2 && (
          <div className="row">
            <div className="col">
              <h1>
                <b>
                  {this.props.ruling &&
                    aliases[Object.keys(aliases)[this.props.ruling - 1]]}{' '}
                  won
                </b>
              </h1>
              <h1>The case is closed</h1>
            </div>
          </div>
        )}
      </div>
    )
  }
}

DisputeDetail.propTypes = {
  activeWallet: PropTypes.string.isRequired,
  aliases: PropTypes.arrayOf(PropTypes.string).isRequired,
  archon: PropTypes.instanceOf(Archon).isRequired,
  category: PropTypes.number.isRequired,
  centralizedArbitratorInstance: PropTypes.instanceOf(web3.eth.Contract)
    .isRequired,
  description: PropTypes.string.isRequired,
  evidences: PropTypes.arrayOf(PropTypes.string).isRequired,
  fileURI: PropTypes.string.isRequired,
  fileValid: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  ipfsGateway: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
  rulingOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired
}

export default DisputeDetail
