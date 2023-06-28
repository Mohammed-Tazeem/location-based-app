import React, { useEffect, useRef, useMemo, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
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
    CircularProgress
} from '@mui/material';


//Context
import StateContext from '../Contexts/StateContext'
import ProfileScreenUpdate from './ProfileScreenUpdate';

function ProfileScreen() {
    const navigate = useNavigate();
    const GloblaState = useContext(StateContext)

    const initialState = {
        userProfile: {
            agencyName: "",
            phoneNumber: "",
            profilePic: '',
            bio: '',
            sellerListings: [],
            sellerId: ''
        },
        dataIsLoading: true
    }



    function ReducerFunction(draft, action) {
        switch (action.type) {

            case "catchUserProfileInfo":
                draft.userProfile.agencyName = action.profileObject.agency_name;
                draft.userProfile.phoneNumber = action.profileObject.phone_number;
                draft.userProfile.profilePic = action.profileObject.profile_picture;
                draft.userProfile.bio = action.profileObject.bio;
                draft.userProfile.sellerListings = action.profileObject.seller_listings;
                draft.userProfile.sellerId = action.profileObject.seller;
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
                    `/api/profiles/${GloblaState.userId}/`);
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
    function PropertiesDisplay() {
        if (state.userProfile.sellerListings.length === 0) {
            return (
                <Button
                    size="small"
                    disabled

                >

                    No Properties</Button>

            )
        } else if (state.userProfile.sellerListings.length === 1) {
            return (
                <Button
                    size="small"
                    onClick={() => navigate(`/agencies/${state.userProfile.sellerId}`)}>
                    One Property
                </Button>
            );
        } else {
            return (
                <Button
                    size="small"
                    onClick={() => navigate(`/agencies/${state.userProfile.sellerId}`)}>
                    {state.userProfile.sellerListings.length} {''} Properties
                </Button>

            );
        }
    }

    function WelcomeDisplay() {
        if (state.userProfile.agencyName === null ||
            state.userProfile.agencyName === '' ||
            state.userProfile.phoneNumber === null ||
            state.userProfile.phoneNumber === '') {
            return (
                <Typography variant='h5' style={{ textAlign: 'center', marginTop: '1rem' }}>
                    Welcome {""}
                    <span style={{ color: 'green', fontWeight: 'bolder' }}>
                        {GloblaState.userUsername}
                    </span> , Please Submit this Form To Update your Profile</Typography>

            )
        } else {
            return (
                <Grid container
                    style={{
                        width: '50%',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        border: '5px solid black',
                        marginTop: '1rem',
                        padding: '1px'
                    }}>
                    <Grid item xs={6}>
                        <img
                            src={state.userProfile.profilePic !== null ? state.userProfile.profilePic :
                                defaultProfilePicture}
                            style={{ height: '10rem', width: '15rem' }} />
                    </Grid>

                    <Grid item container direction='column' justifyContent='center'>

                        <Grid item>
                            <Typography variant='h5' style={{ textAlign: 'center', marginTop: '1rem' }}>
                                Welcome {""}
                                <span style={{ color: 'green', fontWeight: 'bolder' }}>
                                    {GloblaState.userUsername}
                                </span>
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant='h5' style={{ textAlign: 'center', marginTop: '1rem' }}>
                                You Have {PropertiesDisplay()} property listed
                            </Typography>
                        </Grid>

                    </Grid>
                </Grid>
            )
        }

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
        <>
            <div>

                {WelcomeDisplay()}

            </div>
            <ProfileScreenUpdate userProfile={state.userProfile} />
        </>
    )
}

export default ProfileScreen