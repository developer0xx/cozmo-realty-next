import React, { useRef } from 'react'
import GoogleMapReact from 'google-map-react';

const GOOGLE_MAP_API = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

const Map = () => {
    const googleMapRef = useRef();
    const zoom = 11;

    return (
        <GoogleMapReact
            ref={googleMapRef}
            bootstrapURLKeys={{ key: GOOGLE_MAP_API }}
            defaultCenter={{
                lat: 34.052235,
                lng: -118.243683,
            }}
            defaultZoom={zoom}
            options={{
                maxZoom: 13
            }}>

        </GoogleMapReact>
    )
}

export default Map
