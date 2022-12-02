import { FC } from "react"
import Blockies from "react-blockies"

const Identicon: FC<{
  bgColor: string
  className: string
  color: string
  networkType: string
  scale: number
  seed: string
  size: number
  spotColor: string
}> = (p) => {
  return (
    <a
      href={
        p.networkType === "mainnet"
          ? `https://etherscan.io/address/${p.seed}`
          : `https://${p.networkType}.etherscan.io/address/${p.seed}`
      }
      rel="noopener noreferrer"
      target="_blank"
    >
      <Blockies
        bgColor={p.bgColor}
        className={p.className}
        color={p.color}
        scale={p.scale}
        seed={p.seed}
        size={p.size}
        spotColor={p.spotColor}
      />
    </a>
  )
}

export default Identicon
