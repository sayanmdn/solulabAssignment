const address = process.argv[2]
const port = process.argv[3]
const { stdout, send, exit } = require('process');
var readline = require('readline');
let array = []
let instanceUser = ''
const arrayPrint = data =>{
    let playerOwn = false
    console.log("------------------")
    for(let i=0;i<3;i++){
      let line = ''
      let allSame = "new"
      for(let j=0;j<3;j++){
        line+=data[3*i+j] + ' '
        if(allSame == "new"){
            allSame = data[3*i+j]
        } else {
            if(allSame != data[3*i+j]){
                allSame = false
            }
        }
      }
      console.log(line)
      if(allSame){
        playerOwn = allSame
      }
    }
    for(let i=0;i<3;i++){
        let line = ''
        let allSame = "new"
        for(let j=0;j<3;j++){
          line+=data[3*j+i] + ' '
          if(allSame == "new"){
              allSame = data[3*j+i]
          } else {
              if(allSame != data[3*j+i] || allSame == 0){
                  allSame = false
              }
          }
        }
        if(allSame){
          playerOwn = allSame
        }
      }
    console.log("------------------")
    
    if(data[0]==data[4] && data[0]==data[8]){
        playerOwn = data[0]
    }
    if(data[2]==data[4] && data[2]==data[6]){
        playerOwn = data[2]
    }
    if(playerOwn){
        instanceUser = (playerOwn == "X")?"first":"second"
        console.log(`${instanceUser} player own the match`)
    }
}

const io = require('socket.io-client');
const socket = io.connect(`http://${address}:${port}`, {reconnect: true});

socket.on('connect', function (socket) {
    console.log(`connected to ${address} ${port}`);
});

socket.on('game started', function(user){
    instanceUser = user
    console.log('Game started. You are the '+ user+ ' player')
})

socket.on('data', function(data, sender){
    // console.log(sender)
    if(data === "r"){
        let playerown
        if(sender == "first"){
            playerown = "second"
        }
        if(sender == "second"){
            playerown = "first"
        }
        console.log(sender + " player quit. "+ playerown +" player own the game")
        process.exit()
    }
    array = data
    arrayPrint(data)
    if(data.indexOf(0)==-1) {
        console.log("Game is tied")
        process.exit()
    }
    if(sender !== undefined && instanceUser != sender){
    process.stdout.write(">")
    }
    if(sender === undefined){
        if(instanceUser == "first"){
            process.stdout.write(">")
        }
    }
})
process.stdin.on("data", data => { 
    // console.log(input)
    if(data.toString().trim() == "r"){
        socket.emit('data', "r", instanceUser)
        return
    }
    let input = parseInt(data.toString().trim())
    if(array[input-1] != 0){
        process.stdout.write("Invalid input")
        process.stdout.write("\n>")
    } else {

    if(instanceUser == "first"){
        array[input-1] = "X"
    }
    if(instanceUser == "second"){
        array[input-1] = "O"
    }
    socket.emit('data', array, instanceUser)
    }
    
}); 