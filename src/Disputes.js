import React from 'react';
import Dispute from './Dispute'

class Disputes extends React.Component {
  constructor(props) {
    super(props)
  }

  disputes = () => this.props.items.filter(dispute => dispute.status !== "2").sort(function(a, b){return a.id - b.id}).map((item) => {
    console.warn("here")
    console.log(item)
    return <Dispute key={item.id}
                    id={item.id}
                    arbitrated={item.arbitrated}
                    choices={item.choices}
                    fee={item.fee}
                    ruling={item.ruling || "0"}
                    status={item.status || "0"}
                    metaevidence={item.metaevidence || "NO META EVIDENCE"} />
  })

  render() {
    return(
      <div>
        <h1>Disputes That Await Your Arbitration</h1>

        <table className="table table-hover" id="disputes">
          <thead>
            <tr>
              <th>ID</th>
              <th>Arbitrable</th>
              <th>Fee (Ether)</th>
              <th>Ruling</th>
              <th>Status</th>
            </tr>
          </thead>

            {this.disputes()}
        </table>

      </div>
    )
  }
}

export default Disputes
