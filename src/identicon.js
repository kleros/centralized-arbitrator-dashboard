import Blockies from 'react-blockies'
import PropTypes from 'prop-types'
import React from 'react'

const Identicon = ({
  bgColor,
  className,
  color,
  scale,
  seed,
  size,
  spotColor
}) => (
  <div>
    <a
      href={`https://kovan.etherscan.io/address/${seed}`}
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
  </div>
)

Identicon.propTypes = {
  bgColor: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  scale: PropTypes.number.isRequired,
  seed: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  spotColor: PropTypes.string.isRequired
}

export default Identicon
