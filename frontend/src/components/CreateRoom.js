import { useState } from "react";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import { Link, useNavigate } from "react-router-dom";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Collapse } from "@mui/material";
import Alert from "@mui/material/Alert";

function CreateRoom(props){

    const navigate = useNavigate()
  
    const [guestCanPause, setGuestCanPause] = useState(props.guestCanPause)
    const [votesToSkip, setVotesToSkip] = useState(props.votesToSkip)
    const [successMsg, setSuccessMsg] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const title = props.update ? "Update Room" : "Create a Room";

    function handleVotesChange(e){
        setVotesToSkip(e.target.value)
    }
    
    function handleGuestCanPauseChange(e){
        setGuestCanPause(e.target.value === "true" ? true : false)
    }


    function createRoom() {
        
        fetch("/api/rooms", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause,
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            navigate(`/rooms/${data.code}`)
        });
    }

    function updateRoom() {
        fetch(`/api/rooms/${props.roomCode}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause,
                code: props.roomCode,
            }),
        }).then((response) => {
            if (response.ok) {
                setSuccessMsg("Room updated successfully!")
            } else {
                setErrorMsg("Error updating room...")
            }
            props.updateCallback();
        });
      }

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Collapse
                    in={errorMsg != "" || successMsg != ""}
                >
                    {successMsg != "" ? (
                    <Alert
                        severity="success"
                        onClose={() => {
                            setSuccessMsg('')
                        }}
                    >
                        {successMsg}
                    </Alert>
                    ) : (
                    <Alert
                        severity="error"
                        onClose={() => {
                            setErrorMsg('')
                        }}
                    >
                        {errorMsg}
                    </Alert>
                    )}
                </Collapse>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4">
                    {title}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4">
                    Create A Room
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl component="fieldset">
                    <FormHelperText>
                    <div align="center">Guest Control of Playback State</div>
                    </FormHelperText>
                    <RadioGroup
                    row
                    defaultValue={guestCanPause.toString()}
                    onChange={handleGuestCanPauseChange}
                    >
                    <FormControlLabel
                        value="true"
                        control={<Radio color="primary" />}
                        label="Play/Pause"
                        labelPlacement="bottom"
                    />
                    <FormControlLabel
                        value="false"
                        control={<Radio color="secondary" />}
                        label="No Control"
                        labelPlacement="bottom"
                    />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl>
                    <TextField
                    required={true}
                    type="number"
                    onChange={handleVotesChange}
                    defaultValue={votesToSkip}
                    inputProps={{
                        min: 1,
                        style: { textAlign: "center" },
                    }}
                    />
                    <FormHelperText>
                    <div align="center">Votes Required To Skip Song</div>
                    </FormHelperText>
                </FormControl>
            </Grid>
            {props.update
                ? (<Grid item xs={12} align="center">
                        <Button
                        color="primary"
                        variant="contained"
                        onClick={updateRoom}
                        >
                        Update Room
                        </Button>
                    </Grid>)
                : (<Grid container spacing={1}>
                    <Grid item xs={12} align="center">
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={createRoom}
                      >
                        Create A Room
                      </Button>
                    </Grid>
                    <Grid item xs={12} align="center">
                      <Button color="secondary" variant="contained" to="/" component={Link}>
                        Back
                      </Button>
                    </Grid>
                  </Grid>)
            }
            
        </Grid>
    )
}

export default CreateRoom

CreateRoom.defaultProps  = {
    votesToSkip: 2,
    guestCanPause:true,
    update:false,
    roomCode:null,
    updateCallback:()=>{}
}