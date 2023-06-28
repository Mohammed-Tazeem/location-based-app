import React, { useEffect, useRef, useMemo, useContext, } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Axios from 'axios';
import { useImmerReducer } from 'use-immer'
import Login from './Assets/Login.jpg'
import defaultProfilePicture from './Assets/defaultProfilePicture.jpg'

import {
  Grid,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  CardActions
} from '@mui/material';


//Context
import StateContext from '../Contexts/StateContext'
import ProfileScreenUpdate from './ProfileScreenUpdate';


function AgencyDetailsScreen() {

  const navigate = useNavigate();
  const GloblaState = useContext(StateContext)

  //console.log(useParams());

  const params = useParams()

  const initialState = {
    userProfile: {
      agencyName: "",
      phoneNumber: "",
      profilePic: '',
      bio: '',
      sellerListings: []
    },
    dataIsLoading: true
  }



  function ReducerFunction(draft, action) {
    switch (action.type) {

      case "catchUserProfileInfo":
        draft.userProfile.agencyName = action.profileObject.agency_name
        draft.userProfile.phoneNumber = action.profileObject.phone_number
        draft.userProfile.profilePic = action.profileObject.profile_picture
        draft.userProfile.bio = action.profileObject.bio
        draft.userProfile.sellerListings = action.profileObject.seller_listings
        break
      case "loadingDone":
        draft.dataIsLoading = false
        break

    }
  }

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState)

  // Use Effect to Catch Uploaded Picture

  {/*  useEffect(() => {
      if (state.uploadedPicture[0]) {
          dispatch({ type: 'catchProfilePictureChange', profilePictureChosen: state.uploadedPicture[0] })
      }

  }, [state.uploadedPicture[0]])*/}



  // Request to get User Profile

  useEffect(() => {
    async function getProfileInfo() {
      try {
        const response = await Axios.get(
          `/api/profiles/${params.id}/`);
        console.log(response.data)
        dispatch({ type: 'catchUserProfileInfo', profileObject: response.data })
        dispatch({ type: 'loadingDone' })

      } catch (e) {
        console.log(e.response)
      }
    }
    getProfileInfo();
  }, [])

  //use Effect to Send the Request
  {/* useEffect(() => {
      if (state.sendRequest) {
          async function UpdateProfile() {
              const formData = new FormData()
              formData.append('agency_name', state.agencyNameValue);
              formData.append('phone_number', state.phoneNumberValue);
              formData.append('bio', state.bioValue);
              formData.append('profile_picture', state.profilePictureValue);
              try {
                  const response = await Axios.patch(
                      `https://www.myhotelweb.xyz/api/profiles/${GloblaState.userId}/update/`,
                      formData);
                  console.log(response)
                  //navigate('/listings')


              } catch (e) {
                  console.log(e.response)
              }

          }
          UpdateProfile()
      }

  }, [state.sendRequest]) */}


  function FormSubmit(e) {
    e.preventDefault()
    dispatch({ type: 'changeSendRequest' })

  }

  if (state.dataIsLoading === true) {
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
    <div>
      <Grid container
        style={{
          width: '75%',
          marginLeft: 'auto',
          marginRight: 'auto',
          border: '5px solid black',
          marginTop: '1rem',
          padding: '1px'
        }}>
        <Grid item xs={8}>
          <img
            src={state.userProfile.profilePic !== null ?
              state.userProfile.profilePic :
              defaultProfilePicture}
            style={{ height: '10rem', width: '15rem' }} />
        </Grid>

        <Grid item container direction='column' justifyContent='center'>

          <Grid item>
            <Typography variant='h5' style={{ textAlign: 'center', marginTop: '1rem' }}>

              <span style={{ color: 'green', fontWeight: 'bolder' }}>
                {state.userProfile.agencyName}
              </span>
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant='h5' style={{ textAlign: 'center', marginTop: '1rem' }}>
              {state.userProfile.phoneNumber}
            </Typography>
          </Grid>

        </Grid>

        <Grid item
          style={{
            marginTop: '1rem',
            padding: '5px'
          }}>
          {state.userProfile.bio}
        </Grid>
      </Grid>
      <Grid container justifyContent="flex-start" spacing={2}
        style={{ padding: '10px' }}>
        {state.userProfile.sellerListings.map(listing => {
          {/* function PropertiesDisplay() {
            if (agency.seller_listings.length === 0) {
              return (
                <Button
                  size="small"
                  disabled
                  onClick={() => navigate(`/agencies/${agency.seller}`)}
                >

                  No Properties</Button>

              )
            } else if (agency.seller_listings.length === 1) {
              return (
                <Button
                  size="small"
                  onClick={() => navigate(`/agencies/${agency.seller}`)}
                >
                  One Property
                </Button>
              );
            } else {
              return (
                <Button
                  size="small"
                  onClick={() => navigate(`/agencies/${agency.seller}`)}>
                  {agency.seller_listings.length} {''} Properties
                </Button>

              )
            }
          }*/}

          return (
            <Grid key={listing.id} item style={{ marginTop: '1rem', maxWidth: '20rem' }}>
              <Card>
                <CardMedia
                  component='img'
                  height='140'
                  image={
                    `/${listing.picture1}`
                      ?
                      `/${listing.picture1}` :
                      defaultProfilePicture}
                  alt="listing Picture"
                  onClick={() => navigate(`/listings/${listing.id}`)}
                  style={{ cursor: 'pointer' }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {listing.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {listing.description.substring(0, 100)}....
                  </Typography>
                </CardContent>
                <CardActions>
                  {listing.property_status === 'Sale' ?
                    `$${listing.price}` :
                    `$${listing.price}/${listing.rental_frequency}`}



                </CardActions>
              </Card>
            </Grid>
          );


        })}
      </Grid>
    </div>
  )
}

export default AgencyDetailsScreen