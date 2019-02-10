import Evidence from './evidence'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Identicon from './identicon.js'

import PropTypes from 'prop-types'
import React from 'react'

class EvidenceList extends React.Component {
  constructor(props) {
    super(props)
    console.log('EVIDENCELISTPROPS')
    console.log(props)
  }
  evidences = (evidences, ipfsGateway) => {
    const items = evidences.map(item => (
      <Evidence
        description={item && item.evidenceJSON.description}
        evidenceJSONValid={item && item.evidenceJSONValid}
        fileHash={item && item.evidenceJSON.fileHash}
        fileURI={item && item.evidenceJSON.fileURI}
        fileValid={item && item.fileValid}
        ipfsGateway={ipfsGateway}
        key={item && item.evidenceJSON.name + item.evidenceJSON.fileURI}
        name={item && item.evidenceJSON.name}
      />
    ))

    return items
  }

  render() {
    const { address, aliases, evidences, ipfsGateway, name } = this.props
    if (!evidences) return <h4>No Evidence From {name}</h4>

    return (
      <div className="">
        <div className="row m-2">
          <div className="col-md-2">
            <Identicon
              bgColor="#4004A3"
              className="identicon rounded-circle align-center"
              color="#009AFF"
              scale={5}
              seed={address}
              size={10}
              spotColor="white"
              title={aliases[address]}
            >
              {address}
            </Identicon>
          </div>
          <div className="col-md-10 text-left">
            <b>{name}</b>
          </div>
        </div>
        <hr className="col-md-10" />

        <div className="row m-1">
          <div className="col">
            <ul class="nav nav-tabs" id="myTab" role="tablist">
              <li class="nav-item">
                <a
                  class="nav-link active"
                  id="evidence-tab"
                  data-toggle="tab"
                  href="#evidence"
                  role="tab"
                  aria-controls="evidence"
                  aria-selected="true"
                >
                  <h6 className="secondary-inverted">
                    <b>Evidence</b>
                  </h6>
                </a>
              </li>
            </ul>
            <div class="tab-content" id="myTabContent">
              <div
                class="tab-pane fade show active"
                id="evidence"
                role="tabpanel"
                aria-labelledby="home-tab"
              >
                <div className="row my-2">
                  <div className="col text-left">
                    {this.evidences(evidences, ipfsGateway)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

EvidenceList.propTypes = {
  evidences: PropTypes.string.isRequired,
  ipfsGateway: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
}

export default EvidenceList
