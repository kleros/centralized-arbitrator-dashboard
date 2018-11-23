import PropTypes from 'prop-types'
import React from 'react'
import Blockies from 'react-blockies'

const Identicon = ({
  title,
  seed,
  size,
  scale,
  color,
  bgColor,
  spotColor,
  className
}) => (
  <div>
    <a
      href={`https://kovan.etherscan.io/address/${seed}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Blockies
        seed={seed}
        size={size}
        scale={scale}
        color={color}
        bgColor={bgColor}
        spotColor={spotColor}
        className={className}
      />
    </a>
    <h4>{title}</h4>
  </div>
)

Identicon.propTypes = {
  title: PropTypes.string.isRequired,
  seed: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  scale: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
  spotColor: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired
}

export default Identicon
