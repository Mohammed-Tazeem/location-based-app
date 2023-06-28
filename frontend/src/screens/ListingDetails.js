import React, { useEffect, useRef, useMemo, useContext, useState, } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Axios from 'axios';
import { useImmerReducer } from 'use-immer'
import Login from './Assets/Login.jpg'
import defaultProfilePicture from './Assets/defaultProfilePicture.jpg'
import { MapContainer, TileLayer, useMap, Popup, Marker, Polygon, } from 'react-leaflet'
import stadiumIconPng from '../resources/Mapicons/stadium.png'
import hospitalIconPng from '../resources/Mapicons/hospital.png'
import universityIconPng from '../resources/Mapicons/university.png'


// Components
import ListingUpdate from './ListingUpdate'

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
    CardActions,
    Breadcrumbs,
    Link,
    Dialog,
    Snackbar
} from '@mui/material';

import { Icon } from 'leaflet'


//Context
import StateContext from '../Contexts/StateContext'
import ProfileScreenUpdate from './ProfileScreenUpdate';
import { current } from 'immer';

function ListingDetails() {
    const navigate = useNavigate();
    const GloblaState = useContext(StateContext)

    //console.log(useParams());

    const params = useParams();
    const stadiumIcon = new Icon({
        iconUrl: stadiumIconPng,
        iconSize: [40, 40]
    })

    const hospitalIcon = new Icon({
        iconUrl: hospitalIconPng,
        iconSize: [40, 40]
    })

    const universityIcon = new Icon({
        iconUrl: universityIconPng,
        iconSize: [40, 40]
    })

    const initialState = {
        dataIsLoading: true,
        listingInfo: '',
        sellerProfileInfo: '',
        openSnack: false,
        disabledBtn: false

    }



    function ReducerFunction(draft, action) {
        switch (action.type) {

            case "catchListingInfo":
                draft.listingInfo = action.listingObject;
                break
            case "loadingDone":
                draft.dataIsLoading = false
                break
            case "catchSellerProfileInfo":
                draft.sellerProfileInfo = action.profileObject;
                break
            case "openTheSnack":
                draft.openSnack = true;
                break
            case "disableTheButton":
                draft.disabledBtn = true;
                break
            case "allowTheButton":
                draft.disabledBtn = false;
                break
        }
    }

    const [state, dispatch] = useImmerReducer(ReducerFunction, initialState)

    //get the Profile Info
    useEffect(() => {
        if (state.listingInfo) {
            async function getProfileInfo() {
                try {
                    const response = await Axios.get(
                        `/api/profiles/${state.listingInfo.seller}/`);
                    console.log(response.data)
                    dispatch({ type: 'catchSellerProfileInfo', profileObject: response.data })


                } catch (e) {
                    console.log(e.response)
                }
            }
            getProfileInfo();
        }

    }, [state.listingInfo])


    // Request to get  Listing Info

    useEffect(() => {
        async function getListingInfo() {
            try {
                const response = await Axios.get(
                    `https://www.myhotelweb.xyz/api/listings/${params.id}/`);
                console.log(response.data)
                dispatch({ type: 'catchListingInfo', listingObject: response.data })
                dispatch({ type: 'loadingDone' })

            } catch (e) {
                console.log(e.response)
            }
        }
        getListingInfo();
    }, [])

    // Image for Storing Pictures
    const listingPictures = [
        state.listingInfo.picure1,
        state.listingInfo.picure2,
        state.listingInfo.picure3,
        state.listingInfo.picure4,
        state.listingInfo.picure5,
    ]
    //.filter((picture) => picture != null)
    const [currentPicture, setCurrentPicture] = useState(0)

    function NextPicture() {
        if (currentPicture === listingPictures.length - 1) {
            return setCurrentPicture(0)
        }
        else {
            setCurrentPicture(currentPicture + 1)
        }

    }

    function PreviousPicture() {

        if (currentPicture === 0) {
            return setCurrentPicture(listingPictures.length - 1)
        }
        else {
            setCurrentPicture(currentPicture - 1)
        }

    }

    const date = new Date(state.listingInfo.date_posted)
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`

    async function DeleteHandler() {

        const confirmDelete = window.confirm('Do you Want to delete this Property Listing');
        if (confirmDelete) {
            try {
                const response = await Axios.delete(
                    `https://www.myhotelweb.xyz/api/listings/${params.id}/delete/`
                )
                console.log(response.data);
                dispatch({ type: 'openTheSnack' });
                dispatch({ type: 'disableTheButton' });
                //navigate('/listings')

            } catch (e) {
                console.log(e.response.data);
                dispatch({ type: 'allowTheButton' });
            }
        }

    }
    useEffect(() => {
        if (state.openSnack) {
            setTimeout(() => {
                navigate("/listings")
            }, 1500)
        }
    }, [state.openSnack])
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

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
        <div style={{ margin: '2rem' }} >
            <Grid style={{ marginTop: '1rem', }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="inherit"
                        style={{ cursor: 'pointer' }}

                        onClick={() => navigate('/listings')}
                    >
                        Listings
                    </Link>
                    <Typography color="text.primary">{state.listingInfo.title}</Typography>
                </Breadcrumbs>
            </Grid>

            {/*Image Slider*/}
            <Grid
                item
                justifyContent='center'
                style={{
                    position: 'relative',
                    marginTop: '1rem'
                }}

            >
                {listingPictures.map((picture, index) => {
                    return (
                        <div key={index}>
                            {index === currentPicture ?
                                (
                                    <img
                                        src={defaultProfilePicture}
                                        style={{ width: '45rem', height: '35rem' }} />) :
                                ("")
                            }
                        </div>
                    );
                })}

                <Button
                    onClick={PreviousPicture}
                >Right
                </Button>
                <Button onClick={NextPicture}>
                    Left
                </Button>
                {currentPicture}
            </Grid>

            {/*More Information */}
            <Grid item container style={{ padding: '1rem', border: '5px solid red', marginTop: '1rem' }}>
                <Grid item container xs={5} direction='column'>
                    <Grid item>
                        <Typography variant='h5'>
                            {state.listingInfo.title}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant='h6'>
                            {state.listingInfo.borough}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant='subtitle'>
                            {formattedDate}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid
                    item
                    container
                    xs={5}
                    alignItems='center'
                    variant='h6'
                    style={{ fontWeight: 'bolder', color: 'green' }}
                >
                    <Typography>
                        {state.listingInfo.listing_types} |

                        {state.listingInfo.propert_status === 'Sale' ?
                            state.listingInfo.price :
                            `$ ${state.listingInfo.price}/${state.listingInfo.rental_frequency}`
                        }
                    </Typography>
                </Grid>
            </Grid>
            <Grid item container>
                {state.listingInfo.furnished ? (
                    <Grid item >
                        <Typography variant='h6'>Furnished</Typography>
                    </Grid>
                ) : ''}
            </Grid>
            <Grid item container>
                {state.listingInfo.pool ? (
                    <Grid item >
                        <Typography variant='h6'>Pool</Typography>
                    </Grid>
                ) : ''}
            </Grid>
            <Grid item container>
                {state.listingInfo.elevator ? (
                    <Grid item >
                        <Typography variant='h6'>Elevator</Typography>
                    </Grid>
                ) : ''}
            </Grid>
            <Grid item container>
                {state.listingInfo.cctv ? (
                    <Grid item >
                        <Typography variant='h6'>CCTV</Typography>
                    </Grid>
                ) : ''}
            </Grid>
            <Grid item container>
                {state.listingInfo.rooms ? (
                    <Grid item >
                        <Typography variant='h6'>{state.listingInfo.rooms}</Typography>
                    </Grid>
                ) : ''}
            </Grid>

            {/*Description*/}
            {state.listingInfo.description ? (<Grid item>
                <Typography variant='h5'>
                    Description
                </Typography>
                <Typography variant='h6'>
                    {state.listingInfo.description}

                </Typography>
            </Grid>) : ''}

            {/*Seller Info*/}
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
                        src={state.sellerProfileInfo.profile_picture !== null ?
                            state.sellerProfileInfo.profile_picture :
                            defaultProfilePicture}
                        onClick={() => navigate(`/agencies/${state.sellerProfileInfo.seller}`)}
                        style={{ height: '10rem', width: '15rem', cursor: 'pointer' }} />
                </Grid>

                <Grid item container direction='column' justifyContent='center'>

                    <Grid item>
                        <Typography variant='h5' style={{ textAlign: 'center', marginTop: '1rem' }}>

                            <span style={{ color: 'green', fontWeight: 'bolder' }}>
                                {state.sellerProfileInfo.agency_name}
                            </span>
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant='h5' style={{ textAlign: 'center', marginTop: '1rem' }}>
                            {state.sellerProfileInfo.phone_number}
                        </Typography>
                    </Grid>

                </Grid>

                {GloblaState.userId == state.listingInfo.seller ? (
                    <Grid item container justifyContent='space-around' style={{ marginBottom: '1rem' }}>
                        <Button variant='contained' color='primary'
                            onClick={handleClickOpen}>Update</Button>
                        <Button
                            variant='contained'
                            color='error'
                            onClick={DeleteHandler}
                            disabled={state.disabledBtn}
                        >Delete</Button>
                        <Dialog
                            open={open}
                            onClose={handleClose}
                            fullWidth
                        >
                            <ListingUpdate listingData={state.listingInfo} closeDialog={handleClose} />

                        </Dialog>
                    </Grid>
                ) : ""}



            </Grid>
            <Grid
                item
                container
                style={{ marginTop: '1rem' }}
                spacing={1}
                justifyContent="space-between">

                <Grid
                    item
                    xs={3}
                    style={{ height: '35rem', overflow: 'auto' }}>


                    {state.listingInfo.listing_pois_within_10km.map(
                        (poi) => {

                            function DegreeToRadian(coordinate) {
                                return coordinate * Math.PI / 180
                            }

                            function CalculateDistance() {

                                const latitude1 = DegreeToRadian(state.listingInfo.latitude)
                                const longitude1 = DegreeToRadian(state.listingInfo.longitude)
                                const latitude2 = DegreeToRadian(poi.location.coordinates[0])
                                const longitude2 = DegreeToRadian(poi.location.coordinates[1])

                                // The formula
                                const latDiff = latitude2 - latitude1;
                                const lonDiff = longitude2 - longitude1;
                                const R = 6371000 / 1000;

                                const a =
                                    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
                                    Math.cos(latitude1) *
                                    Math.cos(latitude2) *
                                    Math.sin(lonDiff / 2) *
                                    Math.sin(lonDiff / 2);
                                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

                                const d = R * c;

                                const dist =
                                    Math.acos(
                                        Math.sin(latitude1) * Math.sin(latitude2) +
                                        Math.cos(latitude1) *
                                        Math.cos(latitude2) *
                                        Math.cos(lonDiff)
                                    ) * R;
                                return dist.toFixed(2);
                            }

                            return (
                                <div key={poi.id} style={{
                                    marginBottom: '0.5rem',
                                    border: '1px solid black',
                                    padding: '0.5rem'
                                }}>
                                    <Typography variant='h6'>
                                        {poi.name}
                                    </Typography>
                                    <Typography variant='subtitle'>
                                        {poi.type} |  <span
                                            style={{ fontWeight: 'bolder', color: 'green' }}>
                                            {CalculateDistance()} km
                                        </span>
                                    </Typography>
                                </div>
                            )
                        }

                    )}
                </Grid>
                <Grid item xs={9}>
                    <MapContainer center={[
                        state.listingInfo.latitude,
                        state.listingInfo.longitude]} zoom={13} scrollWheelZoom={false}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker
                            position={[
                                state.listingInfo.latitude,
                                state.listingInfo.longitude]}
                        >
                            <Popup>
                                {state.listingInfo.title}
                            </Popup>
                        </Marker>
                        {state.listingInfo.listing_pois_within_10km.map(
                            (poi) => {
                                function PoiIcon() {

                                    if (poi.type === 'Stadium') {
                                        return stadiumIcon;
                                    }

                                    else if (poi.type === 'Hospital') {
                                        return hospitalIcon;
                                    }

                                    else if (poi.type === 'university') {
                                        return universityIcon;
                                    }
                                }
                                return (
                                    <Marker key={poi.id}

                                        position={[
                                            poi.location.coordinates[0],
                                            poi.location.coordinates[1]]}
                                        icon={PoiIcon()}
                                    >
                                        <Popup>
                                            {poi.name}
                                        </Popup>
                                    </Marker>
                                )
                            }

                        )}



                    </MapContainer>
                </Grid>

            </Grid>
            <Snackbar
                open={state.openSnack}
                message="You have successfully Deleted Your Property"
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'

                }}

            />
        </div >
    )
}

export default ListingDetails