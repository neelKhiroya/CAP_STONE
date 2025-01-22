import PropTypes from 'prop-types'
import moment from 'moment'
import { useState } from 'react'

import './pattern-item.css'

PatternItem.propTypes = {
    pattern: PropTypes.any.isRequired,
    isMobile: PropTypes.bool,
}

PatternItem.default = {
    isMobile: false
}

export default function PatternItem({
    pattern,
    isMobile
}) {

    const [shouldShowDesc, setShowDesc] = useState(false)

    if (isMobile) return (
        <div className='mobile-pattern-container'>
            <div className='mobile-pattern-title-container'>
                <h2 className='mobile-pattern-title'>
                    {pattern.name}
                </h2>
            </div>
            <div className='mobile-pattern-info'>
                <div className='mobile-info'>
                    <div className='mobile-overflow'>
                        {moment(pattern.created_at).fromNow()}
                    </div>
                </div>
                <div className='mobile-info by'>
                    by
                </div>
                <div className='mobile-info'>
                    <div className='mobile-overflow'>
                        {pattern.username}
                    </div>
                </div>
            </div>
        </div>
    )

    else return (
        <div className='pattern-container' onMouseEnter={() => {setShowDesc(true)}} onMouseLeave={() => {setShowDesc(false)}}>
            <div className='pattern-wrapper' style={{ display: shouldShowDesc ? 'none' : 'block' }}>
                <h2 className='pattern-title'>{pattern.name}</h2>
                <p className='pattern-info'>
                    {moment(pattern.created_at).fromNow()} by {pattern.username}
                </p>
            </div>
            <div className='description-wrapper' style={{ display: !shouldShowDesc ? 'none' : 'block'}}>
                {pattern.description}
            </div>
        </div>
    )
}
