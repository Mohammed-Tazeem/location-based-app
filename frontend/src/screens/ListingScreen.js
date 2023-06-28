import React, { useState, useEffect, useReducer, } from 'react'
import {
  AppBar, Grid, Typography, Button, Card,
  CardHeader, CardMedia, CardContent, CircularProgress, IconButton, RoomIcon, CardActions
} from '@mui/material';
import Axios from 'axios';
import { Icon } from 'leaflet'
import { MapContainer, TileLayer, Popup, Marker, Polyline, useMap } from 'react-leaflet';
import officeIconPng from '../resources/Mapicons/office.png'
import apartmentIconPng from '../resources/Mapicons/apartment.png'
import houseIconPng from '../resources/Mapicons/house.png'
import { useImmerReducer } from 'use-immer'
import { useNavigate } from 'react-router-dom'






function ListingScreen() {
  // fetch("http://127.0.0.1:8000/api/listings/")
  //  .then((response)=>response.json())
  //  .then((data)=>console.log(data))

  const navigate = useNavigate();

  const [allListings, setAllListings] = useState([]);
  const [dataIsLoading, setDataIsLoading] = useState(true);

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

  const initialState = {
    mapInstance: null,

  }

  function ReducerFunction(draft, action) {
    switch (action.type) {

      case "getMap":
        draft.mapInstance = action.mapData;
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState)

  function TheMapComponent() {
    const map = useMap()
    dispatch({ type: 'getMap', mapData: map });
    return null;
  }


  useEffect(() => {
    const source = Axios.CancelToken.source()
    async function getAllListings() {
      try {
        const response = await Axios.get("/api/listings/", { cancelToken: source.token })
        //console.log(response.data);
        setAllListings(response.data);
        setDataIsLoading(false);
        console.log(allListings)

      } catch (error) {
        console.log(error)
      }
    }
    getAllListings();
    return () => {
      source.cancel();
    };
  }, [])

  if (dataIsLoading === false) {
    console.log(allListings[0].latitude)
  }

  // This Code Adds A Spinner to the Loading page
  if (dataIsLoading === true) {
    return (
      <Grid
        container
        justifyContent='center'
        alignItems='center'
        style={{ height: '100vh' }}
      >
        <CircularProgress />
      </Grid>

    )
  }


  return (

    <Grid container>
      <Grid item xs={4} style={{ marginTop: '0.5rem' }}>
        {allListings.map((listing) => {
          return (
            <Card key={listing.id}
              style={{
                margin: '0.5rem',
                border: '1px solid black'

              }}
            >
              <CardHeader
                action={
                  <Button aria-label='settings'
                    onClick={() => state.mapInstance.flyTo([listing.latitude, listing.longitude], 16)}>
                    Click
                  </Button>
                }

                title={listing.title}

              />
              <CardMedia
                style={{
                  paddingRight: '4rem',
                  paddingLeft: '1rem',
                  height: '20rem',
                  width: '30rem',
                  cursor: 'pointer'

                }}
                component="img"
                image={listing.picture1}
                alt={listing.title}
                onClick={() => navigate(`/listings/${listing.id}`)}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {listing.description.substring(0, 200)}
                </Typography>

              </CardContent>
              {listing.property_status === 'Sale' ? (
                <Typography
                  style={{

                    backgroundColor: 'green',
                    zIndex: '1000',
                    color: 'white',
                    top: '100px',
                    left: '20px',
                    padding: '5px',
                  }}
                >
                  {listing.listing_type},
                  ${listing.price}
                </Typography>


              ) : (
                <Typography
                  style={{

                    backgroundColor: 'green',
                    zIndex: '1000',
                    color: 'white',
                    top: '100px',
                    left: '20px',
                    padding: '5px',
                  }}
                >
                  {listing.listing_type}
                  $
                  {listing.price}/
                  {listing.rental_frequency}
                </Typography>
              )
              }
              <CardActions disableSpacing>
                <IconButton aria-label='add to favorites'>
                  {listing.seller_agency_name}
                </IconButton>
              </CardActions>

            </Card>

          )
        })}

      </Grid>

      <Grid item xs={8}>
        {/*This Components shows the map on the listing Screen */}
        <AppBar position='sticky'>
          <div>

            <div style={{ height: '100vh' }}>

              <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <TheMapComponent />


                {/* This Block of code maps the dummy property data */}
                {allListings.map((listing) => {

                  /*  function iconDisplay() {
  
                      if (listing.listing_type === 'Apartment')
                        return apartmentIcon;
  
                      else if (listing.listing_type === 'House')
                        return houseIcon;
  
                      else if (listing.listing_type === 'Office')
                        return officeIcon;
  
  
                    }*/

                  return (
                    <Marker
                      //icon={iconDisplay()}
                      key={listing.id}
                      position=
                      {[
                        // 51.50689042441059, -0.12606565837121803
                        listing.latitude, listing.longitude
                      ]}>


                      <Popup>
                        <Typography variant='h5'>{listing.title}</Typography>
                        <Typography variant='body1'>{listing.description.substring(0, 150)}</Typography>
                        <img
                          src={listing.picture1}
                          style={{ height: '14rem', width: '18rem', cursor: 'pointer' }}
                          onClick={() => navigate(`/listings/${listing.id}`)}
                        />
                        <Button
                          variant='contained'
                          fullWidth
                          onClick={() => navigate(`/listings/${listing.id}`)}
                          style={{ cursor: 'pointer' }}
                        >
                          Details
                        </Button>
                      </Popup>
                    </Marker>
                  )
                })}
              </MapContainer>
            </div>


          </div>
        </AppBar>
      </Grid>

    </Grid>

  )
}

export default ListingScreen