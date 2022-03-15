import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Grid, Button, Typography } from "@mui/material";
import CreateRoom from "./CreateRoom";
import MusicPlayer from './MusicPlayer'



function Room(props){

    const navigate = useNavigate()
    const [guestCanPause, setGuestCanPause] = useState(true)
    const [votesToSkip, setVotesToSkip] = useState(2)
    const [isHost, setIsHost] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false)
    const [song, setSong] = useState({})
    let interval=null


    // let interval=null
    const {roomCode} = useParams();

    useEffect(()=>{
        getRoomDetails()
        const interval = setInterval(() => {
            getCurrentSong()
          }, 1000);
        return () => clearInterval(interval);
    },[])

    function authenticateSpotify (){
        fetch("/spotify/is-authenticated")
            .then((response) => response.json())
            .then((data) => {
                setSpotifyAuthenticated(data.status)
                if (!data.status) {
                    fetch("/spotify/get-auth-url")
                        .then((response) => response.json())
                        .then((data) => {
                            window.location.replace(data.url);
                        });
                }
            });
    }
  
    function getRoomDetails() {
        fetch("/api/rooms/" + roomCode)
            .then((response) => {
                if(!response.ok){
                    props.leaveRoom();
                    navigate('/')
                }
                return response.json()
            })
            .then((data) => {
                setGuestCanPause(data.guest_can_pause)
                setVotesToSkip(data.votes_to_skip)
                setIsHost(data.is_host)
                if(data.is_host){
                    authenticateSpotify()
                }
            });
    }

    function getCurrentSong(){
        fetch("/spotify/current-song")
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setSong(data)
            })
            .catch(err=>{
                console.log(err)
            })
    }
  
    function leaveRoom() {
        fetch("/api/leave-room", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        }).then((response) => {
            props.leaveRoom();
            navigate('/')
        });
    }

    if(showSettings){
        return (<Grid container spacing={1}>
            <Grid item xs={12} align="center">
              <CreateRoom
                update={true}
                votesToSkip={votesToSkip}
                guestCanPause={guestCanPause}
                roomCode={roomCode}
                updateCallback={getRoomDetails}
              />
            </Grid>
            <Grid item xs={12} align="center">
              <Button
                variant="contained"
                color="secondary"
                onClick={()=>{setShowSettings(false)}}
                >
                Close
              </Button>
            </Grid>
          </Grid>)
    }

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Code: {roomCode}
                </Typography>
            </Grid>
            <MusicPlayer {...song} />
            {isHost ? (<Grid item xs={12} align="center">
                    <Button
                    variant="contained"
                    color="primary"
                    onClick={()=>{setShowSettings(true)}}
                    >
                    Settings
                    </Button>
                </Grid>) : null}
            <Grid item xs={12} align="center">
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={leaveRoom}
                >
                    Leave Room
                </Button>
            </Grid>
         </Grid>
    )
}

export default Room