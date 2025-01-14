import { ColorRing } from 'react-loader-spinner'
import PropTypes from "prop-types"

import './spinner.css'

Spinner.propTypes = {
  isLoading: PropTypes.bool
}

Spinner.default = {
  isLoading: true,
}

export default function Spinner({
  isLoading,
}) {

  return (
    <div className='center'>
      <ColorRing
        visible={isLoading}
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
