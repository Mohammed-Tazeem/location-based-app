import React, { useEffect, useContext } from 'react'
import HomeScreen from './screens/HomeScreen'
import LoginScreen from './screens/LoginScreen'
import CssBaseline from '@mui/material/CssBaseline';
import ListingScreen from './screens/ListingScreen';
import RegisterScreen from './screens/RegisterScreen';
import TestingScreen from './screens/TestingScreen';
import ProfileScreen from './screens/ProfileScreen';
import AgencyScreen from './screens/AgencyScreen';
import { useImmerReducer } from 'use-immer'

import Header from './components/Header'
import { StyledEngineProvider } from '@mui/material/styles';


import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import DispatchContext from '../src/Contexts/DispatchContext';
import StateContext from '../src/Contexts/StateContext';
import AddPropertyScreen from './screens/AddPropertyScreen';
import AgencyDetailsScreen from './screens/AgencyDetailsScreen';
import ListingDetails from './screens/ListingDetails';

function App() {
  const initialState = {
    userUsername: localStorage.getItem('theUserUsername'),
    userEmail: localStorage.getItem('theUserEmail'),
    userId: localStorage.getItem('theUserId'),
    userToken: localStorage.getItem('theUserToken'),
    userIsLogged: localStorage.getItem('theUserUsername') ? true : false,


  }

  function ReducerFunction(draft, action) {
    switch (action.type) {
      case "catchToken":
        draft.userToken = action.tokenValue;
        break
      case "userSignIn":
        draft.userUsername = action.usernameInfo;
        draft.userEmail = action.emailInfo;
        draft.userId = action.IdInfo;
        draft.userIsLogged = true;
        break

      case "logOut":
        draft.userIsLogged = false;
        break
    }
  }

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState)

  useEffect(() => {
    if (state.userIsLogged) {
      localStorage.setItem('theUserUsername', state.userUsername);
      localStorage.setItem('theUserEmail', state.userEmail);
      localStorage.setItem('theUserId', state.userId);
      localStorage.setItem('theUserToken', state.userToken);
    } else {
      localStorage.removeItem('theUserUsername');
      localStorage.removeItem('theUserEmail');
      localStorage.removeItem('theUserId');
      localStorage.removeItem('theUserToken');
    }
  }, [state.userIsLogged])


  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <StyledEngineProvider injectFirst>
          <CssBaseline />
          <Router>

            <Header />
            <main>

              <Routes>

                <Route path='/' element={<HomeScreen />} />
                <Route path='/login' element={<LoginScreen />} />
                <Route path='/register' element={<RegisterScreen />} />
                <Route path='/listings' element={<ListingScreen />} />
                <Route path='/listings/:id' element={<ListingDetails />} />
                <Route path='/testing' element={<TestingScreen />} />
                <Route path='/addproperty' element={<AddPropertyScreen />} />
                <Route path='/profile' element={<ProfileScreen />} />
                <Route path='/agencies' element={<AgencyScreen />} />
                <Route path='/agencies/:id' element={<AgencyDetailsScreen />} />

              </Routes>

            </main>




          </Router>
        </StyledEngineProvider>
      </DispatchContext.Provider>
    </StateContext.Provider>

  );
}

export default App;
