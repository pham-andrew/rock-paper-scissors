import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { Button } from '@material-ui/core';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import { DialogTitle } from '@material-ui/core';
import { DialogContent } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { Collapse } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: 'auto',
      width:'50%',
      height: theme.spacing(100),
      marginTop: theme.spacing(10)
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  mt: {
    marginTop: '50px',
  },

}));

export default function App() {
  const classes = useStyles();

  const [oneScore, setOneScore] = React.useState(0)
  const [twoScore, setTwoScore] = React.useState(0)
  const oneScoreRef = useRef(0)
  const twoScoreRef = useRef(0)
  oneScoreRef.current=oneScore
  twoScoreRef.current=twoScore

  const [log, setLog] = React.useState([])
  const logRef = useRef([])
  logRef.current=log

  const [moveOne, setMoveOne] = React.useState('')
  const [moveTwo, setMoveTwo] = React.useState('')

  const [rerender, triggerRerender] = useState(0);

  // const [oneWinsOpen, setOneWinsOpen] = React.useState(false)
  // const [twoWinsOpen, setTwoWinsOpen] = React.useState(false)
  // const [drawOpen, setDrawOpen] = React.useState(false)
  // const [errorOpen, setErrorOpen] = React.useState(false)
  // const [scoreOpen, setScoreOpen] = React.useState(false)
  // const [setOneOpen, setSetOneOpen] = React.useState(false)
  // const [setTwoOpen, setSetTwoOpen] = React.useState(false)

  const handleOneWin = () => {
    setTwoScore(oneScore + 1)
    setLog(log.concat(["Player 1 Wins, Score: " + oneScoreRef.current]))
    handleSet()
    //setOneWinsOpen(true)
    //setTimeout(function(){ setOneWinsOpen(false) }, 3000)
  }
  const handleTwoWin = () => {
    setTwoScore(twoScore + 1)
    setLog(log.concat(["Player 2 Wins, Score: " + twoScoreRef.current]))
    handleSet()
    //setTwoWinsOpen(true)
    //setTimeout(function(){ setTwoWinsOpen(false) }, 3000)
  }
  const handleDraw = () => {
    setLog(log.concat(["Draw"]))
    //setDrawOpen(true)
    //setTimeout(function(){ setDrawOpen(false) }, 3000)
  }
  const handleSet = () => {
    if(oneScore === 2){
      setLog(log.concat(["Player 1 Wins Set"]))
      setOneScore(0)
      setTwoScore(0)
      //setSetOneOpen(true)
      //setTimeout(function(){ setSetOneOpen(false) }, 3000);
    }
    else if(twoScore === 2){
      setLog(log.concat(["Player 2 Wins Set"]))
      setOneScore(0)
      setTwoScore(0)
      //setSetTwoOpen(true)
      //setTimeout(function(){ setSetOneOpen(false) }, 3000);
    }
    else{
      //setScoreOpen(true)
      //setTimeout(function(){ setScoreOpen(false) }, 3000);
    }
  }
  const handleError = () => {
    //setErrorOpen(true)
    //setTimeout(function(){ setErrorOpen(false) }, 3000);
  }

  // const score = () => {
  //   if( (moveOne==='rock'||moveOne==='paper'||moveOne==='scissors')
  //    && (moveTwo==='rock'||moveTwo==='paper'||moveTwo==='scissors'))
  //     if(moveOne==='rock'){
  //       if(moveTwo==='rock')
  //         handleDraw()
  //       if(moveTwo==='paper')
  //         handleTwoWin()
  //       if(moveTwo==='scissors')
  //         handleOneWin()
  //     }
  //     if(moveOne==='paper'){
  //       if(moveTwo==='rock')
  //         handleOneWin()
  //       if(moveTwo==='paper')
  //         handleDraw()
  //       if(moveTwo==='scissors')
  //         handleTwoWin()
  //     }
  //     if(moveOne==='scissors'){
  //       if(moveTwo==='rock')
  //         handleTwoWin()
  //       if(moveTwo==='paper')
  //         handleOneWin()
  //       if(moveTwo==='scissors')
  //         handleDraw()
  //     }
  //   // else
  //   //   handleError()
  // }

  const [winner, setWinner] = React.useState("")
  const score = () => {
    fetch("http://localhost:3001/game?player1="+ moveOne +"&player2=" + moveTwo)
    .then((res)=>res.json())
    .then((data)=>setWinner(data.results))
    .then(()=>{
      if(winner==='Player 1 Wins')
        handleOneWin()
      if(winner==='Player 2 Wins')
        handleTwoWin()
      if(winner==='Draw')
        handleDraw()
    })
  }

  useEffect(()=>{
    
  }, [rerender])

  return (
    <div className={classes.root}>
      <Paper elevation={3}>
        <Grid container>

          <Grid item xs={12}>
            <Typography variant="h3" align="center">Rock Paper Scissors</Typography>
          </Grid>

          <Grid item xs={6} className={classes.mt}>
            <Grid item xs={10} >
              <Typography variant="h5">Player 1:</Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl className={classes.formControl}>
                <InputLabel>Move</InputLabel>
                <Select
                  value={moveOne}
                  onChange={(e)=>setMoveOne(e.target.value)}
                  fullWidth
                >
                  <MenuItem value={'rock'}>Rock</MenuItem>
                  <MenuItem value={'paper'}>Paper</MenuItem>
                  <MenuItem value={'scissors'}>Scissors</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid item xs={6} className={classes.mt}>
            <Grid item xs={12} >
              <Typography variant="h5">Player 2:</Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl className={classes.formControl}>
                <InputLabel>Move</InputLabel>
                <Select
                  value={moveTwo}
                  onChange={(e)=>setMoveTwo(e.target.value)}
                  fullWidth
                >
                  <MenuItem value={'rock'}>Rock</MenuItem>
                  <MenuItem value={'paper'}>Paper</MenuItem>
                  <MenuItem value={'scissors'}>Scissors</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid item xs={5} />
          <Grid item xs={2} className={classes.mt}>
            <Button variant="contained" component="label" onClick={()=>{score()}} color="secondary">
                Score
            </Button>
          </Grid>
          <Grid item xs={5} />

          <Grid item xs={12} className={classes.mt}>
            {log.map((entry) => (
              <Alert key={uuidv4()}>
                {entry}
              </Alert>
            ))}
          </Grid>

          {/* <Grid item xs={12} className={classes.mt}>
            <Collapse in={oneWinsOpen}>
              <Alert>
                Player One Wins!
              </Alert>
            </Collapse>
            <Collapse in={twoWinsOpen}>
              <Alert severity="info">
                Player Two Wins!
              </Alert>
            </Collapse>
            <Collapse in={drawOpen}>
              <Alert>
                Draw!
              </Alert>
            </Collapse>
            <Collapse in={errorOpen}>
              <Alert severity="error">
                Error!
              </Alert>
            </Collapse>
            <Collapse in={scoreOpen}>
              <Alert severity='info'>
                Player 1 Score: {oneScore} / 3 games
                Player 2 Score: {twoScore} / 3 games
              </Alert>
            </Collapse>
            <Collapse in={setOneOpen}>
              <Alert severity='info'>
                Player 1 Wins the Set!
              </Alert>
            </Collapse>
            <Collapse in={setTwoOpen}>
              <Alert severity='info'>
                Player 2 Wins the Set!
              </Alert>
            </Collapse>
          </Grid> */}

        </Grid>
      </Paper>
    </div>
  );
}