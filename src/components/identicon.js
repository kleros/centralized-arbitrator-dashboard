import Blockies from 'react-blockies'
import PropTypes from 'prop-types'
import React from 'react'

const Identicon = ({
  bgColor,
  className,
  color,
  networkType,
  seed,
  spotColor
}) => (
  <a
    className="align-bottom"
    href={
      networkType === 'main'
        ? `https://etherscan.io/address/${seed}`
        : `https://kovan.etherscan.io/address/${seed}`
    }
    rel="noopener noreferrer"
    target="_blank"
  >
    <Blockies
      bgColor={bgColor}
      className={className}
      color={color}
      seed={seed}
      spotColor={spotColor}
    />
  </a>
)

Identicon.propTypes = {
  bgColor: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  networkType: PropTypes.string.isRequired,
  seed: PropTypes.string.isRequired,
  spotColor: PropTypes.string.isRequired
}

export default Identicon
