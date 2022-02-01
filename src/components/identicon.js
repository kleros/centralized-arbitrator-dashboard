import Blockies from 'react-blockies'
import PropTypes from 'prop-types'
import React from 'react'

const Identicon = ({
  bgColor,
  className,
  color,
  networkType,
  scale,
  seed,
  size,
  spotColor
}) => (
  <a
    href={
      networkType === 'mainnet'
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

Identicon.propTypes = {
  bgColor: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  networkType: PropTypes.string.isRequired,
  scale: PropTypes.number.isRequired,
  seed: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  spotColor: PropTypes.string.isRequired
}

export default Identicon
