import React, {useState} from 'react'
import { Button, Typography } from '@mui/material';

function CustomCard() {
  const [btnColor, setBtncolor]= useState('error')
  return (
    <div
    style={{width:'100%', border:'2px solid black', padding:'15px'}}
    
    >
    
    <Typography variant='h1'> Title </Typography>
    <Typography variant='body1'> here are many variations of passages of Lorem
    Ipsum available, but the majority have suffered alteration in some form, by injected humour,
    or randomised words which don't look even slightly believable. If you are going to use a passage
    of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.
    All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making
    this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined
    with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable.
    The generated Lorem Ipsum is therefore always free from repetition, injected humour,
    or non-characteristic words etc.
    </Typography>

     <Button style ={{backgroundColor:'yellow'}}
    // Onclick Event To Change the color of Button
     onClick = {()=> setBtncolor('success')}
     color={btnColor}
     variant="contained"
     size='medium'
     >
     Turn It Green</Button>
    </div>
  )
}

export default CustomCard