import PropTypes from 'prop-types'

import './popup.css';

PopUp.propTypes = {
    prompt: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    children: PropTypes.node,
}


export default function PopUp({
    prompt,
    isOpen,
    onCancel,
    onSubmit,
    children
}) {

    if (isOpen) return (
        <div className='pop-up-container'>
            <div className='pop-up'>
                <h3 className='pop-up-title'>{prompt}</h3>
                <div className='pop-up-content'>
                    {children} 
                </div>
                <div className='pop-up-buttons'>
                    <button className='pop-up-yes' onClick={onSubmit}><i className="fa-solid fa-check" /></button>
                    <button className='pop-up-no' onClick={onCancel}><i className="fa-solid fa-xmark" /></button>
                </div>
            </div>
        </div>
    )
}
