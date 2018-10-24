import web3 from './ethereum/web3'

import React from 'react';
import DisputeDetail from './DisputeDetail'

class Dispute extends React.Component {

constructor(props){
  super(props)
  console.log(props)
}

disputeStatusToString = (code) => {
  switch (code) {
    case "0":
      return "Waiting"
      break;
    case "1":
      return "Appealable"
      break;
    case "2":
      return "Solved"
      break;

    default:
      return ""+code
  }

}

  render(){
    return (
      <div className="card">
        <div className="card-header" id={this.props.id}>
          <h5 className="mb-0">
            <button className="btn btn-link" type="button" data-toggle="collapse" data-target={'#collapse' + this.props.id} aria-expanded="true" aria-controls={'collapse' + this.props.id}>
              <table>
                <tr>
                  <td>
                    {this.props.id}
                  </td>
                  <td>
                    {this.props.arbitrated}
                  </td>
                  <td>
                    {this.props.fee}
                  </td>
                  <td>
                    {this.props.ruling}
                  </td>
                  <td>
                    {this.props.status}
                  </td>
                </tr>
              </table>
            </button>
          </h5>
        </div>

        <div id={'collapse' + this.props.id} className="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
          <div className="card-body">
            Anim pariatur cliche reprehe
          </div>
        </div>
      </div>
    )
  }
}

export default Dispute
