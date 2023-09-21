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

    const getMarker = (markerType) => {
        const markerIcon = L.icon({
            iconUrl: markerType === 'source' ? sourceIcon : destinationIcon,
            iconSize: [25, 30],
        });
        return markerIcon
    }

    const plotMarker = (markerType, coords) => {
        if (!map || !coords) return;

        const marker = new L.Marker(coords, { icon: getMarker(markerType), draggable: true });

        if (markerType === 'source') {
            if (sourceMarker) map.removeLayer(sourceMarker)
            sourceMarker = marker;
            if (routingControl) {
                const waypoints = routingControl.getWaypoints();
                waypoints[0].latLng = sourceMarker.getLatLng(); // Update source waypoint
                routingControl.setWaypoints(waypoints);
            }
        }
        else if (markerType === 'destination') {
            if (destinationMarker) map.removeLayer(destinationMarker)
            destinationMarker = marker;
            if (routingControl) {
                const waypoints = routingControl.getWaypoints();
                waypoints[waypoints.length - 1].latLng = destinationMarker.getLatLng(); // Update destination waypoint
                routingControl.setWaypoints(waypoints);
            }
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

    const handleRoute = (src, dest) => {
        if (src !== '' && dest !== '') {
            let [sLat, sLng] = src.split(",");
            let [dLat, dLng] = dest.split(",")

            if (routingControl) {
                map.removeControl(routingControl);
            }

            if (sourceMarker) map.removeLayer(sourceMarker)
            if (destinationMarker) map.removeLayer(destinationMarker)

            // Create markers with custom icons and make them draggable
            sourceMarker = L.marker([parseFloat(sLat), parseFloat(sLng)], { icon: getMarker('source'), draggable: true });
            destinationMarker = L.marker([parseFloat(dLat), parseFloat(dLng)], { icon: getMarker('destination'), draggable: true });


            // Create a routing control with the waypoints
            if (routingControl) {
                map.removeControl(routingControl);
            }

            routingControl = L.Routing.control({
                waypoints: [
                    L.latLng(parseFloat(sLat), parseFloat(sLng)),
                    L.latLng(parseFloat(dLat), parseFloat(dLng))
                ],
                routeWhileDragging: true,
                createMarker: function (i, waypoint, n) {
                    if (i === 0) {
                        return sourceMarker;
                    } else if (i === n - 1) {
                        return destinationMarker;
                    }
                }
            }).addTo(map);

            // Listen for marker drag events and update waypoints
            sourceMarker.on('dragend', function () {
                const waypoints = routingControl.getWaypoints();
                waypoints[0].latLng = sourceMarker.getLatLng(); // Update source waypoint
                let lat = sourceMarker.getLatLng().lat, lng = sourceMarker.getLatLng().lng
                setSource(lat.toFixed(2) + "," + lng.toFixed(3))
                routingControl.setWaypoints(waypoints);
            });

            destinationMarker.on('dragend', function () {
                const waypoints = routingControl.getWaypoints();
                waypoints[waypoints.length - 1].latLng = destinationMarker.getLatLng(); // Update destination waypoint
                let lat = destinationMarker.getLatLng().lat, lng = destinationMarker.getLatLng().lng
                setDestination(lat.toFixed(2) + "," + lng.toFixed(3))
                routingControl.setWaypoints(waypoints);
            });
        }
    }

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
                    handleRoute={handleRoute} />
            </div>
        </div>
    );
};

export default Map;
