import React from 'react';
import Evidence from './Evidence'

class EvidenceList extends React.Component {
  constructor(props) {
    super(props)
  }



  render() {
    return(
      <div>
        <h1>Evidences</h1>
        <table className="table table-hover" id="disputes">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>File URI</th>
            </tr>
          </thead>
            <h2>asda</h2>
        </table>
      </div>
    )
  }

}

export default Evidence
