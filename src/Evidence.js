import React from 'react';
import EvidenceDetail from './EvidenceDetail'

class Evidence extends React.Component {
  constructor(props) {
    super(props)
  }


  render() {
    return (
          <React.Fragment>
            <tbody>
              <tr className="clickable" data-toggle="collapse" data-target={'#accordion' + this.props.id}  aria-expanded="false" aria-controls={'accordion' + this.props.id}>
                  <td>{this.props.name}</td>
                  <td>{this.props.description}</td>
                  <td>{this.props.fileURI}</td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <td colSpan="5">
                    <div id={'accordion' + this.props.id} className="collapse">
                      <EvidenceDetail name="TODO"/>
                    </div>
                </td>
              </tr>
            </tbody>
          </React.Fragment>
    )
  }
}

export default Evidence
