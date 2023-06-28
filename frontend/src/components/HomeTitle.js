import React from 'react'
import { Button, Typography } from '@mui/material';
import city from '../resources/city.jpg';

function HomeTitle() {
  return (
    <div style={{position:'relative'}}>

    <img alt='background' src ={city} style ={{height:'92vh', width: '100%'}}/>
      <div style={{zIndex:'100', position:'absolute', top:'100px', left:'20px', textAlign:'center'}}>
        <Typography variant='h1'
         style={{color:'white',fontWeight:'bolder',textAlign:'center' }}>
          Find Your Next Property on LBREP
        </Typography>
      
      <Button variant='contained'
       style={{
        fontSize:'2.5rem',
        borderRadius:'15px',
        backgroundColor:'green',
        marginTop:'2rem',
        boxShadow:'3px 3px 3px white',
        }}>
          SEE All The Properties
      </Button>
      </div>
  </div>
  )
}

export default HomeTitle