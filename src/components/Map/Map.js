import React, { useEffect, useRef } from 'react';
import Filters from '../Filters/Filters';
import "./Map.css"
const L = window.L = window.L ? window.L : {};

const Map = () => {
    const mapRef = useRef(null);

    useEffect(() => {
        if (mapRef.current === null) {
            const map = L.map('mymap').setView([22.027718, 83.79754], 5);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }).addTo(map);
            mapRef.current = map;
        }
    }, []);

    return (
        <div className='map-container'>
            <div id="mymap" style={{width: "100%", height: "650px", position: "absolute" }}></div>
            <div className='filter-container'>
                <Filters />
            </div>
        </div>
    );
};

export default Map;
