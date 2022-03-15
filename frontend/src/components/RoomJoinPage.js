import { TextField, Button, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";


function RoomJoinPage(){
    const navigate = useNavigate()
    const [roomCode, setRoomCode] = useState()
    const [error, setError] = useState()

    function handleCodeChange(e) {
        setRoomCode(e.target.value)
    }
    
    function roomButtonPressed() {
        fetch("/api/join-room", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              code: roomCode,
            }),
          })
          .then((response) => {
            if (response.ok) {
                navigate(`/rooms/${roomCode}`,{replace:true});
            } else {
              setError("Room not found.")
            }
          })
          .catch((error) => {
            console.log(error);
          });
    }

    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h4">
            Join a Room
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <TextField
            error={error}
            label="Code"
            placeholder="Enter a Room Code"
            value={roomCode}
            helperText={error}
            variant="outlined"
            onChange={handleCodeChange}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="primary"
            onClick={roomButtonPressed}
          >
            Enter Room
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button variant="contained" color="secondary" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    )
}

export default RoomJoinPage