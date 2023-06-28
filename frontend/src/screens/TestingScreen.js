import { Button, Typography } from '@mui/material'
import React from 'react'
import { useImmerReducer } from 'use-immer'

function TestingScreen() {

    //const [count, setCount] = useState(0)

    const initialState = {
        appleCount: 1,
        bananaCount: 10,
        message: 'Hello',
        happy: false

    }

    function ReducerFunction(draft, action) {
        switch (action.type) {
            case "addApple":
                draft.appleCount = draft.appleCount + 1
                break

            case "addBanana":
                draft.bananaCount = draft.bananaCount + 5
                draft.message = action.customMsg
                break

        }


    }


    const [state, dispatch] = useImmerReducer(ReducerFunction, initialState)

    //console.log(state)
    // console.log(dispatch)





    return (
        <div>
            <Typography>The Apple Count is {state.appleCount} </Typography>
            <Typography>The Banana Count is {state.bananaCount} </Typography>
            <Typography>The Banana Count is {state.message} </Typography>
            <Button onClick={() => dispatch({ type: "addApple" })}> Add </Button>
            <Button

                onClick={() => dispatch({
                    type: "addBanana",
                    customMsg: 'you are now understanding useReducer'
                })

                }> Add </Button>


        </div>
    )
}

export default TestingScreen