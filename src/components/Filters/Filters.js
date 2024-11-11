import React, { useState } from 'react';
import axios from 'axios';
import sourceIcon from "../../assets/Source.png";
import destinationIcon from "../../assets/Destination.png";
import "./Filters.css";

const Filters = ({ source, destination, setSource, setDestination, setSrc, setDest, handleRoute }) => {
    const [isSource, setIsSource] = useState(false);
    const [isDestination, setIsDestination] = useState(false);
    const [searchSource, setSearchSource] = useState("");
    const [searchDestination, setSearchDestination] = useState("");
    const [activeTab, setActiveTab] = useState("coordinates"); // Default to "Coordinates" tab

    // Function to fetch coordinates from location name
    const fetchCoordinates = async (place, setCoordinates) => {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${place}`);
            if (response.data.length > 0) {
                const { lat, lon } = response.data[0];
                const coordinates = `${lat},${lon}`;
                setCoordinates(coordinates);
                return coordinates;
            } else {
                alert("Location not found. Try another name.");
                return null;
            }
        } catch (error) {
            console.error("Error fetching coordinates:", error);
            return null;
        }
    };

    // Handle plotting route for place name search
    const handlePlaceNameRoute = async () => {
        const sourceCoordinates = await fetchCoordinates(searchSource, setSource);
        const destinationCoordinates = await fetchCoordinates(searchDestination, setDestination);

        if (sourceCoordinates && destinationCoordinates) {
            setSrc(sourceCoordinates);
            setDest(destinationCoordinates);
            handleRoute(sourceCoordinates, destinationCoordinates);
        }
    };

    return (
        <div>
            {/* Tab Navigation */}
            <div className="tab-container">
                <button
                    className={`tab ${activeTab === "coordinates" ? "active" : ""}`}
                    onClick={() => setActiveTab("coordinates")}
                >
                    Coordinates
                </button>
                <button
                    className={`tab ${activeTab === "placeName" ? "active" : ""}`}
                    onClick={() => setActiveTab("placeName")}
                >
                    Place Name
                </button>
            </div>

            {/* Conditional Rendering Based on Active Tab */}
            {activeTab === "coordinates" && (
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
                </div>
            )}

            {activeTab === "placeName" && (
                <div>
                    <div>Source Location</div>
                    <div className='input-container'>
                        <input
                            className='input-box'
                            type='text'
                            placeholder='Enter source location...'
                            value={searchSource}
                            onChange={(e) => setSearchSource(e.target.value)}
                        />
                    </div>

                    <div>Destination Location</div>
                    <div className='input-container'>
                        <input
                            className='input-box'
                            type='text'
                            placeholder='Enter destination location...'
                            value={searchDestination}
                            onChange={(e) => setSearchDestination(e.target.value)}
                        />
                    </div>

                    <button onClick={handlePlaceNameRoute}>Search & Plot Route</button>
                </div>
            )}

            {/* Route Button for Coordinate Tab */}
            {activeTab === "coordinates" && (
                <button type='submit' onClick={() => { handleRoute(source, destination); }}>Get The Route</button>
            )}
        </div>
    );
};

export default Filters;
