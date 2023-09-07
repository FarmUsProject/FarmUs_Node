const mongoose = require('mongoose');

const Chat = require('./chatModel');
//const mongoURI = 'mongodb://localhost:27017'; // MongoDB URI (로컬로 설정됨)

module.exports = function (io, socket) {

   /* mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>{*/
        socket.on('send', async(data)=>{
            data.name = socket.name
            /*
            const chatMessage = new Chat({
                name: data.name,
                message: data.message,
            })
            */
            try{
                //await chatMessage.save();
                io.sockets.emit('update', data)
            }catch(err){
                console.error("채팅 메시지 저장 오류", err);
            }

        })

        socket.on('newUser', function(name){

            socket.name = name;
            const message = name + '님이 접속했습니다';

            io.sockets.emit('update', {
                name : 'SERVER',
                message : message
            });
            console.log(message);
        });

        socket.on('disconnect', ()=>{
            const message = socket.name + '님이 퇴장했습니다.';

            socket.broadcast.emit('update', {
              name : 'SERVER',
              message : message
            });
            console.log(message);
        })

    /*})
    .catch((err)=>{
        console.error('MongoDB 연결 오류 : ', err);
    })*/

};