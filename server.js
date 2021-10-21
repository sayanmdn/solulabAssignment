const port = process.argv[2]
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const users = []
const initialArray = [0,0,0,0,0,0,0,0,0]
const arrayPrint = data =>{
  for(let i=0;i<3;i++){
    let line = ''
    for(let j=0;j<3;j++){
      line+=data[3*i+j] + ' '
    }
    console.log(line)
  } 
}
io.on('connection', function (socket){

    users.push(socket.id)
    console.log('connection '+socket.id+'    size '+users.length);
    if(users.length === 2){
        console.log("Two clients connected")
        io.to(users[0]).emit('game started', 'first')
        io.to(users[1]).emit('game started', 'second')
        io.emit('data',initialArray)
      }
    socket.on('data', function(data,user){
      console.log(data)
      io.emit('data',data,user)
    })
    socket.on('disconnect', function(socket){
      let index = users.indexOf(...io.sockets.sockets.keys())
      if (index > -1) {
          users.splice(index, 1);
        }
      console.log('user disconnected   size '+users.length);
  });
    
});


http.listen(port, function () {
  console.log('listening on :'+port);
});

