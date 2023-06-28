import { Typography, Button } from '@mui/material';
import React, { useState } from 'react'
import { Icon } from 'leaflet'
import { MapContainer, TileLayer, Popup, Marker, Polyline } from 'react-leaflet';
import officeIconPng from '../resources/Mapicons/office.png'
import apartmentIconPng from '../resources/Mapicons/apartment.png'
import houseIconPng from '../resources/Mapicons/house.png'

function ListingScreenMap({ allListings }) {
  const houseIcon = new Icon({
    iconUrl: houseIconPng,
    iconSize: [40, 40]
  })

  const officeIcon = new Icon({
    iconUrl: officeIconPng,
    iconSize: [40, 40]
  })

  const apartmentIcon = new Icon({
    iconUrl: apartmentIconPng,
    iconSize: [40, 40]
  })
  // const [latitude, setLatitude] = useState(51.50469284398969);
  // const [longitude, setLongitude] = useState(-0.12236451326183155);




  return (


    <div>

      <div style={{ height: '100vh' }}>

        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />


          {/* This Block of code maps the dummy property data */}
          {allListings.map((listing) => {

            /* function iconDisplay(){
  
              if(listing.listing_type==='Apartment')
                return apartmentIcon;
  
              else if(listing.listing_type==='House')
                return houseIcon;
  
              else if (listing.listing_type==='Office')
                return officeIcon;
  
              
            } */

            return (
              <Marker
                // icon={iconDisplay()}
                key={listing.id}
                position=
                {[
                  // 51.50689042441059, -0.12606565837121803
                  listing.latitude, listing.longitude
                ]}>


                <Popup>
                  <Typography variant='h5'>{listing.title}</Typography>
                  <Typography variant='body1'>{listing.description.substring(0, 150)}</Typography>
                  <img src={listing.picture1} style={{ height: '14rem', width: '18rem' }} />
                  <Button variant='contained' fullWidth>
                    Details
                  </Button>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </div>


    </div>
  )
}

export default ListingScreenMap