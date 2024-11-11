import React, { useState, useEffect, useRef } from 'react';
import Filters from '../Filters/Filters';
import './Map.css';
import sourceIcon from '../../assets/Source.png';
import destinationIcon from '../../assets/Destination.png';
import { isValidLatitude, isValidLongitude } from './MapHelper';

const L = window.L = window.L ? window.L : {};
let map = null;
let sourceMarker = null;
let destinationMarker = null;
let routingControl = null;

const Map = () => {
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
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }).addTo(map);
            mapRef.current = map;
        }
    };

    const getMarker = (markerType) => {
        const markerIcon = L.icon({
            iconUrl: markerType === 'source' ? sourceIcon : destinationIcon,
            iconSize: [25, 30],
        });
        return markerIcon;
    };

    const plotMarker = (markerType, coords) => {
        if (!map || !coords) return;

        const marker = new L.Marker(coords, { icon: getMarker(markerType), draggable: true });
        if (markerType === 'source') {
            if (sourceMarker) {
                sourceMarker.setLatLng(coords);
            } else {
                sourceMarker = marker;
                sourceMarker.addTo(map);
            }
        } else if (markerType === 'destination') {
            if (destinationMarker) {
                destinationMarker.setLatLng(coords);
            } else {
                destinationMarker = marker;
                destinationMarker.addTo(map);
            }
        }
    };

    const setSrc = (src) => {
        setSource(src);
        const [lat, lng] = src.split(',');
        if (isValidLatitude(lat) && isValidLongitude(lng)) {
            plotMarker('source', [lat, lng]);
        } else {
            alert("Please insert valid latitude and longitude");
        }
    };

    const setDest = (dest) => {
        setDestination(dest);
        const [lat, lng] = dest.split(',');
        if (isValidLatitude(lat) && isValidLongitude(lng)) {
            plotMarker('destination', [lat, lng]);
        } else {
            alert("Please insert valid latitude and longitude");
        }
    };

    const handleRoute = () => {
        if (source && destination) {
            const [sLat, sLng] = source.split(",");
            const [dLat, dLng] = destination.split(",");
    
            if (!isValidLatitude(sLat) || !isValidLongitude(sLng) || !isValidLatitude(dLat) || !isValidLongitude(dLng)) {
                alert("Please insert valid latitude and longitude");
                return;
            }
    
            if (routingControl) {
                routingControl.setWaypoints([
                    L.latLng(parseFloat(sLat), parseFloat(sLng)),
                    L.latLng(parseFloat(dLat), parseFloat(dLng))
                ]);
            } else {
                routingControl = L.Routing.control({
                    waypoints: [
                        L.latLng(parseFloat(sLat), parseFloat(sLng)),
                        L.latLng(parseFloat(dLat), parseFloat(dLng))
                    ],
                    routeWhileDragging: true,
                    createMarker: (i, waypoint, n) => {
                        if (i === 0) return sourceMarker;
                        if (i === n - 1) return destinationMarker;
                    }
                }).addTo(map);
            }
    
            // Updated `dragend` event for source marker
            sourceMarker.on('dragend', () => {
                const newSourceLatLng = sourceMarker.getLatLng();
                const newSourceCoords = `${newSourceLatLng.lat.toFixed(2)},${newSourceLatLng.lng.toFixed(3)}`;
                setSource(newSourceCoords);  // Update the input field with the new coordinates
                routingControl.getWaypoints()[0].latLng = newSourceLatLng;
                routingControl.setWaypoints(routingControl.getWaypoints()); // Refresh route with updated waypoint
            });
    
            // Updated `dragend` event for destination marker
            destinationMarker.on('dragend', () => {
                const newDestLatLng = destinationMarker.getLatLng();
                const newDestCoords = `${newDestLatLng.lat.toFixed(2)},${newDestLatLng.lng.toFixed(3)}`;
                setDestination(newDestCoords);  // Update the input field with the new coordinates
                routingControl.getWaypoints()[1].latLng = newDestLatLng;
                routingControl.setWaypoints(routingControl.getWaypoints()); // Refresh route with updated waypoint
            });
        }
    };
    

    return (
        <div className="map-container">
            <div id="mymap" style={{ width: '100%', height: '650px', position: 'absolute' }}></div>
            <div className="filter-container">
                <Filters
                    source={source}
                    destination={destination}
                    setSource={setSource}
                    setDestination={setDestination}
                    setSrc={setSrc}
                    setDest={setDest}
                    handleRoute={handleRoute}
                />
            </div>
        </div>
    );
};

export default Map;
