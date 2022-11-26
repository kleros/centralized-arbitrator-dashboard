import { Contract } from "ethers"

export interface EvidenceType {
  fileURI: string
  ipfsGateway: string
  name: string
  blockNumber: number
  evidenceJSON: {
    fileURI: string
    name: string
    fileHash: string
    description: string
  }
  evidenceJSONValid: boolean
  fileValid: boolean
  submittedAt: number
  submittedBy: string
  transactionHash: string
  description: string
  aliases: any
  category: string,
  fileHash: string,
  fileTypeExtension: string,
  title: string
  rulingOptions: RulingOptions
  selfHash: string,
  interfaceValid: boolean
  metaEvidenceJSONValid: boolean
  metaEvidenceJSON: {
    fileURI: string,
    evidenceDisplayInterfaceURI: string,
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
  text: string,
  time: number
}

export interface DisputeType {
  arbitrableAddress: any
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
  metaevidenceObject: MetaevidenceObject
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
  category: string,
  description: string,
  fileHash: string,
  fileTypeExtension: string,
  fileURI: string,
  rulingOptions: RulingOptions
  selfHash: string,
  title: string
  fileValid: boolean
  interfaceValid: boolean
  metaEvidenceJSONValid: boolean
  metaEvidenceJSON: {
    fileURI: string,
    evidenceDisplayInterfaceURI: string,
    description: string
    category: string
    aliases: any
    question: string
    rulingOptions: RulingOptions
    title: string
    _v: string
  }
}