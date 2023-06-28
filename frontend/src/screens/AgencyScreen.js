import React, { useEffect, useRef, useMemo, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Axios from 'axios';
import { useImmerReducer } from 'use-immer'
import Login from './Assets/Login.jpg'
import defaultProfilePicture from './Assets/defaultProfilePicture.jpg';
import StateContext from '../Contexts/StateContext'
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

function AgencyScreen() {

    const navigate = useNavigate();
    const GloblaState = useContext(StateContext)

    const initialState = {
        dataIsLoading: true,
        agenciesList: []
    }



    function ReducerFunction(draft, action) {
        switch (action.type) {

            case "catchAgenciesInfo":
                draft.agenciesList = action.agenciesArray
                break
            case "loadingDone":
                draft.dataIsLoading = false
                break

        }
    }

    const [state, dispatch] = useImmerReducer(ReducerFunction, initialState)

    // To get the Agencies List

    useEffect(() => {
        async function getAgencies() {
            try {
                const response = await Axios.get(
                    `/api/profiles/`);
                console.log(response.data)
                dispatch({
                    type: 'catchAgenciesInfo',
                    agenciesArray: response.data
                })
                dispatch({ type: 'loadingDone' })

            } catch (e) {
                console.log(e.response)
            }
        }
        getAgencies();
    }, [])


    // Loader Component
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
        <Grid container justifyContent="flex-start" spacing={2}
            style={{ padding: '10px' }}>
            {state.agenciesList.map(agency => {
                function PropertiesDisplay() {
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
                }
                if (agency.agency_name && agency.phone_number) {
                    return (
                        <Grid key={agency.id} item style={{ marginTop: '1rem', maxWidth: '20rem' }}>
                            <Card>
                                <CardMedia
                                    component='img'
                                    height='140'
                                    image={agency.profile_picture ?
                                        agency.profile_picture :
                                        defaultProfilePicture}
                                    alt="Profile Picture"
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {agency.agency_name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {agency.bio.substring(0, 100)}....
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    {PropertiesDisplay()}

                                </CardActions>
                            </Card>
                        </Grid>
                    );
                }

            })}
        </Grid>
    )
}

export default AgencyScreen