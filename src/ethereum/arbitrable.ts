import arbitrable from '@kleros/kleros-interaction/build/contracts/Arbitrable.json'
import { AbiItem } from 'web3-utils'
import web3 from './web3'

export const arbitrableInstanceAt: any = (address: string) =>
  new web3.eth.Contract(arbitrable.abi as AbiItem[], address, { gasPrice: 20000000000 as never})
