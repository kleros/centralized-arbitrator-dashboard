import {
  giveAppealableRuling,
  giveRuling,
} from "../ethereum/auto-appealable-arbitrator"
import Archon from "@kleros/archon"
import EvidenceList from "./EvidenceList"
//import Lodash from "lodash"
//import PropTypes from "prop-types"
import { FC, useEffect, useState } from "react"
import TimeAgo from "react-timeago"
import web3 from "../ethereum/web3"
import { getReadOnlyRpcUrl } from "../ethereum/web3"
import { EvidenceType, RulingOptions } from "../types"
import { Contract } from "ethers"

const DisputeDetail: FC<{
  activeWallet: string
  aliases: string[]
  appealPeriodEnd: number
  appealPeriodStart: number
  arbitrableContractAddress: string
  archon: typeof Archon
  category: number
  centralizedArbitratorInstance: Contract
  description: string
  evidenceDisplayInterfaceURI: string
  evidences: EvidenceType[]
  fileURI: string
  fileValid: boolean
  id: number
  interfaceValid: boolean
  ipfsGateway: string
  metaEvidenceJSONValid: boolean
  question: string
  ruling: number
  rulingOptions: RulingOptions
  status: string
  title: string
  version: string
  //appealPeriodStart
  //interfaceValid
}> = (p) => {
  const [appealFee, setAppealFee] = useState(0.1)
  const [appealable, setAppealable] = useState(true)
  const [timeToAppeal, setTimeToAppeal] = useState(240)
  const [chainID, setChainID] = useState("")
  const [jsonRpcUrl, setJsonRpcUrl] = useState("")

  useEffect(() => {
    const getChainIdAndSetValues = async () => {
      const currentChainID = await web3.eth.getChainId()
      setChainID(currentChainID.toString())
      setJsonRpcUrl(getReadOnlyRpcUrl({ chainId: currentChainID }))
    }
    getChainIdAndSetValues()
  }, [])

  const handleGiveRulingButtonClick =
    (account: string, instance: any, id: number, ruling: number) => () => {
      if (appealable)
        giveAppealableRuling(
          account,
          instance,
          id,
          ruling,
          web3.utils.toWei(appealFee.toString(), "ether"),
          timeToAppeal
        )
      /* Why don't we await? */ else
        giveRuling(account, instance, id, ruling) /* Why don't we await? */
    }

  const handleAppealableRulingCheckboxClick = () => {
    console.log("handlecheckbox")
    setAppealable(!appealable)
  }

  const handleTimeToAppealChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handletimetoappeal")
    setTimeToAppeal(Number(e.target.value))
  }

  const handleAppealFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleAppealFeeChange")
    setAppealFee(Number(e.target.value))
  }

  /*const renderedRulingOptions = (
    options: any,
    activeWallet: string,
    centralizedArbitratorInstance: string,
    id: number
  ) =>
    Lodash.zip(options.titles, options.descriptions).map(
      (option: any, key: any) => (
        <div className="col">
          <button
            className="btn btn-primary btn-lg primary "
            key={key + 1}
            onClick={handleGiveRulingButtonClick(
              activeWallet,
              centralizedArbitratorInstance,
              id,
              key + 1
            )}
          >
            {option[0]}
          </button>
        </div>
      )
    )*/

  const injectedParams = {
    disputeID: p.id.toString(),
    arbitratorChainID: chainID,
    arbitrableChainID: chainID,
    arbitratorContractAddress: p.centralizedArbitratorInstance._address,
    arbitratorJsonRpcUrl: jsonRpcUrl,
    arbitrableJsonRpcUrl: jsonRpcUrl,
    arbitrableContractAddress: p.arbitrableContractAddress,
  }

  let searchParams
  if (p.version === "0") {
    searchParams = `?${encodeURIComponent(JSON.stringify(injectedParams))}`
  } else {
    const _searchParams = new URLSearchParams(injectedParams)
    searchParams = `?${_searchParams.toString()}`
  }

  return (
    <div className="container">
      <div className="row p-0">
        <div className="col p-0">
          <h3 className="float-left">
            <b>{`${p.title}`}</b>
          </h3>
        </div>
        <div className="col p-0">
          <h3 className="float-right">
            <b>{`${p.category || ""}`}</b>
          </h3>
        </div>
      </div>
      <br />
      <div className="row p-0">
        <div className="col p-0 text-left">
          <h4 className="">{p.description}</h4>
        </div>
      </div>
      <br />
      {p.evidenceDisplayInterfaceURI && (
        <div className="row">
          <div className="col">
            <div
              className="embed-responsive embed-responsive-21by9"
              style={{ height: "200px" }}
            >
              <iframe
                className="embed-responsive-item"
                src={
                  (p.evidenceDisplayInterfaceURI.includes("://")
                    ? p.evidenceDisplayInterfaceURI
                    : `https://ipfs.kleros.io${p.evidenceDisplayInterfaceURI}`) +
                  searchParams
                }
                title="evidence-display"
              />
            </div>
          </div>
        </div>
      )}
      <br />
      <div className="row border p-3" id="fileURICard">
        <div className="col">
          <a
            href={p.ipfsGateway + p.fileURI}
            rel="noopener noreferrer"
            target="_blank"
          >
            <img
              className="mr-3"
              style={{ maxHeight: "1em", verticalAlign: "text-bottom" }}
              alt="Primary Document"
              title="Primary Document"
              src="text.svg"
            />
            Primary Document
          </a>
        </div>

        {(!p.fileValid || !p.metaEvidenceJSONValid) && (
          <div className="col-md-2">
            <div className="row">
              <div className="col-md-8 py-2 ">
                <h6 className="">Integrity Broken!</h6>
              </div>
              <div className="col-md-3 ">
                <img alt="warning" className="" src="warning.svg" />
              </div>
              <div className="offset-md-1" />
            </div>
          </div>
        )}
      </div>

      <br />
      <div className="row">
        <div className="col">
          <EvidenceList
            //address={"0x0"}
            //aliases={p.aliases}
            //archon={p.archon}
            //name={"Evidences"}
            evidences={p.evidences}
            ipfsGateway={p.ipfsGateway}
            
          />
        </div>
      </div>
      <br />

      {status === "0" && (
        <div>
          <div className="mb-5">
            <div className="row" id="appealable-ruling">
              <div className="col">
                <div className="custom-control custom-checkbox">
                  <input
                    aria-label="Checkbox for following text input"
                    className="custom-control-input"
                    defaultChecked={appealable}
                    id={"appealable" + p.id}
                    onClick={() => handleAppealableRulingCheckboxClick()}
                    type="checkbox"
                  />
                  <label
                    className="custom-control-label"
                    htmlFor={"appealable" + p.id}
                  >
                    <h4>Give an appealable ruling</h4>
                  </label>
                </div>
              </div>
            </div>
            {appealable && (
              <>
                <div className="row border background-shade pt-3">
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
                        aria-describedby="inputGroup-sizing-sm"
                        aria-label="Small"
                        className="form-control"
                        onChange={(event) => handleAppealFeeChange(event)}
                        type="number"
                        value={appealFee}
                      />
                    </div>
                  </div>
                  <div className="col-2">
                    <hr
                      className="mt-0"
                      style={{
                        background: "#CCCCCC",
                        border: "none",
                        height: "30px",
                        width: "1px",
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
                        aria-describedby="inputGroup-sizing-sm"
                        aria-label="Small"
                        className="form-control"
                        onChange={(event) => handleTimeToAppealChange(event)}
                        type="number"
                        value={timeToAppeal}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="row">
            <div className="col">
              <h4 className="">{p.question}</h4>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="offset-md-2 col-md-3">
              <button
                className="btn btn-primary btn-lg btn-block primary"
                onClick={handleGiveRulingButtonClick(
                  p.activeWallet,
                  p.centralizedArbitratorInstance,
                  p.id,
                  1
                )}
              >
                {(p.rulingOptions &&
                  p.rulingOptions.titles &&
                  p.rulingOptions.titles[0]) ||
                  "Not Provided"}
              </button>
            </div>
            <div className="col-md-2">X</div>
            <div className="col-md-3">
              <button
                className="btn btn-primary btn-lg btn-block primary"
                onClick={handleGiveRulingButtonClick(
                  p.activeWallet,
                  p.centralizedArbitratorInstance,
                  p.id,
                  2
                )}
              >
                {(p.rulingOptions &&
                  p.rulingOptions.titles &&
                  p.rulingOptions.titles[1]) ||
                  "Not Provided"}
              </button>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="offset-md-4 col-md-4 mb-5">
              <button
                className="btn btn-primary btn-lg btn-block secondary"
                onClick={handleGiveRulingButtonClick(
                  p.activeWallet,
                  p.centralizedArbitratorInstance,
                  p.id,
                  0
                )}
              >
                {p.rulingOptions && `Refuse to Arbitrate`}
              </button>
            </div>
          </div>
          {p.rulingOptions &&
            p.rulingOptions.reserved &&
            Object.entries(p.rulingOptions.reserved).map(([ruling, title]) => (
              <div className="row">
                <div key={ruling} className="offset-md-4 col-md-4 mb-5">
                  <button
                    className="btn btn-primary btn-lg btn-block secondary"
                    id={ruling}
                    onClick={handleGiveRulingButtonClick(
                      p.activeWallet,
                      p.centralizedArbitratorInstance,
                      p.id,
                      Number(ruling)
                    )}
                  >
                    {title}
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {status === "1" && (
        <div className="row px-0">
          <div className="col px-0">
            <div className="text-white pt-5">
              <div className="custom-text-white-pt-5">
                <h1>
                  <b> You voted for {p.ruling && p.aliases[p.ruling - 1]} </b>
                </h1>
                {p.appealPeriodEnd * 1000 < new Date().getTime() && (
                  <h2>Appeal period is over.</h2>
                )}
                {p.appealPeriodEnd * 1000 > new Date().getTime() && (
                  <h2>
                    The case can still be appealable until{" "}
                    <TimeAgo date={p.appealPeriodEnd * 1000} />
                  </h2>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {status === "2" && (
        <div className="row px-0">
          <div className="col px-0">
            <div className="text-white pt-5">
              <div className="custom-text-white-pt-5">
                <h1>
                  <b>
                    Decision:{" "}
                    {p.ruling &&
                      p.rulingOptions &&
                      p.rulingOptions.titles[p.ruling - 1]}
                  </b>
                </h1>
                <h2>The case is closed</h2>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DisputeDetail
