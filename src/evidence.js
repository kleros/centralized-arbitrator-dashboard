import React from 'react'

import EvidenceDetail from './evidence-detail'

class Evidence extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        <tbody>
          <tr
            className="clickable"
            data-toggle="collapse"
            data-target={'#accordion' + this.props.id}
            aria-expanded="false"
            aria-controls={'accordion' + this.props.id}
          >
            <td>{this.props.name}</td>
            <td>
              <a
                href={'//' + this.props.fileURI}
                target="_blank"
                rel="noopener noreferrer"
              >
                {this.props.fileURI}
              </a>
            </td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td colSpan="5">
              <div id={'accordion' + this.props.id} className="collapse">
                <EvidenceDetail
                  description={this.props.description}
                  fileTypeExtension={this.props.fileTypeExtension}
                  selfHash={this.props.selfHash}
                />
              </div>
            </td>
          </tr>
        </tbody>
      </React.Fragment>
    )
  }
}

export default Evidence
