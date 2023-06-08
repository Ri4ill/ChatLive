const express = require('express');
const app = express()
const http = require('http')
const cors = require('cors');
const {Server} = require('socket.io');
const { config } = require('process');
const PORT  = process.env.PORT || 3001
app.use(cors());
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: 'http://31.172.75.59',
        methods: ["GET", "POST"]
    }
})
app.get("/",(req, res)=>{
    res.send("Hello World!");
})
app.get('/api', (req, res) => {
  res.send('API endpoint');
  // Вместо 'API endpoint' выполните нужную логику для обработки запросов API
});

io.on("connection", (socket)=> {
    console.log(`${socket.id} User ok`);
    socket.on("join_room", ({room,username})=>{
        socket.join(room) //подключение к комнате
        console.log(`User with ID: ${socket.id} join room ${room}`)
        socket.on("send_message", (data) => { //получаем сообщение
            socket.to(data.room).emit("resive_message", data)//to - куда отправить emit, что отправить и в какой пункт
            console.log(data)
        })
        io.to(room).emit("resive_message", {
            room: room,
            username: "bot",
            message:  `${username} join in the room`,
            time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
        });
    })
    socket.on("disconnect", (data)=>{
        console.log("user live", socket.id)
    })
})
//
server.listen(PORT,(err)=>{
    if(err){
        console.log(err)
    }
    console.log(`hi let start code ${PORT}`,PORT)
})




