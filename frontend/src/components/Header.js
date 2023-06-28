import React, { useEffect, useContext, useState } from 'react'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Typography, Menu, MenuItem, Snackbar } from '@mui/material'
import { useNavigate } from 'react-router-dom';
// Import Dispatch Context here
import DispatchContext from '../Contexts/DispatchContext';
import StateContext from '../Contexts/StateContext';
import Axios from 'axios';


function Header() {
    const navigate = useNavigate();
    const GlobalState = useContext(StateContext)
    const GlobalDispatch = useContext(DispatchContext)

    //Menu Component
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    function handleProfile() {
        setAnchorEl(null);
        navigate('/profile')

    }
    const [openSnack, setOpenSnack] = useState(false)

    async function HandleLogout() {
        const confirmLogout = window.confirm('To Kya Aap Logout karna Chahte hain?')
        setAnchorEl(null);
        if (confirmLogout) {
            try {
                const response = await Axios.post("/api-auth-djoser/token/logout/",
                    GlobalState.userToken,
                    {
                        headers: { Authorization: 'Token '.concat(GlobalState.userToken) }

                    });
                console.log(response);
                GlobalDispatch({ type: 'logOut' });
                setOpenSnack(true)

            } catch (e) {
                console.log(e.response);
            }
        }

    }

    useEffect(() => {
        if (openSnack) {
            setTimeout(() => {
                navigate(0)
            }, 1500)
        }
    }, [openSnack])

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <div style={{ marginRight: 'auto' }}>
                        <Button color="inherit" onClick={() => navigate('/')}><Typography variant='h4'>LBREP</Typography></Button>
                    </div>

                    <div>
                        <Button
                            color="inherit"
                            onClick={() => navigate('/listings')}
                        >
                            <Typography variant='h6'>
                                Listings
                            </Typography>
                        </Button>

                        <Button color="inherit" variant='h6' onClick={() => navigate('/agencies')}>
                            <Typography variant='h6'>
                                Agencies
                            </Typography>
                        </Button>

                    </div>

                    <div style={{ marginLeft: 'auto', marginRight: '10px' }}>
                        <Button style={{
                            backgroundColor: 'green',
                            color: 'white',
                            width: '15rem',
                            fontSize: '1.1rem',
                            marginRight: '1rem',


                        }}
                            onClick={() => navigate('/addproperty')}

                        >Property</Button>

                        {GlobalState.userIsLogged ?
                            <Button style={{
                                backgroundColor: 'white',
                                color: 'black',
                                width: '15rem',
                                fontSize: '1.1rem',
                                marginLeft: '1rem',

                            }}
                                onClick={handleClick}
                            //onClick={() => navigate('/login')}
                            >{GlobalState.userUsername}</Button>

                            :

                            <Button style={{
                                backgroundColor: 'white',
                                color: 'black',
                                width: '15rem',
                                fontSize: '1.1rem',
                                marginLeft: '1rem',

                            }}
                                onClick={() => navigate('/login')}
                            >Login</Button>





                        }
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem
                                onClick={handleProfile}
                                style={{
                                    color: 'black',
                                    backgroundColor: 'green',
                                    width: '15rem',
                                    fontWeight: 'bolder',
                                    borderRadius: '15px',
                                    marginBottom: '0.25rem'
                                }}

                            >Profile</MenuItem>
                            <MenuItem
                                onClick={HandleLogout}
                                style={{
                                    color: 'black',
                                    backgroundColor: 'red',
                                    width: '15rem',
                                    fontWeight: 'bolder',
                                    borderRadius: '15px'
                                }}
                            >Logout</MenuItem>
                        </Menu>
                        <Snackbar
                            open={openSnack}
                            message="You have successfully Logged Out"
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center'

                            }}

                        />
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default Header