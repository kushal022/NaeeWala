import React from 'react'
import { APIProvider, Map } from '@vis.gl/react-google-maps';

const API_KEY = import.meta.env.VITE_GOOGLE_GEOLOCATION_API_KEY
const MapGoogle = () => {
  // console.log('aip', API_KEY)
  return (
    <div>
      <APIProvider apiKey={API_KEY} onLoad={() => console.log('Maps API has loaded.')}>
        <div>map</div>
        <div style={{ height: "400px", width: "100%" }}>
          <Map
            defaultZoom={13}
            mapId='DEMO_MAP_ID'
            defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
            onCameraChanged={(ev) => {
              console.log(
                "camera changed:",
                ev.detail.center,
                "zoom:",
                ev.detail.zoom
              );
            }}
          ></Map>
        </div>

      </APIProvider>
    </div>
  )
}

export default MapGoogle

