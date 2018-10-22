import React from 'react';
import Dispute from './Dispute'

class Disputes extends React.Component {
  constructor(props) {
    super(props)
  }

  disputes = () => this.props.items.map((item) => {
    console.log(item.key)
    return <Dispute key={item.key} id={item.key} arbitrable={item[0]} choices={item[1]} fee={item[2]} ruling={item[3]} status={item[4]}/>
  })

  render() {
    return(
      <div>
        <label>Disputes</label>

        <table>
          <tbody>
            <tr>
              <th>Index</th>
              <th>Arbitrable</th>
              <th>Choices</th>
              <th>Fee(ETH)</th>
              <th>Ruling</th>
              <th>Status</th>
            </tr>
            {this.disputes()}
          </tbody>
        </table>
      </div>
    )
  }
}

export default Disputes
