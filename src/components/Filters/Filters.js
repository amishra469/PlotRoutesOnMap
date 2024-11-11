import React, { useState } from 'react';
import axios from 'axios';
import sourceIcon from "../../assets/Source.png";
import destinationIcon from "../../assets/Destination.png";
import "./Filters.css";

const Filters = ({ source, destination, setSource, setDestination, setSrc, setDest, handleRoute }) => {
    const [isSource, setIsSource] = useState(false);
    const [isDestination, setIsDestination] = useState(false);
    const [search, setSearch] = useState("");

    // Function to fetch coordinates from location name
    const fetchCoordinates = async () => {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${search}`);
            if (response.data.length > 0) {
                const { lat, lon } = response.data[0];
                const coordinates = `${lat},${lon}`;
                setSource(coordinates); // set the source or destination based on your logic
                setSrc(coordinates);    // update the map with the fetched coordinates
                alert("Coordinates found: " + coordinates);
            } else {
                alert("Location not found. Try another name.");
            }
        } catch (error) {
            console.error("Error fetching coordinates:", error);
        }
    };

    return (
        <div>
            <div>
                <div>Search Location</div>
                <div className='input-container'>
                    <input
                        className='input-box'
                        type='text'
                        placeholder='Enter location name...'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button onClick={fetchCoordinates}>Search</button>
                </div>
            </div>

            <div>
                <div>Source</div>
                <div className='input-container'>
                    <input
                        className='input-box'
                        type='text'
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                    />
                    <span onClick={() => { setIsSource(true); setSrc(source); }}>
                        <img className={!isSource ? 'map-marker' : 'map-marker source-marker-clicked'}
                            src={sourceIcon} alt='source'></img>
                    </span>
                </div>
            </div>

            <div>
                <div>Destination</div>
                <div className='input-container'>
                    <input
                        className='input-box'
                        type='text'
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                    />
                    <span onClick={() => { setIsDestination(true); setDest(destination); }}>
                        <img className={!isDestination ? 'map-marker' : 'map-marker destination-marker-clicked'}
                            src={destinationIcon} alt='destination'></img>
                    </span>
                </div>
            </div>

            <button type='submit' onClick={() => { handleRoute(source, destination); }}>Get The Route</button>
        </div>
    );
};

export default Filters;
