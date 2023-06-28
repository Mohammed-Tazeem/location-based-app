import React, { useEffect, useRef, useMemo, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Axios from 'axios';
import { useImmerReducer } from 'use-immer'
import Login from './Assets/Login.jpg'

import {
    Grid,
    Typography,
    Button,
    TextField,
    FormControlLabel,
    Checkbox
} from '@mui/material';


//Context
import StateContext from '../Contexts/StateContext'

function ProfileScreenUpdate(props) {
    const navigate = useNavigate();
    const GloblaState = useContext(StateContext)
    console.log(props.userProfile.agencyName)

    const initialState = {
        agencyNameValue: props.userProfile.agencyName,
        phoneNumberValue: props.userProfile.phoneNumber,
        bioValue: props.userProfile.bio,
        uploadedPicture: [],
        profilePictureValue: props.userProfile.profilePic,
        sendRequest: 0
    }



    function ReducerFunction(draft, action) {
        switch (action.type) {


            case "catchAgencyNameChange":
                draft.agencyNameValue = action.agencyNameChosen
                break

            case "catchPhoneNumberChange":
                draft.phoneNumberValue = action.phoneNumberChosen
                break
            case "catchBioChange":
                draft.bioValue = action.bioChosen
                break

            case "catchUploadedPicture":
                draft.uploadedPicture = action.pictureChosen;
                break
            case "catchProfilePictureChange":
                draft.profilePictureValue = action.profilePictureChosen;
                break

            case "changeSendRequest":
                draft.sendRequest = draft.sendRequest + 1;
                break
        }
    }

    const [state, dispatch] = useImmerReducer(ReducerFunction, initialState)

    // Use Effect to Catch Uploaded Picture

    useEffect(() => {
        if (state.uploadedPicture[0]) {
            dispatch({ type: 'catchProfilePictureChange', profilePictureChosen: state.uploadedPicture[0] })
        }

    }, [state.uploadedPicture[0]])





    // Request to get User Profile

    {/*  useEffect(() => {
        async function getProfileInfo() {
            try {
                const response = await Axios.get(
                    `https://www.myhotelweb.xyz/api/profiles/${GloblaState.userId}/`);
                console.log(response.data)
                dispatch({ type: 'catchUserProfileInfo', profileObject: response.data })

            } catch (e) {
                console.log(e.response)
            }
        }
        getProfileInfo();
    }, [])*/}

    //use Effect to Send the Request
    useEffect(() => {
        if (state.sendRequest) {
            async function UpdateProfile() {
                const formData = new FormData()

                if (typeof state.profilePictureValue === 'string' ||
                    state.profilePictureValue === null
                ) {
                    formData.append('agency_name', state.agencyNameValue);
                    formData.append('phone_number', state.phoneNumberValue);
                    formData.append('bio', state.bioValue);
                    formData.append('seller', GloblaState.userId);
                }
                else {

                    formData.append('agency_name', state.agencyNameValue);
                    formData.append('phone_number', state.phoneNumberValue);
                    formData.append('bio', state.bioValue);
                    formData.append('profile_picture', state.profilePictureValue);
                    formData.append('seller', GloblaState.userId);
                }

                try {
                    const response = await Axios.patch(
                        `/api/profiles/${GloblaState.userId}/update/`,
                        formData);
                    console.log(response)
                    navigate(0)


                } catch (e) {
                    console.log(e.response)
                }

            }
            UpdateProfile()
        }

    }, [state.sendRequest])



    function ProfilePictureDisplay() {
        if (typeof state.profilePictureValue !== 'string') {
            return (
                <ul>
                    {state.profilePictureValue ? <li>{state.profilePictureValue.name} </li> : ''}
                </ul>

            );
        }
        else if (typeof state.profilePictureValue === 'string') {
            return (
                <Grid item style={{ margin: '0.5rem', marginRight: 'auto', marginRight: 'auto' }}>
                    <img src={props.userProfile.profilePic}
                        style={{ height: '5rem', width: '5rem' }} />
                </Grid>
            )
        }
    }




    return (
        <>

            <div
                style={{
                    width: "50%",
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: '3rem',
                    border: '5px',
                    borderColor: 'red',
                    padding: '3rem'


                }}>
                <form>
                    <Grid item container justifyContent='center'>
                        <Typography variant='h5'>
                            <span style={{ color: 'blue', fontWeight: 'bolder' }}>My Profile</span>
                        </Typography>




                    </Grid>

                    <Grid item container>
                        <TextField
                            id="agencyName"
                            label="Agency Name"
                            variant="outlined"
                            value={state.agencyNameValue}
                            onChange={(e) => dispatch({
                                type: 'catchAgencyNameChange',
                                agencyNameChosen: e.target.value
                            })}
                            fullWidth
                            style={{ marginTop: '1rem' }} />
                    </Grid>



                    <Grid item container>
                        <TextField
                            id="phoneNumber"
                            label="Phone Number"
                            variant="outlined"

                            value={state.phoneNumberValue}
                            onChange={(e) => dispatch({ type: 'catchPhoneNumberChange', phoneNumberChosen: e.target.value })}
                            fullWidth
                            style={{ marginTop: '1rem' }} />
                    </Grid>

                    <Grid item container>
                        <TextField
                            id="bio"
                            label="BIO "
                            variant="outlined"
                            multiline
                            rows={6}
                            value={state.bioValue}
                            onChange={(e) => dispatch({ type: 'catchBioChange', bioChosen: e.target.value })}
                            fullWidth
                            style={{ marginTop: '1rem' }} />
                    </Grid>

                    < Grid
                        item
                        container
                        xs={5}
                        style={{
                            marginTop: '1rem',
                            marginRight: 'auto',
                            marginLeft: 'auto'
                        }}>
                        <Grid item container>
                            {ProfilePictureDisplay()}
                        </Grid>
                        <Button
                            variant="contained"
                            fullWidth
                            component='label'
                            style={{
                                backgroundColor: 'blue',
                                color: 'white',
                                fontSize: '0.8rem',
                                border: '1px solid black',
                                marginLeft: '1rem',
                            }}
                        >

                            Set Profile Picture
                            <input
                                type='file'
                                hidden
                                accept='image/png, image/gif, image/jpg, image/jpeg'
                                onChange={(e) => dispatch({
                                    type: 'catchUploadedPicture',
                                    pictureChosen: e.target.files

                                })} />
                        </Button>
                    </Grid>
                    <Grid item container>
                        <ul>
                            {state.profilePictureValue ? <li>{state.profilePictureValue.name} </li> : ''}
                        </ul>
                    </Grid>



                    <Grid
                        item
                        container
                        xs={8}
                        style={{
                            marginTop: '1rem',
                            marginRight: 'auto',
                            marginLeft: 'auto'
                        }}>

                        <Button
                            variant="contained"
                            fullWidth
                            type='submit'
                            style={{
                                backgroundColor: 'green',
                                color: 'white',
                                fontSize: '1.1rem',
                                marginLeft: '1rem',
                            }}
                        >

                            Update Info
                        </Button>
                    </Grid>




                </form>

            </div>
        </>
    )
}

export default ProfileScreenUpdate