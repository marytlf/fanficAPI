const http = require('http');
const https = require('https');
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');


const bot = new TelegramBot(token, {polling: true});

bot.on('message', (msg) => {
    		
    		console.log(msg.text)
    		var link = "archiveofourown";
			if (msg.text && msg.text.toString().includes(link)) {
    			console.log("==========>> SUCCESS")
    			var url = 'http://127.0.0.1:3000/ao3?'+msg.text


    			axios.get(url).then((response) => {
    					if (response.status === 200) {
    						console.log(response.data)
    						
    						bot.sendMessage(msg.chat.id,"Title: " +response.data.title +"\nShip:"+ response.data.tags+ "\nAutor: " +response.data.autor +"\n" + "Sinopse: " +response.data.synopsis+"\nWords:"+response.data.words+"\nServerResponse:"+response.data.botMessage);
    	
    					}
				}).on("error", (err) => {
				  console.log("Error: " + err.message);
				});

    			
    			return msg
    		}
});

