import React, { useEffect, useState, useRef } from 'react'

const ChatMain = ({socket,username,room}) => {
    const [message,setMessage] = useState("")
    const [messageList,setMessageList] = useState([])
    const messageContainerRef = useRef(null);
    const SendMessage = async() =>{
        if (message !== ""){
            const messageData = {
                room: room,
                username: username,
                message: message,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            }
            await socket.emit("send_message", messageData) //отправка сообщения c временим и тд
            setMessageList((list)=>[...list, messageData ])
            setMessage("")
        }
    }
    useEffect(()=>{
        socket.on("resive_message",(data)=>{ //получение сообщения c временим и тд
            setMessageList((list)=>[...list, data])
        })
    }, [socket])
    useEffect(() => {
        // Прокрутка вверх при заполнении блока с текстом
        if (messageContainerRef.current) {
          const container = messageContainerRef.current;
          if (container.scrollHeight > container.clientHeight) {
            container.scrollTop = container.scrollHeight;
          }
        }
      }, [messageList]);
  return (
    <div className='chat_mess'>
        <div className='chat_header'>
            <p>Live Chat</p>
        </div>
        <div className='chat_main' ref={messageContainerRef}>
            {messageList?.map((messageContent)=>{ //делаем из всей каши инф норм вид
                return <div className='message' id={username === messageContent.username ? "you":"other"}>
                            <div className='message_div'>
                                <h3>{messageContent.message}</h3>
                                <p>{messageContent.time +" "+ messageContent.username}</p>
                            </div>
                        </div>;
                })
            }
        </div>
        <div className='chat_foother'>
            <input type="text" placeholder='  sms...' onChange={(e)=>{setMessage(e.target.value)}} onKeyDown={(e)=> {e.key === "Enter" && SendMessage()}} value={message}/>
            <button onClick={()=> SendMessage()}>&#9658;</button>
        </div>
    </div>
  )
}

export default ChatMain