import React, { useState } from 'react'
import sourceIcon from "../../assets/Source.png"
import destinationIcon from "../../assets/Destination.png"
import "./Filters.css"

const Filters = ({source, destination, setSource, setDestination, setSrc, setDest, handleRoute}) => {
    const [isSource, setIsSource] = useState(false)
    const [isDestination, setIsDestination] = useState(false)

    return (
        <div>
            <div>
                <div>Source</div>
                <div className='input-container'>
                    <input
                        className='input-box'
                        type='text'
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                    />
                    <span onClick={() => {setIsSource(true); setSrc(source)}}>
                        <img className={!isSource ? 'map-marker' : 'map-marker source-marker-clicked'}
                            src={sourceIcon} alt='source'></img>
                    </span>
                </div>
            </div >
            <div>
                <div>Destination</div>
                <div className='input-container'>
                    <input
                        className='input-box'
                        type='text'
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                    />
                    <span onClick={() => {setIsDestination(true); setDest(destination)}}>
                        <img className={!isDestination ? 'map-marker' : 'map-marker destination-marker-clicked'}
                            src={destinationIcon} alt='source'></img>
                    </span>
                </div>
            </div>
            <button type='submit' onClick={()=> {handleRoute(source, destination)}}>Get The Route</button>
        </div >
    )
}

export default Filters
