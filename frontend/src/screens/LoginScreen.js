import React, { useEffect, useContext } from 'react'
import { useNavigate } from "react-router-dom";
import Axios from 'axios';
import { useImmerReducer } from 'use-immer'

import {
  Grid,
  Typography,
  Button,
  TextField,
  Snackbar,
  Alert
} from '@mui/material';


// Import Dispatch Context here
import DispatchContext from '../Contexts/DispatchContext';
import StateContext from '../Contexts/StateContext';

function LoginScreen() {

  const navigate = useNavigate();

  const GlobalDispatch = useContext(DispatchContext);
  const GlobalState = useContext(StateContext);




  const initialState = {
    usernameValue: '',
    passwordValue: '',
    sendRequest: 0,
    token: '',
    openSnack: false,
    disabledBtn: false,
    serverError: false
  }

  function ReducerFunction(draft, action) {
    switch (action.type) {
      case "catchUsernameChange":
        draft.usernameValue = action.usernameChosen;
        draft.serverError = false
        break
      case "catchPasswordChange":
        draft.passwordValue = action.passwordChosen;
        draft.serverError = false
        break
      case "changeSendRequest":
        draft.sendRequest = draft.sendRequest + 1;
        break
      case "catchToken":
        draft.token = action.tokenValue;
        break
      case "openTheSnack":
        draft.openSnack = true;
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
      case "catchServerError":
        draft.serverError = true;
        break
    }
  }

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState)


  // Function for submitting the form
  function FormSubmit(e) {
    e.preventDefault();
    console.log('formsubmit is working');
    dispatch({ type: 'changeSendRequest' });
    dispatch({ type: 'disableTheButton' });
  }


  useEffect(() => {
    if (state.sendRequest) {
      const source = Axios.CancelToken.source()
      async function SignIn() {
        try {
          const response = await Axios.post(
            "https://www.myhotelweb.xyz/api-auth-djoser/token/login/",
            {
              username: state.usernameValue,
              password: state.passwordValue,

            },
            {
              cancelToken: source.token

            });
          console.log(response);
          dispatch({
            type: 'catchToken',
            tokenValue: response.data.auth_token
          })
          GlobalDispatch({
            type: 'catchToken',
            tokenValue: response.data.auth_token
          })
          //navigate('/')


        } catch (error) {
          console.log(error.response)
          dispatch({ type: 'allowTheButton' })

          dispatch({ type: 'catchServerError' })
        }
      }
      SignIn();
      return () => {
        source.cancel();
      };
    }

  }, [state.sendRequest])


  // useEffect to get the User info
  useEffect(() => {
    if (state.token !== '') {
      const source = Axios.CancelToken.source()
      async function GetUserInfo() {
        try {
          //Axios method is get here
          const response = await Axios.get(
            "/api-auth-djoser/users/me/",
            {
              headers: { Authorization: 'Token '.concat(state.token) }

            },
            {
              cancelToken: source.token

            });
          console.log(response);
          GlobalDispatch({
            type: "userSignIn",
            usernameInfo: response.data.username,
            emailInfo: response.data.email,
            IdInfo: response.data.id,
          })
          dispatch({ type: 'openTheSnack' })
          //navigate('/')


        } catch (error) {
          console.log(error)
        }
      }
      GetUserInfo();
      return () => {
        source.cancel();
      };
    }

  }, [state.token])

  useEffect(() => {
    if (state.openSnack) {
      setTimeout(() => {
        navigate("/")
      }, 1500)
    }
  }, [state.openSnack])

  return (
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
      <form onSubmit={FormSubmit}>
        <Grid item container justifyContent='center'>
          <Typography variant='h5'>
            HUMKO KO JOIN KARLO
          </Typography>
        </Grid>

        {state.serverError ? (<Alert severity="error">Incorrect Username or Password</Alert>) : ''}

        <Grid item container>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            value={state.usernameValue}
            onChange={(e) => dispatch({ type: 'catchUsernameChange', usernameChosen: e.target.value })}
            fullWidth
            style={{ marginTop: '1rem' }}
            error={state.serverError ? true : false}

          />
        </Grid>



        <Grid item container>
          <TextField
            id="password"
            label="Password"
            variant="outlined"
            type='password'
            value={state.passwordValue}
            onChange={(e) => dispatch({ type: 'catchPasswordChange', passwordChosen: e.target.value })}
            fullWidth
            style={{ marginTop: '1rem' }}
            error={state.serverError ? true : false}

          />
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
            disabled={state.disabledBtn}
          >

            LOG IN
          </Button>
        </Grid>




      </form>


      <Grid
        item
        container
        justifyContent='center'
        style={{ marginTop: '1rem' }}>
        <Typography variant='h5'>
          Don't Have an Account yet,
          <span
            onClick={() => navigate('/register')}
            style={{ cursor: 'pointer', color: 'green' }}>SIGN UP</span>
        </Typography>
      </Grid>

      <Snackbar
        open={state.openSnack}
        message="You have successfully Logged In"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'

        }}

      />
    </div>
  )
}

export default LoginScreen