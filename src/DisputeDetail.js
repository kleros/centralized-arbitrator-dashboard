import React from 'react'

class DisputeDetail extends React.Component {


asd = {
  "fileURI":"/ipfs/QmdBNTwDazHsYXk9xW9JnM4iVGpdUnZni1DS4pyF3adKq1",
  "fileHash":"QmdBNTwDazHsYXk9xW9JnM4iVGpdUnZni1DS4pyF3adKq1",
  "fileTypeExtension":"txt",
  "category":"freelancing",
  "aliases":{"0x56b2b5C88C9AC1D0E5785ED1A7c7B28173F5eE1b":"Alice","0x8961286757C764a4a6Be9689649BA9E08DBaca4a":"Bob"},
  "title": "Alice Builds a Webpage for Bob",
  "description":"Alice is hired by Bob as a contractor to create a website for his company. When completed, the site will be hosted at https://my-site.com.",
  "question":"Is the website compliant with the terms of the contract?",
  "rulingOptions":{"titles":["Yay","Nay"]},
  "descriptions":["The website is compliant. This will release the funds to Alice.","The website is not compliant. This will refund Bob."]
  }




  render() {
    return (
      <div>
        <h4>{this.props.category}</h4>
        <div className="dropdown">
          <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Dropdown button
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a className="dropdown-item" href="#">Action</a>
            <a className="dropdown-item" href="#">Another action</a>
            <a className="dropdown-item" href="#">Something else here</a>
          </div>
        </div>
      </div>
    )
  }
}

export default DisputeDetail
