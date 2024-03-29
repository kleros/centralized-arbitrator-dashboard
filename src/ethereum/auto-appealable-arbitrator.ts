// import AutoAppealableArbitrator from "@kleros/kleros-interaction/build/contracts/AutoAppealableArbitrator.json";
import AutoAppealableArbitrator from "./auto-appealable-arbitrator.json"
import { AbiItem } from "web3-utils"
import web3 from "./web3"
import { Contract } from "ethers"
const gasNumberToString = 2000000000000

export const deployAutoAppealableArbitrator: (account: string, arbitrationPrice: string) => any = (
  account: string,
  arbitrationPrice: string
) =>
  new web3.eth.Contract(AutoAppealableArbitrator.abi as AbiItem[])
    .deploy({
      arguments: [arbitrationPrice],
      data: AutoAppealableArbitrator.bytecode,
    })
    .send({ from: account })

export const autoAppealableArbitratorInstance: any = (address: string) =>
  new web3.eth.Contract(AutoAppealableArbitrator.abi as AbiItem[], address, {
    gasPrice: gasNumberToString.toString(),
  })

export const getOwner = async (arbitratorInstance: Contract) =>
  await arbitratorInstance.methods.owner().call()

export const getArbitrationCost = async (
  arbitratorInstance: Contract,
  extraData: string
) =>
  await arbitratorInstance.methods
    .arbitrationCost(web3.utils.utf8ToHex(extraData))
    .call()

export const setArbitrationPrice = async (
  account: string,
  arbitratorInstance: Contract,
  arbitrationPrice: string
) =>
  await arbitratorInstance.methods
    .setArbitrationPrice(arbitrationPrice)
    .send({ from: account })

export const getDispute = async (arbitratorInstance: Contract, index: number) =>
  await arbitratorInstance.methods.disputes(index).call()

export const getDisputeStatus = async (
  arbitratorInstance: Contract,
  index: number
) => await arbitratorInstance.methods.disputeStatus(index).call()

export const giveRuling = async (
  account: string,
  arbitratorInstance: Contract,
  disputeID: number,
  ruling: number
) =>
  await arbitratorInstance.methods
    .giveRuling(disputeID, ruling)
    .send({ from: account })

export const giveAppealableRuling = async (
  account: string,
  arbitratorInstance: Contract,
  disputeID: number,
  ruling: number,
  appealCost: string,
  timeToAppeal: number
) =>
  await arbitratorInstance.methods
    .giveAppealableRuling(disputeID, ruling, appealCost, timeToAppeal)
    .send({ from: account })
