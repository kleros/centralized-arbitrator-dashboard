import Blockies from "react-blockies"

const Identicon = ({
  bgColor,
  className,
  color,
  networkType,
  scale,
  seed,
  size,
  spotColor,
}: {
  bgColor: string
  className: string
  color: string
  networkType: string
  scale: number
  seed: string
  size: number
  spotColor: string
}) => (
  <a
    href={
      networkType === "mainnet"
        ? `https://etherscan.io/address/${seed}`
        : `https://${networkType}.etherscan.io/address/${seed}`
    }
    rel="noopener noreferrer"
    target="_blank"
  >
    <Blockies
      bgColor={bgColor}
      className={className}
      color={color}
      scale={scale}
      seed={seed}
      size={size}
      spotColor={spotColor}
    />
  </a>
)

export default Identicon
