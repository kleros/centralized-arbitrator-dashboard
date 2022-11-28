import { Contract } from "ethers"

export interface EvidenceType {
  fileURI: string
  ipfsGateway: string
  blockNumber: number
  evidenceJSON: {
    fileURI: string
    name: string
    fileHash: string
    description: string
    title: string
  }
  evidenceJSONValid: boolean
  fileValid: boolean
  submittedAt: number
  submittedBy: string
  transactionHash: string
  description: string
  aliases: any
  category: string
  fileHash: string
  fileTypeExtension: string
  title: string
  rulingOptions: RulingOptions
  selfHash: string
  interfaceValid: boolean
  metaEvidenceJSONValid: boolean
  metaEvidenceJSON: {
    fileURI: string
    evidenceDisplayInterfaceURI: string
    description: string
    category: string
    aliases: any
    question: string
    rulingOptions: RulingOptions
    title: string
    _v: string
  }
}

export interface NotificationType {
  text: string
  time: number
}

export interface DisputeType {
  arbitrableAddress: string
  statusERC792: string
  activeWallet: string
  appealPeriodEnd: number
  appealPeriodStart: number
  arbitrated: string
  //archon: typeof Archon
  autoAppealableArbitratorInstance: Contract
  evidenceArray: EvidenceType[]
  fees: string
  id: number
  ipfsGateway: string
  metaevidenceObject: any
  networkType: string
  ruling: number
  status: string
  metaEvidence: MetaevidenceObject
}

export interface RulingOptions {
  description: string[]
  titles: string[]
  reserved: boolean
}

export interface MetaevidenceObject {
  aliases: any
  category: string
  description: string
  fileHash: string
  fileTypeExtension: string
  fileURI: string
  rulingOptions: RulingOptions
  selfHash: string
  title: string
  fileValid: boolean
  interfaceValid: boolean
  metaEvidenceJSONValid: boolean
  metaEvidenceJSON: {
    fileURI: string
    evidenceDisplayInterfaceURI: string
    description: string
    category: string
    aliases: any
    question: string
    rulingOptions: RulingOptions
    title: string
    _v: string
  }
}

export interface DisputeEvent {
  address: string
  blockHash: string
  blockNumber: number
  event: string
  id: string
  logIndex: number
  returnValues: {
    _arbitrable: string
    _disputeID: number
  }
}

export interface ReturnPastEvents {
  returnValues: {
    _disputeID: number
  }
}

export interface ReturnEvidence {
  evidenceGroupID: number
  returnValues: {
    _evidenceGroupID: number
  }
  blockNumber: number
}

export interface ReturnMetaevidence {
  metaEvidenceID: number
}
