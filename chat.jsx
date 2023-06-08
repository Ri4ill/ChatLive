import React,{useEffect,useState} from 'react'
import ChatMain from './chatMain'
import io from 'socket.io-client'

const socket = io.connect('http://localhost:3001/')

const Chat = () => {
    const [username,setUsername] = useState('')
    const [room,setRoom] = useState('')
    const [showChat,setShowChat] = useState(true)

    
    const JoinRoom = () =>{
      if (username!== "" && room !== ""){
        setShowChat(!showChat)
        socket.emit("join_room",{room,username})
      }
    }
  return (
    <div className='chat'>
      {showChat ? (
        <div className='chat_login'>
          <div className='chat_login_div'>
            <h3>Chat live</h3>
            <div className='chat_login_input'>
              <input type="text"  placeholder='  Jone...' onChange={(event)=> {setUsername(event.target.value)}}/>
              <input type="text"  placeholder='  Room id...' onChange={(event)=> {setRoom(event.target.value)}}/>
            </div>
            <button onClick={()=> {JoinRoom()}}>Join</button>
          </div>
        </div>
      )
      :(
      <ChatMain socket={socket} username={username} room={room}/>
      )}
    </div>
  )
}

export default Chat