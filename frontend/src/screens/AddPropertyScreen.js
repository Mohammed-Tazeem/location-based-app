import React, { useEffect, useRef, useMemo, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Axios from 'axios';
import { useImmerReducer } from 'use-immer'

// React-Leaflet Components
import { MapContainer, TileLayer, useMap, Popup, Marker, Polygon, } from 'react-leaflet'



import {
    Grid,
    Typography,
    Button,
    TextField,
    FormControlLabel,
    Checkbox,
    Snackbar,
    Alert
} from '@mui/material';

//Context
import StateContext from '../Contexts/StateContext'


// Borough Are Imported Here
import Camden from "./Assets/Boroughs/Camden";
import Greenwich from "./Assets/Boroughs/Greenwich";
import Hackney from "./Assets/Boroughs/Hackney";
import Hammersmith from "./Assets/Boroughs/Hammersmith";
import Islington from "./Assets/Boroughs/Islington";
import Kensington from "./Assets/Boroughs/Kensington";
import Lambeth from "./Assets/Boroughs/Lambeth";
import Lewisham from "./Assets/Boroughs/Lewisham";
import Southwark from "./Assets/Boroughs/Southwark";
import Hamlets from "./Assets/Boroughs/Hamlets";
import Wandsworth from "./Assets/Boroughs/Wandsworth";
import Westminster from "./Assets/Boroughs/Westminster";
import City_of_London from "./Assets/Boroughs/City_of_London";
import Barking from "./Assets/Boroughs/Barking";
import Barnet from "./Assets/Boroughs/Barnet";
import Bexley from "./Assets/Boroughs/Bexley";
import Brent from "./Assets/Boroughs/Brent";
import Bromley from "./Assets/Boroughs/Bromley";
import Croydon from "./Assets/Boroughs/Croydon";
import Ealing from "./Assets/Boroughs/Ealing";
import Enfield from "./Assets/Boroughs/Enfield";
import Haringey from "./Assets/Boroughs/Haringey";
import Harrow from "./Assets/Boroughs/Harrow";
import Havering from "./Assets/Boroughs/Havering";
import Hillingdon from "./Assets/Boroughs/Hillingdon";
import Hounslow from "./Assets/Boroughs/Hounslow";
import Kingston from "./Assets/Boroughs/Kingston";
import Merton from "./Assets/Boroughs/Merton";
import Newham from "./Assets/Boroughs/Newham";
import Redbridge from "./Assets/Boroughs/Redbridge";
import Richmond from "./Assets/Boroughs/Richmond";
import Sutton from "./Assets/Boroughs/Sutton";
import Waltham from "./Assets/Boroughs/Waltham";

const areaOption = [
    {
        value: '',
        label: '',
    },
    {
        value: 'Inner London',
        label: 'Inner London',
    },
    {
        value: 'Outer London',
        label: 'Outer London',
    }]
const innerLondonOptions = [
    {
        value: "",
        label: "",
    },
    {
        value: "Camden",
        label: "Camden",
    },
    {
        value: "Greenwich",
        label: "Greenwich",
    },
    {
        value: "Hackney",
        label: "Hackney",
    },
    {
        value: "Hammersmith and Fulham",
        label: "Hammersmith and Fulham",
    },
    {
        value: "Islington",
        label: "Islington",
    },
    {
        value: "Kensington and Chelsea",
        label: "Kensington and Chelsea",
    },
    {
        value: "Lambeth",
        label: "Lambeth",
    },
    {
        value: "Lewisham",
        label: "Lewisham",
    },
    {
        value: "Southwark",
        label: "Southwark",
    },
    {
        value: "Tower Hamlets",
        label: "Tower Hamlets",
    },
    {
        value: "Wandsworth",
        label: "Wandsworth",
    },
    {
        value: "Westminster",
        label: "Westminster",
    },
    {
        value: "City of London",
        label: "City of London",
    },
];

const outerLondonOptions = [
    {
        value: "",
        label: "",
    },
    {
        value: "Barking and Dangenham",
        label: "Barking and Dangenham",
    },
    {
        value: "Barnet",
        label: "Barnet",
    },
    {
        value: "Bexley",
        label: "Bexley",
    },
    {
        value: "Brent",
        label: "Brent",
    },
    {
        value: "Bromley",
        label: "Bromley",
    },
    {
        value: "Croydon",
        label: "Croydon",
    },
    {
        value: "Ealing",
        label: "Ealing",
    },
    {
        value: "Enfield",
        label: "Enfield",
    },
    {
        value: "Haringey",
        label: "Haringey",
    },
    {
        value: "Harrow",
        label: "Harrow",
    },
    {
        value: "Havering",
        label: "Havering",
    },
    {
        value: "Hillingdon",
        label: "Hillingdon",
    },
    {
        value: "Hounslow",
        label: "Hounslow",
    },
    {
        value: "Kingston upon Thames",
        label: "Kingston upon Thames",
    },
    {
        value: "Merton",
        label: "Merton",
    },
    {
        value: "Newham",
        label: "Newham",
    },
    {
        value: "Redbridge",
        label: "Redbridge",
    },
    {
        value: "Richmond upon Thames",
        label: "Richmond upon Thames",
    },
    {
        value: "Sutton",
        label: "Sutton",
    },
    {
        value: "Waltham Forest",
        label: "Waltham Forest",
    },
];

const listingTypesOptions = [
    {
        value: '',
        label: '',
    },
    {
        value: 'House',
        label: 'IHouse',
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

function AddPropertyScreen() {
    const navigate = useNavigate();
    const GloblaState = useContext(StateContext)

    const initialState = {
        titleValue: '',
        listingTypeValue: '',
        descriptionValue: '',
        areaValue: '',
        boroughValue: '',
        latitudeValue: '',
        longitudeValue: '',
        propertyStatusValue: '',
        priceValue: '',
        rentalFrequencyValue: '',
        roomsValue: '',
        furnishedValue: false,
        poolValue: false,
        elevatorValue: false,
        cctvValue: false,
        parkingValue: false,
        picture1Value: '',
        picture2Value: '',
        picture3Value: '',
        picture4Value: '',
        picture5Value: '',
        mapInstance: null,
        markerPosition: {
            lat: '51.505',
            lng: '-0.09'
        },
        uploadedPictures: [],
        sendRequest: 0,
        userProfile: {
            agencyName: "",
            phoneNumber: ""
        },
        openSnack: false,
        disabledBtn: false,

        titleErrors: {
            hasErrors: false,
            errorMessage: ''
        },
        listingTypeErrors: {
            hasErrors: false,
            errorMessage: ''
        },
        propertyStatusErrors: {
            hasErrors: false,
            errorMessage: ''
        },

        priceErrors: {
            hasErrors: false,
            errorMessage: ''
        },

        areaErrors: {
            hasErrors: false,
            errorMessage: ''
        },

        boroughErrors: {
            hasErrors: false,
            errorMessage: ''
        },

    }



    function ReducerFunction(draft, action) {
        switch (action.type) {
            case "catchTitleChange":
                draft.titleValue = action.titleChosen;
                draft.titleErrors.hasErrors = false;
                draft.titleChosen.errorMessage = ''
                break;

            case "catchListingTypeChange":
                draft.listingTypeValue = action.listingTypeChosen;
                draft.listingTypeErrors.hasErrors = false;
                draft.listingTypeErrors.errorMessage = ''
                break;

            case "catchDescriptionChange":
                draft.descriptionValue = action.descriptionChosen;
                break;
            case "catchAreaChange":
                draft.areaValue = action.areaChosen;
                break;
            case "catchBoroughChange":
                draft.boroughValue = action.boroughChosen;
                break;
            case "catchLatitudeChange":
                draft.latitudeValue = action.latitudeChosen;
                break;
            case "catchLongitudeChange":
                draft.longitudeValue = action.longitudeChosen;
                break;
            case "catchPropertyStatusChange":
                draft.propertyStatusValue = action.propertyStatusChosen;
                draft.propertyStatusErrors.hasErrors = false;
                draft.propertyStatusErrors.errorMessage = ''
                break;

            case "catchPriceChange":
                draft.priceValue = action.priceChosen;
                draft.priceErrors.hasErrors = false;
                draft.priceErrors.errorMessage = ''
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
            case "catchPicture1Change":
                draft.picture1Value = action.picture1Chosen;
                break;
            case "catchPicture2Change":
                draft.picture2Value = action.picture2Chosen;
                break;
            case "catchPicture3Change":
                draft.picture3Value = action.picture3Chosen;
                break;
            case "catchPicture4Change":
                draft.picture4Value = action.picture4Chosen;
                break;
            case "catchPicture5Change":
                draft.picture5Value = action.picture5Chosen;
                break;
            case "getMap":
                draft.mapInstance = action.mapData;
                break;
            case "changeMarkerPosition":
                draft.markerPosition.lat = action.changeLatitude
                draft.markerPosition.lng = action.changeLongitude
                draft.latitudeValue = ''
                draft.longitudeValue = ''
                break

            case "catchUploadedPictures":
                draft.uploadedPictures = action.pictureChosen
                break;

            case "changeSendRequest":
                draft.sendRequest = draft.sendRequest + 1;
                break

            case "catchUserProfileInfo":
                draft.userProfile.agencyName = action.profileObject.agency_name
                draft.userProfile.phoneNumber = action.profileObject.phone_number
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

            case 'catchTitleErrors':
                if (action.titleChosen.length == 0) {
                    draft.titleErrors.hasErrors = true
                    draft.titleErrors.errorMessage = 'Title Is Empty'
                }
                break

            case 'catchListingTypeErrors':
                if (action.listingTypeChosen.length == 0) {
                    draft.listingTypeErrors.hasErrors = true
                    draft.listingTypeErrors.errorMessage = 'Listing Type Is Empty'
                }
                break

            case 'catchPropertyStatusErrors':
                if (action.propertyStatusChosen.length == 0) {
                    draft.propertyStatusErrors.hasErrors = true
                    draft.propertyStatusErrors.errorMessage = 'Title Is Empty'
                }
                break

            case 'catchPriceErrors':
                if (action.priceChosen.length == 0) {
                    draft.priceErrors.hasErrors = true
                    draft.priceErrors.errorMessage = 'Title Is Empty'
                }


        }
    }

    const [state, dispatch] = useImmerReducer(ReducerFunction, initialState)

    function TheMapComponent() {
        const map = useMap()
        dispatch({ type: 'getMap', mapData: map });
        return null;
    }

    //use Effect to Change the map view depending on chosen Borough

    useEffect(() => {
        if (state.boroughValue === "Camden") {
            state.mapInstance.setView([51.54103467179952, -0.14870897037846917], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.54103467179952,
                changeLongitude: -0.14870897037846917,
            });
        } else if (state.boroughValue === "Greenwich") {
            state.mapInstance.setView([51.486316313935134, 0.005925763550159742], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.486316313935134,
                changeLongitude: 0.005925763550159742,
            });
        } else if (state.boroughValue === "Hackney") {
            state.mapInstance.setView([51.55421119118178, -0.061054618357071246], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.55421119118178,
                changeLongitude: -0.061054618357071246,
            });
        } else if (state.boroughValue === "Hammersmith and Fulham") {
            state.mapInstance.setView([51.496961673854216, -0.22495912738555046], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.496961673854216,
                changeLongitude: -0.22495912738555046,
            });
        } else if (state.boroughValue === "Islington") {
            state.mapInstance.setView([51.54974373783584, -0.10746608414711818], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.54974373783584,
                changeLongitude: -0.10746608414711818,
            });
        } else if (state.boroughValue === "Kensington and Chelsea") {
            state.mapInstance.setView([51.49779579272461, -0.1908227388030137], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.49779579272461,
                changeLongitude: -0.1908227388030137,
            });
        } else if (state.boroughValue === "Lambeth") {
            state.mapInstance.setView([51.457598293463874, -0.12030697867735651], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.457598293463874,
                changeLongitude: -0.12030697867735651,
            });
        } else if (state.boroughValue === "Lewisham") {
            state.mapInstance.setView([51.45263474786279, -0.017657579903930083], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.45263474786279,
                changeLongitude: -0.017657579903930083,
            });
        } else if (state.boroughValue === "Southwark") {
            state.mapInstance.setView([51.47281414549159, -0.07657080658293915], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.47281414549159,
                changeLongitude: -0.07657080658293915,
            });
        } else if (state.boroughValue === "Tower Hamlets") {
            state.mapInstance.setView([51.52222760075287, -0.03427379217816716], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.52222760075287,
                changeLongitude: -0.03427379217816716,
            });
        } else if (state.boroughValue === "Wandsworth") {
            state.mapInstance.setView([51.45221859319854, -0.1910578642162312], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.45221859319854,
                changeLongitude: -0.1910578642162312,
            });
        } else if (state.boroughValue === "Westminster") {
            state.mapInstance.setView([51.51424692365236, -0.1557886924596714], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.51424692365236,
                changeLongitude: -0.1557886924596714,
            });
        } else if (state.boroughValue === "City of London") {
            state.mapInstance.setView([51.51464652712437, -0.09207257068971077], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.51464652712437,
                changeLongitude: -0.09207257068971077,
            });
        } else if (state.boroughValue === "Barking and Dangenham") {
            state.mapInstance.setView([51.54475354441844, 0.13730036835406337], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.54475354441844,
                changeLongitude: 0.13730036835406337,
            });
        } else if (state.boroughValue === "Barnet") {
            state.mapInstance.setView([51.61505810569654, -0.20104146847921367], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.61505810569654,
                changeLongitude: -0.20104146847921367,
            });
        } else if (state.boroughValue === "Bexley") {
            state.mapInstance.setView([51.45784336604241, 0.1386755093498764], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.45784336604241,
                changeLongitude: 0.1386755093498764,
            });
        } else if (state.boroughValue === "Brent") {
            state.mapInstance.setView([51.55847917911348, -0.2623697479848262], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.55847917911348,
                changeLongitude: -0.2623697479848262,
            });
        } else if (state.boroughValue === "Bromley") {
            state.mapInstance.setView([51.37998089785619, 0.056091833685512606], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.37998089785619,
                changeLongitude: 0.056091833685512606,
            });
        } else if (state.boroughValue === "Croydon") {
            state.mapInstance.setView([51.36613815034951, -0.08597242883896719], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.36613815034951,
                changeLongitude: -0.08597242883896719,
            });
        } else if (state.boroughValue === "Ealing") {
            state.mapInstance.setView([51.52350664933499, -0.33384540332179463], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.52350664933499,
                changeLongitude: -0.33384540332179463,
            });
        } else if (state.boroughValue === "Enfield") {
            state.mapInstance.setView([51.650718869158275, -0.07999628038008409], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.650718869158275,
                changeLongitude: -0.07999628038008409,
            });
        } else if (state.boroughValue === "Haringey") {
            state.mapInstance.setView([51.591214467057085, -0.10319530898095737], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.591214467057085,
                changeLongitude: -0.10319530898095737,
            });
        } else if (state.boroughValue === "Harrow") {
            state.mapInstance.setView([51.60218606442213, -0.33540294600548437], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.60218606442213,
                changeLongitude: -0.33540294600548437,
            });
        } else if (state.boroughValue === "Havering") {
            state.mapInstance.setView([51.57230623503768, 0.2256095005492423], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.57230623503768,
                changeLongitude: 0.2256095005492423,
            });
        } else if (state.boroughValue === "Hillingdon") {
            state.mapInstance.setView([51.5430033964411, -0.4435905982156584], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.5430033964411,
                changeLongitude: -0.4435905982156584,
            });
        } else if (state.boroughValue === "Hounslow") {
            state.mapInstance.setView([51.475988836438525, -0.3660060903075389], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.475988836438525,
                changeLongitude: -0.3660060903075389,
            });
        } else if (state.boroughValue === "Kingston upon Thames") {
            state.mapInstance.setView([51.39401320084246, -0.2841003136670212], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.39401320084246,
                changeLongitude: -0.2841003136670212,
            });
        } else if (state.boroughValue === "Merton") {
            state.mapInstance.setView([51.41148120353897, -0.18805584151013174], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.41148120353897,
                changeLongitude: -0.18805584151013174,
            });
        } else if (state.boroughValue === "Newham") {
            state.mapInstance.setView([51.533282275935306, 0.031692014878610064], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.533282275935306,
                changeLongitude: 0.031692014878610064,
            });
        } else if (state.boroughValue === "Redbridge") {
            state.mapInstance.setView([51.585885574074965, 0.07764760021283491], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.585885574074965,
                changeLongitude: 0.07764760021283491,
            });
        } else if (state.boroughValue === "Richmond upon Thames") {
            state.mapInstance.setView([51.450368976651696, -0.30801386088548505], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.450368976651696,
                changeLongitude: -0.30801386088548505,
            });
        } else if (state.boroughValue === "Sutton") {
            state.mapInstance.setView([51.363672040828504, -0.1702200806863363], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.363672040828504,
                changeLongitude: -0.1702200806863363,
            });
        } else if (state.boroughValue === "Waltham Forest") {
            state.mapInstance.setView([51.59466635701797, -0.012215840493378892], 12);
            dispatch({
                type: "changeMarkerPosition",
                changeLatitude: 51.59466635701797,
                changeLongitude: -0.012215840493378892,
            });
        }
    }, [state.boroughValue]);


    // Borough Display Function
    function BoroughDisplay() {
        if (state.boroughValue === "Camden") {
            return <Polygon positions={Camden} />;
        } else if (state.boroughValue === "Greenwich") {
            return <Polygon positions={Greenwich} />;
        } else if (state.boroughValue === "Hackney") {
            return <Polygon positions={Hackney} />;
        } else if (state.boroughValue === "Hammersmith and Fulham") {
            return <Polygon positions={Hammersmith} />;
        } else if (state.boroughValue === "Islington") {
            return <Polygon positions={Islington} />;
        } else if (state.boroughValue === "Kensington and Chelsea") {
            return <Polygon positions={Kensington} />;
        } else if (state.boroughValue === "Lambeth") {
            return <Polygon positions={Lambeth} />;
        } else if (state.boroughValue === "Lewisham") {
            return <Polygon positions={Lewisham} />;
        } else if (state.boroughValue === "Southwark") {
            return <Polygon positions={Southwark} />;
        } else if (state.boroughValue === "Tower Hamlets") {
            return <Polygon positions={Hamlets} />;
        } else if (state.boroughValue === "Wandsworth") {
            return <Polygon positions={Wandsworth} />;
        } else if (state.boroughValue === "Westminster") {
            return <Polygon positions={Westminster} />;
        } else if (state.boroughValue === "City of London") {
            return <Polygon positions={City_of_London} />;
        } else if (state.boroughValue === "Barking and Dangenham") {
            return <Polygon positions={Barking} />;
        } else if (state.boroughValue === "Barnet") {
            return <Polygon positions={Barnet} />;
        } else if (state.boroughValue === "Bexley") {
            return <Polygon positions={Bexley} />;
        } else if (state.boroughValue === "Brent") {
            return <Polygon positions={Brent} />;
        } else if (state.boroughValue === "Bromley") {
            return <Polygon positions={Bromley} />;
        } else if (state.boroughValue === "Croydon") {
            return <Polygon positions={Croydon} />;
        } else if (state.boroughValue === "Ealing") {
            return <Polygon positions={Ealing} />;
        } else if (state.boroughValue === "Enfield") {
            return <Polygon positions={Enfield} />;
        } else if (state.boroughValue === "Haringey") {
            return <Polygon positions={Haringey} />;
        } else if (state.boroughValue === "Harrow") {
            return <Polygon positions={Harrow} />;
        } else if (state.boroughValue === "Havering") {
            return <Polygon positions={Havering} />;
        } else if (state.boroughValue === "Hillingdon") {
            return <Polygon positions={Hillingdon} />;
        } else if (state.boroughValue === "Hounslow") {
            return <Polygon positions={Hounslow} />;
        } else if (state.boroughValue === "Kingston upon Thames") {
            return <Polygon positions={Kingston} />;
        } else if (state.boroughValue === "Merton") {
            return <Polygon positions={Merton} />;
        } else if (state.boroughValue === "Newham") {
            return <Polygon positions={Newham} />;
        } else if (state.boroughValue === "Redbridge") {
            return <Polygon positions={Redbridge} />;
        } else if (state.boroughValue === "Richmond upon Thames") {
            return <Polygon positions={Richmond} />;
        } else if (state.boroughValue === "Sutton") {
            return <Polygon positions={Sutton} />;
        } else if (state.boroughValue === "Waltham Forest") {
            return <Polygon positions={Waltham} />;
        }
    }

    //Draggable Marker
    const markerRef = useRef(null)
    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current
                console.log(marker.getLatLng());
                dispatch({ type: 'catchLatitudeChange', latitudeChosen: marker.getLatLng().lat })
                dispatch({ type: 'catchLongitudeChange', longitudeChosen: marker.getLatLng().lng })


            },
        }),
        [],
    )

    // Pictures Upload Effects
    useEffect(() => {
        if (state.uploadedPictures[0]) {
            dispatch({
                type: 'catchPicture1Change', picture1Chosen: state.uploadedPictures[0],
            })
        }

    }, [state.uploadedPictures])
    useEffect(() => {
        if (state.uploadedPictures[0]) {
            dispatch({
                type: 'catchPicture2Change', picture2Chosen: state.uploadedPictures[0],
            })
        }

    }, [state.uploadedPictures])
    useEffect(() => {
        if (state.uploadedPictures[0]) {
            dispatch({
                type: 'catchPicture3Change', picture3Chosen: state.uploadedPictures[0],
            })
        }

    }, [state.uploadedPictures])

    useEffect(() => {
        if (state.uploadedPictures[0]) {
            dispatch({
                type: 'catchPicture4Change', picture4Chosen: state.uploadedPictures[0],
            })
        }

    }, [state.uploadedPictures])

    useEffect(() => {
        if (state.uploadedPictures[0]) {
            dispatch({
                type: 'catchPicture5Change', picture5Chosen: state.uploadedPictures[0],
            })
        }

    }, [state.uploadedPictures])

    // Request to get User Profile

    useEffect(() => {
        async function getProfileInfo() {
            try {
                const response = await Axios.get(
                    `/api/profiles/${GloblaState.userId}/`);
                console.log(response.data)
                dispatch({ type: 'catchUserProfileInfo', profileObject: response.data })

            } catch (e) {
                console.log(e.response)
            }
        }
        getProfileInfo();
    }, [])

    function FormSubmit(e) {
        //prevent Default stops the reloading
        e.preventDefault();
        // console.log('form is submitted')
        /* if (
             !state.titleErrors.hasErrors &&
             !state.listingTypeErrors.hasErrors &&
             !state.propertyStatusErrors.hasErrors &&
             !state.priceErrors.hasErrors &&
             !state.areaErrors.hasErrors &&
             !state.boroughErrors.hasErrors
         ) {} */


        dispatch({ type: 'changeSendRequest' });
        dispatch({ type: 'disableTheButton' });




    }

    useEffect(() => {
        if (state.sendRequest) {
            async function AddProperty() {
                const formData = new FormData()
                formData.append('title', state.titleValue);
                formData.append('description', state.descriptionValue);
                formData.append('area', state.areaValue);
                formData.append('borough', state.boroughValue);
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
                formData.append('latitude', state.latitudeValue);
                formData.append('longitude', state.longitudeValue);
                formData.append('longitude', state.longitudeValue);
                formData.append('picture1', state.picture1Value);
                formData.append('picture2', state.picture2Value);
                formData.append('picture3', state.picture3Value);
                formData.append('picture4', state.picture4Value);
                formData.append('picture5', state.picture5Value);
                formData.append('seller', GloblaState.userId);
                try {
                    const response = await Axios.post(
                        "https://www.myhotelweb.xyz/api/listings/create/", formData);
                    console.log(response);
                    dispatch({ type: 'openTheSnack' });
                    //navigate('/listings')


                } catch (e) {
                    console.log(e.response)
                    dispatch({ type: 'allowTheButton' });
                }

            }
            AddProperty()
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

    function SubmitButtonDisplay() {
        if (GloblaState.userIsLogged
            && state.userProfile.agencyName !== null
            && state.agencyName !== '' && state.userProfile.phoneNumber !== null
            && state.userProfile.phoneNumber !== '') {

            return (
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

                    SUBMIT
                </Button >
            );

        }
        else if (
            GloblaState.userIsLogged && (
                state.userProfile.agencyName === null || state.userProfile.agencyName === '' ||
                state.userProfile.phoneNumber === null || state.userProfile === ''
            )) {

            return (
                <Button
                    variant="outlined"
                    fullWidth type='submit'
                    onClick={() => navigate('/profile')}
                    style={{
                        backgroundColor: 'green',
                        color: 'white',
                        fontSize: '1.1rem',
                        marginLeft: '1rem',
                    }}
                >

                    Complete Your Details
                </Button >
            );
        }
        else if (!GloblaState.userIsLogged) {
            return (
                <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate('/login')}

                    style={{
                        backgroundColor: 'green',
                        color: 'white',
                        fontSize: '1.1rem',
                        marginLeft: '1rem',
                    }}
                >

                    SIGN IN To Add A property
                </Button >

            )
        }

    }

    useEffect(() => {
        if (state.openSnack) {
            setTimeout(() => {
                navigate("/listings")
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
                border: '5px solid black',
                padding: '1rem'


            }}>
            <form onSubmit={FormSubmit}>
                <Grid item container justifyContent='center'>
                    <Typography variant='h4'>
                        SUBMIT A PROPERTY
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

                        onBlur={(e) => dispatch({
                            type: 'catchTitleErrors',
                            titleChosen: e.target.value
                        })}
                        fullWidth
                        style={{ marginTop: '1rem' }}
                        error={state.titleErrors.hasErrors ? true : false}
                        helperText={state.titleErrors.errorMessage}
                    />
                </Grid>


                <Grid item container style={{ marginTop: '1rem' }}>
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
                </Grid>




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

                            onBlur={(e) => dispatch({
                                type: 'catchListingTypeErrors',
                                listingTypeChosen: e.target.value
                            })}
                            fullWidth
                            style={{ marginTop: '1rem' }}
                            select
                            SelectProps={{
                                native: true,
                            }}
                            error={state.listingTypeErrors.hasErrors ? true : false}
                            helperText={state.listingTypeErrors.errorMessage}
                        >
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
                            onBlur={(e) => dispatch({
                                type: 'catchPropertyStatusErrors',
                                propertyStatusChosen: e.target.value
                            })}
                            fullWidth
                            style={{ marginTop: '1rem' }}
                            select
                            SelectProps={{
                                native: true,
                            }}
                            error={state.propertyStatusErrors.hasErrors ? true : false}
                            helperText={state.propertyStatusErrors.errorMessage}

                        >
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
                            onBlur={(e) => dispatch({
                                type: 'catchRentalFrequencyChange',
                                rentalFrequencyChosen: e.target.value
                            })}

                            fullWidth
                            style={{ marginTop: '1rem' }}

                            select
                            SelectProps={{
                                native: true,
                            }}
                        >
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
                            onBlur={(e) => dispatch({
                                type: 'catchPriceErrors',
                                priceChosen: e.target.value
                            })}
                            fullWidth
                            style={{
                                marginTop: '1rem'
                            }}
                            error={state.priceErrors.hasErrors ? true : false}
                            helperText={state.priceErrors.errorMessage}

                        />
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



                <Grid item container justifyContent='space-between'>
                    <Grid item xs={5} style={{ marginTop: '1rem' }}>
                        <TextField
                            id="area"
                            label="Area"
                            variant="outlined"
                            value={state.areaValue}
                            onChange={(e) => dispatch({
                                type: 'catchAreaChange',
                                areaChosen: e.target.value
                            })}
                            onBlur={(e) => dispatch({
                                type: 'catchAreaErrors',
                                areaChosen: e.target.value
                            })}
                            fullWidth
                            select
                            style={{ marginTop: '1rem' }}
                            SelectProps={{
                                native: true,
                            }}
                            error={state.areaErrors.hasErrors ? true : false}
                            helperText={state.areaErrors.errorMessage}
                        >
                            {areaOption.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={5} style={{ marginTop: '1rem' }}>
                        <TextField
                            id="borough"
                            label="Borough"
                            variant="outlined"
                            value={state.boroughValue}
                            onChange={(e) => dispatch({
                                type: 'catchBoroughChange',
                                boroughChosen: e.target.value
                            })}
                            onBlur={(e) => dispatch({
                                type: 'catchBoroughErrors',
                                boroughChosen: e.target.value
                            })}
                            fullWidth
                            style={{ marginTop: '1rem' }}
                            select
                            SelectProps={{
                                native: true,
                            }}
                            error={state.boroughErrors.hasErrors ? true : false}
                            helperText={state.boroughErrors.errorMessage}

                        >
                            {state.areaValue === 'Inner London' ?
                                innerLondonOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>)) :
                                ""
                            }
                            {state.areaValue === 'Outer London' ?
                                outerLondonOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>)) :
                                ""
                            }

                        </TextField>
                    </Grid>
                </Grid>
                <Grid item style={{ marginTop: '2rem' }}>

                    {state.latitudeValue && state.longitudeValue ? (
                        <Alert severity='success'>Your Property id located @ {state.latitudeValue},{state.longitudeValue}</Alert>
                    ) : (

                        <Alert severity='warning'
                        >Locate your Property</Alert>
                    )}
                </Grid>
                <Grid item container style={{ height: '35rem', marginTop: '2rem' }}>


                    <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <TheMapComponent />
                        {BoroughDisplay()}
                        <Marker
                            draggable
                            eventHandlers={eventHandlers}
                            position={state.markerPosition}
                            ref={markerRef}>
                        </Marker>
                    </MapContainer>
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

                        UPLOAD IMAGES (MAX 5)
                        <input
                            type='file'
                            multiple
                            hidden
                            accept='image/png, image/gif, image/jpg, image/jpeg'
                            onChange={(e) => dispatch({
                                type: 'catchUploadedPictures',
                                pictureChosen: e.target.files

                            })} />
                    </Button>
                </Grid>
                <Grid item container>
                    <ul>
                        {state.picture1Value ? <li>{state.picture1Value.name} </li> : ''}
                        {state.picture2Value ? <li>{state.picture2Value.name} </li> : ''}
                        {state.picture3Value ? <li>{state.picture3Value.name} </li> : ''}
                        {state.picture4Value ? <li>{state.picture4Value.name} </li> : ''}
                        {state.picture5Value ? <li>{state.picture5Value.name} </li> : ''}
                    </ul>
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


                    {SubmitButtonDisplay()}
                </Grid>




            </form>
            {/*
        Testing of The Map Components
        */}

            <Snackbar
                open={state.openSnack}
                message="You have successfully Added a Property"
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'

                }}

            />
        </div >
    )
}

export default AddPropertyScreen