import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
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
import { DialogContentText } from '@material-ui/core';
import { DialogActions } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { Drawer } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { Divider } from '@material-ui/core';
import { List } from '@material-ui/core';
import { ListItem } from '@material-ui/core';
import { FormControlLabel } from '@material-ui/core';
import { Checkbox } from '@material-ui/core';

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: 'auto',
      width:'50%',
      height: theme.spacing(40),
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
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  ml: {
    marginLeft: '20px'
  },
  l: {
    marginLeft: '0px'
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

   const [errorOpen, setErrorOpen] = React.useState(false)

  const recordWin = (w) => {
    fetch("http://localhost:3001/game-results", {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          won: w
      })
    })
  }

  const handleOneWin = () => {
    setOneScore(oneScore + 1)
    setLog(log.concat(["Player 1 Wins, Score: " + oneScoreRef.current]))
    handleSet()
    recordWin(true)
  }
  const handleTwoWin = () => {
    setTwoScore(twoScore + 1)
    setLog(log.concat(["Player 2 Wins, Score: " + twoScoreRef.current]))
    handleSet()
    recordWin(false)
  }
  const handleDraw = () => {
    setLog(log.concat(["Draw"]))
  }
  const handleSet = () => {
    if(oneScore === 2){
      setLog(log.concat(["Player 1 Wins Set"]))
      setOneScore(0)
      setTwoScore(0)
    }
    else if(twoScore === 2){
      setLog(log.concat(["Player 2 Wins Set"]))
      setOneScore(0)
      setTwoScore(0)
    }
  }
  const handleError = () => {
    setErrorOpen(true)
    setTimeout(function(){ setErrorOpen(false) }, 3000);
  }

  const [openDialog, setOpenDialog] = React.useState(false);

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const score = () => {
    if( (moveOne==='rock'||moveOne==='paper'||moveOne==='scissors')
     && (moveTwo==='rock'||moveTwo==='paper'||moveTwo==='scissors')){
      fetch("http://localhost:3001/game?player1="+ moveOne +"&player2=" + moveTwo)
      .then((res)=>res.json())
      .then((data)=>{
        if(data.results==='Player 1 Wins')
          handleOneWin()
        if(data.results==='Player 2 Wins')
          handleTwoWin()
        if(data.results==='Draw')
          handleDraw()
      })
    }
    else 
      handleError()
  }

  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")
  const [errorAlert, setErrorAlert] = useState(false)
  const [successAlert, setSuccessAlert] = useState(false)
  const login = () => {
    fetch("http://localhost:3001/login", {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          username: user,
          password: pass
      })
    })
    .then((res)=>{
      if(res.status !== 200){
        setErrorAlert(true)
        setTimeout(function(){ setErrorAlert(false) }, 3000);
      }
      if(res.status === 200){
        setSuccessAlert(true)
        setTimeout(function(){ setSuccessAlert(false) }, 3000);
      }
    })
  }
  const signup = () => {
    fetch("http://localhost:3001/sign-up", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          username: user,
          password: pass
      })
    })
    .then((res)=>{
      if(res.status !== 200){
        setErrorAlert(true)
        setTimeout(function(){ setErrorAlert(false) }, 3000);
      }
      if(res.status === 200){
        setSuccessAlert(true)
        setTimeout(function(){ setSuccessAlert(false) }, 3000);
      }
    })
  }

  const [drawerOpen, setDrawerOpen] = useState(false)
  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const [disabled, setDisabled] = useState(true)

  const [history, setHistory] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  useEffect(()=>{
    fetch("http://localhost:3001/is-logged-in", {credentials: 'include'})
      .then((res)=>res.json())
      .then((data)=> {
        if(data.loggedIn===true)
          setIsLoggedIn(data.loggedIn)
        if(data.loggedIn==="admin")
          setIsAdmin(true)
      })
    if(isAdmin)
      fetch("http://localhost:3001/leaderboard", {credentials: 'include'})
        .then((res)=>res.json())
        .then((data)=>{
          setLeaderboard(data)
          setHistory([])
        })
    else if(!isLoggedIn)
      fetch("http://localhost:3001/game-results", {credentials: 'include'})
      .then((res)=>res.json())
      .then((data)=>setHistory(data))
    else
      fetch("http://localhost:3001/game-results/user", {credentials: 'include'})
      .then((res)=>res.json())
      .then((data)=>setHistory(data))
  }, [drawerOpen])

  return (
    <div className={classes.root}>
      <Paper elevation={3}>
        <Grid container>

          <Grid item xs={12}>
            <Typography variant="h3" align="center">Rock Paper Scissors</Typography>
          </Grid>

          <Grid item xs={6} className={classes.mt}>
            <Grid item xs={10}>
              <TextField label="Player 1" defaultValue="Player 1" disabled={disabled} className={classes.ml} />
            </Grid>
            <Grid item xs={12}>
              <FormControl className={[classes.formControl, classes.ml]}>
                <InputLabel>Move</InputLabel>
                <Select
                  value={moveOne}
                  onChange={(e)=>{
                    if(e.target.value==="random"){
                      var r = getRandomInt(3)
                      if(r===0)
                        setMoveOne("rock")
                      if(r===1)
                        setMoveOne("paper")
                      if(r===2)
                        setMoveOne("scissors")
                    } else
                      setMoveOne(e.target.value)
                  }}
                  fullWidth
                >
                  <MenuItem value={'rock'}>Rock</MenuItem>
                  <MenuItem value={'paper'}>Paper</MenuItem>
                  <MenuItem value={'scissors'}>Scissors</MenuItem>
                  <MenuItem value={'random'}>Random</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid item xs={6} className={classes.mt}>
            <Grid item xs={12} >
            <TextField label="Player 2" defaultValue="Player 2" disabled={disabled}/>
            </Grid>
            <Grid item xs={12}>
              <FormControl className={[classes.formControl, classes.l]}>
                <InputLabel>Move</InputLabel>
                <Select
                  value={moveTwo}
                  onChange={(e)=>{
                    if(e.target.value==="random"){
                      var r = getRandomInt(3)
                      if(r===0)
                        setMoveTwo("rock")
                      if(r===1)
                        setMoveTwo("paper")
                      if(r===2)
                        setMoveTwo("scissors")
                    } else
                      setMoveTwo(e.target.value)
                  }}
                  fullWidth
                >
                  <MenuItem value={'rock'}>Rock</MenuItem>
                  <MenuItem value={'paper'}>Paper</MenuItem>
                  <MenuItem value={'scissors'}>Scissors</MenuItem>
                  <MenuItem value={'random'}>Random</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid item xs={1} />
          <Grid item xs={2} className={classes.mt}>
            <Button variant="contained" component="label" onClick={()=>{handleDrawerOpen()}} color="primary">
                History
            </Button>
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={2} className={classes.mt}>
            <Button variant="contained" component="label" onClick={()=>{handleDialogOpen()}} color="primary">
                Login
            </Button>
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={2} className={classes.mt}>
            <Button variant="contained" component="label" onClick={()=>{score()}} color="secondary">
                Score
            </Button>
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={2} className={classes.mt}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={disabled}
                  onChange={()=>setDisabled(!disabled)}
                  color="primary"
                />
              }
              label="Lock"
            />
          </Grid>

          <Grid item xs={12} className={classes.mt}>
            {logRef.current.map((entry) => (
              <Alert key={uuidv4()}>
                {entry}
              </Alert>
            ))}
          </Grid>

          <Grid item xs={12} className={classes.mt}>
            <Collapse in={errorOpen}>
              <Alert severity="error">
                Invalid Throw!
              </Alert>
            </Collapse>
          </Grid>

          <Dialog open={openDialog} onClose={handleDialogClose}>
            <DialogTitle>Login</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Login Helper Text
              </DialogContentText>
              <Collapse in={errorAlert}>
                <Alert severity="error">
                  Error
                </Alert>
              </Collapse>
              <Collapse in={successAlert}>
                <Alert>
                  Success
                </Alert>
              </Collapse>
              <TextField
                autoFocus
                margin="dense"
                label="Username"
                fullWidth
                onChange={(e)=>setUser(e.target.value)}
              />
              <TextField
                autoFocus
                margin="dense"
                label="Password"
                fullWidth
                onChange={(e)=>setPass(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={()=>signup()} color="primary">
                Sign Up
              </Button>
              <Button onClick={()=>login()} color="primary">
                Login
              </Button>
            </DialogActions>
          </Dialog>

          <Drawer
            classes={{
              paper: clsx(classes.drawerPaper, !drawerOpen && classes.drawerPaperClose),
            }}
            open={drawerOpen}
            onClose={()=>handleDrawerClose()}
          >
            <div className={classes.toolbarIcon}>
              <IconButton onClick={handleDrawerClose}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <Divider />
            <List>
              {history.map((game) => (
                <ListItem>
                  {game.game_result_id}: {game.username} {game.won.toString().replace("true", "won").replace("false", "lost")} at {game.created_at}
                </ListItem>
              ))}
              {leaderboard.map((users) => (
                <ListItem>
                  {users.username}: {users.count}
                </ListItem>
              ))}
            </List>
            <Divider />
          </Drawer>
        </Grid>
      </Paper>
    </div>
  );
}