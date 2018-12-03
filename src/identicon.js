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
    {title && <h4>{title}</h4>}
  </div>
)

Identicon.propTypes = {
  title: PropTypes.string,
  seed: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  scale: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
  spotColor: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired
}

export default Identicon
