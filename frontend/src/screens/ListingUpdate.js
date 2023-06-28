import React, { useEffect, useRef, useMemo, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Axios from 'axios';
import { useImmerReducer } from 'use-immer'

import {
    Grid,
    Typography,
    Button,
    TextField,
    FormControlLabel,
    Checkbox,
    Snackbar
} from '@mui/material';

//Context
import StateContext from '../Contexts/StateContext'



const listingTypesOptions = [
    {
        value: '',
        label: '',
    },
    {
        value: 'House',
        label: 'House',
    },
    {
        value: 'Apartment',
        label: 'Apartment',
    },
    {
        value: 'Office',
        label: 'Office',
    }

];
const propertyStatusOptions = [
    {
        value: '',
        label: '',
    },
    {
        value: 'Rent',
        label: 'Rent',
    },
    {
        value: 'Sale',
        label: 'Sale',
    }

];

const rentalFrequencyOptions = [
    {
        value: '',
        label: '',
    },
    {
        value: 'Day',
        label: 'Day',
    },
    {
        value: 'Week',
        label: 'Week',
    },
    {
        value: 'Month',
        label: 'Month',
    }

];

function ListingUpdate(props) {
    const navigate = useNavigate();
    const GloblaState = useContext(StateContext)

    const initialState = {
        titleValue: props.listingData.title,
        listingTypeValue: props.listingData.listing_type,
        descriptionValue: props.listingData.description,
        propertyStatusValue: props.listingData.property_status,
        priceValue: props.listingData.price,
        rentalFrequencyValue: props.listingData.rental_frequency,
        roomsValue: props.listingData.rooms,
        furnishedValue: props.listingData.furnished,
        poolValue: props.listingData.pool,
        elevatorValue: props.listingData.elevator,
        cctvValue: props.listingData.cctv,
        parkingValue: props.listingData.parking,
        sendRequest: 0,
        openSnack: false,
        disabledBtn: false

    }



    function ReducerFunction(draft, action) {
        switch (action.type) {
            case "catchTitleChange":
                draft.titleValue = action.titleChosen;
                break;
            case "catchListingTypeChange":
                draft.listingTypeValue = action.listingTypeChosen;
                break;
            case "catchDescriptionChange":
                draft.descriptionValue = action.descriptionChosen;
                break;

            case "catchPropertyStatusChange":
                draft.propertyStatusValue = action.propertyStatusChosen;
                break;
            case "catchPriceChange":
                draft.priceValue = action.priceChosen;
                break;
            case "catchRentalFrequencyChange":
                draft.rentalFrequencyValue = action.rentalFrequencyChosen;
                break;
            case "catchRoomsChange":
                draft.roomsValue = action.roomsChosen;
                break;
            case "catchFurnishedChange":
                draft.furnishedValue = action.furnishedChosen;
                break;
            case "catchPoolChange":
                draft.poolValue = action.poolChosen;
                break;
            case "catchElevatorChange":
                draft.elevatorValue = action.elevatorChosen;
                break;
            case "catchCCTVChange":
                draft.cctvValue = action.cctvChosen;
                break;
            case "catchParkingChange":
                draft.parkingValue = action.parkingChosen;
                break;

            case "changeSendRequest":
                draft.sendRequest = draft.sendRequest + 1;
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




    function FormSubmit(e) {
        //prevent Default stops the reloading
        e.preventDefault();
        // console.log('form is submitted')
        dispatch({ type: 'changeSendRequest' });
        dispatch({ type: 'disableTheButton' });
    }

    useEffect(() => {
        if (state.sendRequest) {
            async function UpdateProperty() {
                const formData = new FormData()
                formData.append('title', state.titleValue);
                formData.append('description', state.descriptionValue);
                formData.append('listing_types', state.listingTypeValue);
                formData.append('property_status', state.propertyStatusValue);
                formData.append('price', state.priceValue);
                formData.append('rental_frequency', state.rentalFrequencyValue);
                formData.append('rooms', state.roomsValue);
                formData.append('furnished', state.furnishedValue);
                formData.append('pool', state.poolValue);
                formData.append('elevator', state.elevatorValue);
                formData.append('cctv', state.cctvValue);
                formData.append('parking', state.parkingValue);
                formData.append('seller', GloblaState.userId);
                try {
                    const response = await Axios.patch(
                        `/api/listings/${props.listingData.id}/update/`, formData);
                    console.log(response)
                    //navigate(0)
                    dispatch({ type: 'openTheSnack' })


                } catch (e) {
                    console.log(e.response)
                    dispatch({ type: 'allowTheButton' })
                }

            }
            UpdateProperty()
        }

    }, [state.sendRequest])

    function PriceDisplay() {
        if (state.propertyStatusValue === 'Rent' && state.rentalFrequencyValue === 'Day')
            return 'Price Per Day'
        else if (state.propertyStatusValue === 'Rent' && state.rentalFrequencyValue === 'Week')
            return 'Price Per Week'
        else if (state.propertyStatusValue === 'Rent' && state.rentalFrequencyValue === 'Month')
            return 'Price Per Month'
        else
            return 'price'
    }


    useEffect(() => {
        if (state.openSnack) {
            setTimeout(() => {
                navigate(0)
            }, 1500)
        }
    }, [state.openSnack])

    return (
        <div
            style={{
                width: "75%",
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: '3rem',


            }}>
            <form onSubmit={FormSubmit}>
                <Grid item container justifyContent='center'>
                    <Typography variant='h4'>
                        Update Listing
                    </Typography>
                </Grid>

                <Grid item container style={{ marginTop: '1rem' }}>
                    <TextField
                        id="title"
                        label="Title"
                        variant="outlined"
                        value={state.titleValue}
                        onChange={(e) => dispatch({
                            type: 'catchTitleChange',
                            titleChosen: e.target.value
                        })}
                        fullWidth
                        style={{ marginTop: '1rem' }} />
                </Grid>







                {/* <Grid item container style={{ marginTop: '1rem' }}>
                    <TextField
                        id="latitude"
                        label="Latitude"
                        variant="outlined"
                        value={state.latitudeValue}
                        onChange={(e) => dispatch({
                            type: 'catchLatitudeChange',
                            latitudeChosen: e.target.value
                        })}
                        fullWidth
                        style={{ marginTop: '1rem' }} />
                </Grid>

                <Grid item container style={{ marginTop: '1rem' }}>
                    <TextField
                        id="longitude"
                        label="Longitude"
                        variant="outlined"
                        value={state.longitudeValue}
                        onChange={(e) => dispatch({
                            type: 'catchLongitudeChange',
                            longitudeChosen: e.target.value
                        })}
                        fullWidth
                        style={{ marginTop: '1rem' }} />
                </Grid>*/}




                <Grid item container justifyContent='space-between'>
                    <Grid item xs={5} style={{ marginTop: '1rem' }}>
                        <TextField
                            id="listingType"
                            label="Listing Type"
                            variant="outlined"
                            value={state.listingTypeValue}

                            onChange={(e) => dispatch({
                                type: 'catchListingTypeChange',
                                listingTypeChosen: e.target.value
                            })}
                            fullWidth
                            style={{ marginTop: '1rem' }}
                            select
                            SelectProps={{
                                native: true,
                            }} >
                            {listingTypesOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}

                        </TextField>
                    </Grid>


                    <Grid item xs={5} style={{ marginTop: '1rem' }}>
                        <TextField
                            id="propertyStatus"
                            label="Property Status"
                            variant="outlined"
                            value={state.propertyStatusValue}
                            onChange={(e) => dispatch({
                                type: 'catchPropertyStatusChange',
                                propertyStatusChosen: e.target.value
                            })}
                            fullWidth
                            style={{ marginTop: '1rem' }}
                            select
                            SelectProps={{
                                native: true,
                            }} >
                            {propertyStatusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </TextField>
                    </Grid>

                </Grid>

                <Grid item container justifyContent='space-between'>

                    <Grid item xs={5} style={{ marginTop: '1rem' }}>
                        <TextField
                            id="rental-frequency"
                            label="Rental Frequency"
                            variant="outlined"
                            value={state.rentalFrequencyValue}
                            disabled={state.propertyStatusValue === 'Sale' ? true : false}
                            onChange={(e) => dispatch({
                                type: 'catchRentalFrequencyChange',
                                rentalFrequencyChosen: e.target.value
                            })}
                            fullWidth
                            style={{ marginTop: '1rem' }}

                            select
                            SelectProps={{
                                native: true,
                            }} >
                            {rentalFrequencyOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={5} style={{ marginTop: '1rem' }}>
                        <TextField
                            id="price"
                            type='number'
                            label={PriceDisplay()}
                            variant="outlined"
                            value={state.priceValue}
                            onChange={(e) => dispatch({
                                type: 'catchPriceChange',
                                priceChosen: e.target.value
                            })}
                            fullWidth
                            style={{
                                marginTop: '1rem'
                            }} />
                    </Grid>
                </Grid>



                <Grid item container style={{ marginTop: '1rem' }}>
                    <TextField
                        id="description"
                        label="Description"
                        variant="outlined"
                        multiline
                        rows={6}
                        value={state.descriptionValue}
                        onChange={(e) => dispatch({
                            type: 'catchDescriptionChange',
                            descriptionChosen: e.target.value
                        })}
                        fullWidth
                        style={{ marginTop: '1rem' }} />
                </Grid>
                {state.listingTypeValue === 'Office' ? (
                    ""
                ) : (
                    <Grid item container style={{ marginTop: '1rem' }}>
                        <TextField
                            id="rooms"
                            label="Rooms"
                            type='number'
                            variant="outlined"
                            value={state.roomsValue}
                            onChange={(e) => dispatch({
                                type: 'catchRoomsChange',
                                roomsChosen: e.target.value
                            })}
                            fullWidth
                            style={{ marginTop: '1rem' }} />
                    </Grid>

                )}

                <Grid item container justifyContent='center'>
                    <Grid item xs={2} style={{ marginTop: '1rem' }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={state.furnishedValue}
                                    onChange={(e) => dispatch({
                                        type: 'catchFurnishedChange',
                                        furnishedChosen: e.target.checked
                                    })}
                                    name="furnished"
                                    color="primary"
                                />
                            }
                            label="Furnished"
                            style={{ marginTop: '1rem' }}
                        />
                    </Grid>

                    <Grid item xs={2} style={{ marginTop: '1rem' }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={state.poolValue}
                                    onChange={(e) => dispatch({
                                        type: 'catchPoolChange',
                                        poolChosen: e.target.checked
                                    })}
                                    name="pool"
                                    color="primary"
                                />
                            }
                            label="Pool"
                            style={{ marginTop: '1rem' }}
                        />
                    </Grid>

                    <Grid item xs={2} style={{ marginTop: '1rem' }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={state.elevatorValue}
                                    onChange={(e) => dispatch({
                                        type: 'catchElevatorChange',
                                        elevatorChosen: e.target.checked
                                    })}
                                    name="elevator"
                                    color="primary"
                                />
                            }
                            label="Elevator"
                            style={{ marginTop: '1rem' }}
                        />
                    </Grid>

                    <Grid item xs={2} style={{ marginTop: '1rem' }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={state.cctvValue}
                                    onChange={(e) => dispatch({
                                        type: 'catchCCTVChange',
                                        cctvChosen: e.target.checked
                                    })}
                                    name="cctv"
                                    color="primary"
                                />
                            }
                            label="CCTV"
                            style={{ marginTop: '1rem' }}
                        />
                    </Grid>

                    <Grid item xs={2} style={{ marginTop: '1rem' }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={state.parkingValue}
                                    onChange={(e) => dispatch({
                                        type: 'catchParkingChange',
                                        parkingChosen: e.target.checked
                                    })}
                                    name="parking"
                                    color="primary"
                                />
                            }
                            label="Parking"
                            style={{ marginTop: '1rem' }}
                        />
                    </Grid>

                </Grid>




                < Grid
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
                        fullWidth type='submit'
                        disabled={state.disabledBtn}
                        style={{
                            backgroundColor: 'green',
                            color: 'white',
                            fontSize: '1.1rem',
                            marginLeft: '1rem',
                        }
                        }
                    >
                        UPDATE
                    </Button >
                </Grid>

            </form>
            <Button variant='contained'
                onClick={props.closeDialog}
            > Cancel</Button>

            <Snackbar
                open={state.openSnack}
                message="You have successfully Update the Listing"
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'

                }}

            />

        </div >
    )
}

export default ListingUpdate