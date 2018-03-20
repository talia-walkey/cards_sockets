const port = process.env.PORT || 10000;
const server = require("http").Server();

var io = require("socket.io")(server);

var allAnswers = [];

//when someone is connecting
io.on("connection", function(socket){
    
    //clears out allAnswers array
    allAnswers = [];
 
    //when socket receives msg joinroom
    //roomStr = data
    socket.on("joinroom", function(data){
        console.log("joining room", data);
        
        socket.join(data);
        socket.myRoom = data;
        
    });
    
    
    //when server sends question over, do this function
    socket.on("qsubmit", function(data){
        console.log("question sent = " +data);
        io.in(socket.myRoom).emit("newq", data);
    })
    
    //when server sends chosenAnswer over, do this function
    socket.on("chosenAnswer", function(data){
        console.log("answer chosen = "+data);
        allAnswers.push(data);
        
        console.log("all answers: "+allAnswers);
        io.emit ("showAnswers", allAnswers);
    })
    
    //when server sends winner over, do this function
    socket.on("winner", function(data){
        console.log("winner = " +data);
        io.in(socket.myRoom).emit("bestAnswer", data);
    })
    
    //when socket disconnects
    socket.on("disconnect", function(){
        

    })
});

server.listen(port, (err)=>{
   if(err){
       console.log(err);
       return false;
   } 
    
    console.log("Port is running");
});