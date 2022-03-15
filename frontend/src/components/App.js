import {Routes,Route,Navigate} from "react-router-dom";
import { useEffect, useState } from "react";

import Home from './Home'
import RoomJoinPage from "./RoomJoinPage";
import CreateRoom from "./CreateRoom";
import Room from "./Room";



export default function App(props){

    const [roomCode, setRoomCode] = useState()

    useEffect(()=>{
        fetch("/api/user-in-room")
        .then((response) => response.json())
        .then((data) => {
            setRoomCode(data.code)
        });
    },[]) 

    function leaveRoom(){
        setRoomCode(null)
    }

    return (
        <>
            <div className="center">
                <Routes>
                    <Route path='/' exact element={ roomCode?<Navigate to={`/rooms/${roomCode}`} />:<Home />}></Route>
                    <Route path="/join" element={ <RoomJoinPage />}></Route>
                    <Route path="/rooms/create" element={ <CreateRoom />}></Route>
                    <Route path="/rooms/:roomCode" element={ <Room {...props} leaveRoom={leaveRoom} />}></Route>
                    <Route path='*' element={<Navigate to='/' />}></Route>
                </Routes>
            </div>
        </>
      )
}

