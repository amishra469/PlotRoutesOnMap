import React, { useState, useEffect, useRef } from 'react';
import Filters from '../Filters/Filters';
import './Map.css';
import sourceIcon from '../../assets/Source.png';
import destinationIcon from '../../assets/Destination.png';

const L = window.L = window.L ? window.L : {};
let map = null;
let sourceMarker = null;
let destinationMarker = null;
let routingControl = null;

const Map = () => {
    console.log(L)
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const mapRef = useRef(null);

    useEffect(() => {
        initializeMap();
    }, []);

    const initializeMap = () => {
        if (mapRef.current === null) {
            map = L.map('mymap').setView([22.027718, 83.79754], 5);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution:
                    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }).addTo(map);
            mapRef.current = map;
        }
    };

    const plotMarker = (markerType, coords) => {
        if (!map || !coords) return;

        const markerIcon = L.icon({
            iconUrl: markerType === 'source' ? sourceIcon : destinationIcon,
            iconSize: [25, 30],
        });

        const marker = new L.Marker(coords, { icon: markerIcon, draggable: false });

        if (markerType === 'source') {
            if (sourceMarker) map.removeLayer(sourceMarker)
            sourceMarker = marker;
        } else if (markerType === 'destination') {
            if (destinationMarker) map.removeLayer(destinationMarker)
            destinationMarker = marker;
        }

        map.addLayer(marker);
    };

    const setSrc = (src) => {
        setSource(src);
        if (src !== '') {
            const [lat, lng] = src.split(',');
            plotMarker('source', [lat, lng]);
        }
    };

    const setDest = (dest) => {
        setDestination(dest);
        if (dest !== '') {
            const [lat, lng] = dest.split(',');
            plotMarker('destination', [lat, lng]);
        }
    };

    const handleRoute = () => {
        if (source !== '' && destination !== '') {
            let [sLat, sLng] = source.split(",");
            let [dLat, dLng] = destination.split(",")

            if (routingControl) {
                map.removeControl(routingControl);
            }

            routingControl = L.Routing.control({
                waypoints: [
                    L.latLng(parseFloat(sLat), parseFloat(sLng)),
                    L.latLng(parseFloat(dLat), parseFloat(dLng))
                ],
                routeWhileDragging: true
            }).addTo(map);
        }
    }

    return (
        <div className="map-container">
            <div id="mymap" style={{ width: '100%', height: '650px', position: 'absolute' }}></div>
            <div className="filter-container">
                <Filters setSrc={setSrc} setDest={setDest} handleRoute={handleRoute} />
            </div>
        </div>
    );
};

export default Map;
