import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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

function RegisterScreen() {

  const navigate = useNavigate();

  const initialState = {
    usernameValue: '',
    emailValue: '',
    passwordValue: '',
    password2Value: '',
    sendRequest: 0,
    openSnack: false,
    disabledBtn: false,
    usernameErrors: {
      hasErrors: false,
      errorMessage: ''
    },
    emailErrors: {
      hasErrors: false,
      errorMessage: ''
    },
    /*passwordErrors: {
      hasErrors: false,
      errorMessage: ''
    }, */
    password2HelperText: "",
    serverMessageUsername: '',
    serverMessageEmail: '',
    serverMessageSimilarPassword: '',
    serverMessageCommonPassword: '',
    serverMessageNumericPassword: ''


  }

  function ReducerFunction(draft, action) {
    switch (action.type) {
      case "catchUsernameChange":
        draft.usernameValue = action.usernameChosen;
        draft.usernameErrors.hasErrors = false;
        draft.usernameErrors.errorMessage = '';
        draft.serverMessageUsername = ''
        break
      case "catchEmailChange":
        draft.emailValue = action.emailChosen;
        draft.emailErrors.hasErrors = false;
        draft.emailErrors.errorMessage = '';
        draft.serverMessageEmail = ''
        break
      case "catchPasswordChange":
        draft.passwordValue = action.passwordChosen;
        //draft.passwordErrors.hasErrors = false;
        //draft.passwordErrors.errorMessage = ''
        draft.serverMessageSimilarPassword = false
        draft.serverMessageCommonPassword = false
        draft.serverMessageNumericPassword = false
        break
      case "catchPassword2Change":
        draft.password2Value = action.password2Chosen;
        /*if (action.password2Chosen !== draft.passwordValue) {
          draft.password2HelperText = 'Password Must Match'
        } else if (action.password2Chosen === draft.passwordValue) {
          draft.password2HelperText = ''
        }*/
        break

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
      case "catchUsernameErrors":
        if (action.usernameChosen.length == 0) {
          draft.usernameErrors.hasErrors = true
          draft.usernameErrors.errorMessage = 'This Field Must Not be Empty'
        } else if (action.usernameChosen.length < 5) {
          draft.usernameErrors.hasErrors = true
          draft.usernameErrors.errorMessage = 'The Username Must Have Atleast five characters'
        } else if (!/^([a-zA-Z0-9]+)$/.test(action.usernameChosen)) {
          draft.usernameErrors.hasErrors = true
          draft.usernameErrors.errorMessage = 'Special Characters are not Allowed'
        }
        break

      case "catchEmailErrors":
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(action.emailChosen)) {
          draft.emailErrors.hasErrors = true;
          draft.emailErrors.errorMessage = "Please Enter a Valid Email"
        }
      /*case 'catchPasswordErrors':
        if (action.passwordChosen.length) {
          draft.passwordErrors.hasErrors = true
          draft.passwordErrors.errorMessage = 'Atleast Have 8 Characters'
        }
        break*/

      case 'usernameExists':
        draft.serverMessageUsername = "this Username already Exists"
        break

      case 'emailExists':
        draft.serverMessageEmail = "this Email already Exists"
        break

      case 'similarPassword':
        draft.serverMessageSimilarPassword = 'The password is too similar to the username.'
        break

      case 'commonPassword':
        draft.serverMessageCommonPassword = 'This password is too common.'
        break

      case 'numericPassword':
        draft.serverMessageNumericPassword = 'This password is entirely numeric.'
        break


    }
  }

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState)



  /*useEffect(() => {
    console.log(usernameValue, emailValue, passwordValue, password2Value)
  }, [usernameValue, emailValue, passwordValue, password2Value])*/


  function FormSubmit(e) {
    //prevent Default stops the reloading
    e.preventDefault();
    // console.log('form is submitted')

    dispatch({ type: 'changeSendRequest' });
    dispatch({ type: 'disableTheButton' })


  }



  useEffect(() => {
    if (state.sendRequest) {
      const source = Axios.CancelToken.source()
      async function SignUp() {
        try {
          const response = await Axios.post(
            "/api-auth-djoser/users/",
            {
              username: state.usernameValue,
              email: state.emailValue,
              password: state.passwordValue,
              re_password: state.password2Value
            },
            {
              cancelToken: source.token

            });
          console.log(response);
          dispatch({ type: 'openTheSnack' })
          //navigate('/')


        } catch (error) {
          console.log(error.response)
          dispatch({ type: 'allowTheButton' })
          if (error.response.data.username) {
            dispatch({ type: 'usernameExists' });
          } else if (error.response.data.email) {
            dispatch({ type: 'emailExists' })
          }
          else if (error.response.data.password[0] == 'The password is too similar to the username.') {
            dispatch({ type: 'similarPassword' })
          }
          else if (error.response.data.password[0] === 'This password is too common.') {
            dispatch({ type: 'commonPassword' })
          }
          else if (error.response.data.password[0] === "This password is entirely numeric.") {
            dispatch({ type: 'numericPassword' })
          }
        }
      }
      SignUp();
      return () => {
        source.cancel();
      };
    }

  }, [state.sendRequest])
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
          <Typography variant='h4'>
            Create Your Account
          </Typography>
        </Grid>
        {state.serverMessageUsername ? (<Alert severity='error' >{state.serverMessageUsername}</Alert>) :
          ''
        }
        {state.serverMessageEmail ? (<Alert severity='error' >{state.serverMessageEmail}</Alert>) :
          ''
        }

        {state.serverMessageSimilarPassword ? (<Alert severity='error' >{state.serverMessageSimilarPassword}</Alert>) :
          ''
        }
        {state.serverMessageCommonPassword ? (<Alert severity='error' >{state.serverMessageCommonPassword}</Alert>) :
          ''
        }
        {state.serverMessageNumericPassword ? (<Alert severity='error' >{state.serverMessageNumericPassword}</Alert>) :
          ''
        }


        <Grid item container>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            value={state.usernameValue}
            onChange={(e) => dispatch({
              type: 'catchUsernameChange',
              usernameChosen: e.target.value
            })}

            onBlur={(e) => dispatch({
              type: 'catchUsernameErrors',
              usernameChosen: e.target.value
            })}

            error={state.usernameErrors.hasErrors ? true : false}
            helperText={state.usernameErrors.errorMessage}


            fullWidth
            style={{ marginTop: '1rem' }} />
        </Grid>

        <Grid item container>
          <TextField
            id="email"
            label="E-mail"
            variant="outlined"
            value={state.emailValue}
            onChange={(e) => dispatch({ type: 'catchEmailChange', emailChosen: e.target.value })}
            onBlur={(e) => dispatch({ type: 'catchEmailErrors', emailChosen: e.target.value })}
            error={state.emailErrors.hasErrors ? true : false}
            helperText={state.emailErrors.errorMessage}
            fullWidth
            style={{ marginTop: '1rem' }} />
        </Grid>

        <Grid item container>
          <TextField
            id="password"
            label="Password"
            variant="outlined"
            type='password'
            value={state.passwordValue}
            onChange={(e) => dispatch({ type: 'catchPasswordChange', passwordChosen: e.target.value })}
            //onBlur={(e) => dispatch({ type: 'catchPasswordErrors', passwordChosen: e.target.value })}
            //error={state.passwordErrors.hasErrors ? true : false}
            //helperText={state.passwordErrors.errorMessage}
            fullWidth
            style={{ marginTop: '1rem' }} />
        </Grid>

        <Grid item container>
          <TextField
            id="conf-password"
            label="Confirm Password"
            variant="outlined"
            type='password'
            value={state.password2Value}
            onChange={(e) => dispatch({ type: 'catchPassword2Change', password2Chosen: e.target.value })}
            fullWidth
            style={{ marginTop: '1rem' }}
          //helperText={state.password2HelperText}
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
            fullWidth type='submit'
            disabled={state.disabledBtn}
            style={{
              backgroundColor: 'green',
              color: 'white',
              fontSize: '1.1rem',
              marginLeft: '1rem',
            }}
          >

            SIGN UP
          </Button>
        </Grid>




      </form>

      <Grid
        item
        container
        justifyContent='center'
        style={{ marginTop: '1rem' }}>
        <Typography variant='h5'>
          Already Have an Account,
          <span
            onClick={() => navigate('/login')}
            style={{ cursor: 'pointer', color: 'green' }}>SIGN IN</span>
        </Typography>
      </Grid>
      <Snackbar
        open={state.openSnack}
        message="You have successfully Created An Account"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'

        }}

      />
    </div>
  )
}

export default RegisterScreen