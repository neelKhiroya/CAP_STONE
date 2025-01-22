import { ColorRing } from 'react-loader-spinner'
import PropTypes from "prop-types"

import './spinner.css'

Spinner.propTypes = {
  height: PropTypes.string,
  width: PropTypes.string
}

Spinner.default = {
  height: 'auto',
  width: 'auto'
}

export default function Spinner({
  height,
  width
}) {

  return (
    <div className='center' style={{height: height, width: width}}> 
      <ColorRing
        visible={true}
        height="100"
        width="100"
        ariaLabel="vortex-loading"
        wrapperStyle={{}}
        wrapperClass="spinner"
        colors={['#ff00c1', '#9600ff', '#4900ff', '#ff00c1', '#9600ff', '#4900ff']}
      />
    </div>
  )
}
