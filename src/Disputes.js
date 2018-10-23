import React from 'react';
import Dispute from './Dispute'

class Disputes extends React.Component {
  constructor(props) {
    super(props)
  }

  disputes = () => this.props.items.sort().filter(dispute => dispute.status == "0").sort().map((item) => {
    return <Dispute key={item.key} id={item.key} arbitrated={item.arbitrated} choices={item.choices} fee={item.fee} ruling={item.ruling || "0"} status={item.status || "0"}/>
  })

  render() {
    return(
      <div>
        <h1>Disputes That Await Your Arbitration</h1>

          <table>
            <tbody>
              <tr>
                <th>ID</th>
                <th>Arbitrated</th>
                <th>Choices</th>
                <th>Fee(ETH)</th>
                <th>Ruling</th>
                <th>Status</th>
              </tr>
              {this.disputes()}
            </tbody>
          </table>


        <div className="accordion" id="accordionExample">
          <div className="card">
            <div className="card-header" id="headingOne">
              <h5 className="mb-0">
                <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                  Collapsible Group Item #1
                </button>
              </h5>
            </div>

            <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
              <div className="card-body">
                Anim pariatur cliche reprehe
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header" id="headingTwo">
              <h5 className="mb-0">
                <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                  Collapsible Group Item #2
                </button>
              </h5>
            </div>
            <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
              <div className="card-body">
                Anim pariatur clic
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header" id="headingThree">
              <h5 className="mb-0">
                <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                  Collapsible Group Item #3
                </button>
              </h5>
            </div>
            <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
              <div className="card-body">
                Anim pariatur
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

export default Disputes
