import {
  Grid,
  Typography,
  Card,
  IconButton,
  LinearProgress,
} from "@mui/material";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";

export default function MusicPlayer(props){
    const songProgress = (props.time / props.duration) * 100;

    function pauseSong(){
      fetch("/spotify/pause", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
    }

    function playSong(){
      fetch("/spotify/play", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
    }

    function skipSong() {
      fetch("/spotify/skip", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
    }
  

    return (
      <Card>
        <Grid container alignItems="center">
          <Grid item align="center" xs={4}>
            <img src={props.image_url} height="100%" width="100%" />
          </Grid>
          <Grid item align="center" xs={8}>
            <Typography component="h5" variant="h5">
              {props.title}
            </Typography>
            <Typography color="textSecondary" variant="subtitle1">
              {props.artist}
            </Typography>
            <div>
              <IconButton  onClick={() => {
                  props.is_playing ? pauseSong() : playSong();
                }}>
                {props.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>
              <IconButton onClick={() => skipSong()}>
                <span style="font-size:0.75em;">{props.votes} / {props.votes_required}</span>
                <SkipNextIcon />
              </IconButton>
            </div>
          </Grid>
        </Grid>
        <LinearProgress variant="determinate" value={songProgress} />
      </Card>
    )
}