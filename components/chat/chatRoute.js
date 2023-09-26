const Chat = require('./chatModel');
const docClient = require('../../config/dynamo')
const {PutItemCommand, QueryCommand } = require("@aws-sdk/client-dynamodb");
const moment = require('moment-timezone');

module.exports = function (io,socket) {
    socket.on('send', async(data)=>{
        data.name = socket.sender

        const koreanTime = moment().tz('Asia/Seoul');
        const currentDate = koreanTime.toISOString();

        const params = {
            TableName: 'Chats',
            Item: {
              ChatId: {S: socket.id},
              sendDate : {S: currentDate},
              Sender: {S: socket.sender},
              Receiver: {S: socket.receiver},
              Message: {S: data.message},
            },
        };
        try{
            const command = new PutItemCommand(params);
            await docClient.send(command);
            console.log("저장완료!!!");
            io.sockets.emit('update', data)
        }catch(err){
          console.error("채팅 메시지 저장 오류", err);
        }
    })
    socket.on('newUser', async(chatInfo)=>{
        socket.id = chatInfo.farmer  + '_' + chatInfo.user;
        if (chatInfo.farmer == chatInfo.email){
            socket.sender = chatInfo.farmer
            socket.receiver = chatInfo.user
        }
        else{
            socket.sender = chatInfo.user
            socket.receiver = chatInfo.farmer
        }

        try{
            const params = {
                TableName: 'Chats',
                KeyConditionExpression: "ChatId = :ChatId",
                ExpressionAttributeValues: {
                    ":ChatId": {S : socket.id}
                }
            };
            const command = new QueryCommand(params)
            const result = await docClient.send(command)

            const chatLog = result.Items
            io.sockets.emit('update', {
                name : 'SERVER',
                chatLog : chatLog
            });
            console.log(chatLog);

        }catch (err) {
            console.error(err);
        }


    });
    socket.on('disconnect', ()=>{
        console.log("채팅종료");
    })

}

