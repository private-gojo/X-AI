const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = "x-sorcerer-verify";
const PAGE_TOKEN = process.env.PAGE_ACCESS_TOKEN;

app.get('/', (req,res)=> res.send('Gojo bot is alive!'));

app.get('/webhook', (req,res)=>{
  if(req.query['hub.verify_token'] === VERIFY_TOKEN){
    return res.send(req.query['hub.challenge']);
  }
  res.sendStatus(403);
});

app.post('/webhook', async (req,res)=>{
  const body = req.body;
  if(body.object === 'page'){
    for(const entry of body.entry){
      for(const event of entry.messaging){
        if(event.message && event.message.text){
          const sender = event.sender.id;
          const text = `Yo! I'm Gojo [01000111]. You said: ${event.message.text} - Domain Expansion!`;
          await axios.post(`https://graph.facebook.com/v20.0/me/messages?access_token=${PAGE_TOKEN}`, {
            recipient: {id: sender},
            message: {text}
          });
        }
      }
    }
    res.sendStatus(200);
  } else res.sendStatus(404);
});

app.listen(process.env.PORT || 3000, ()=> console.log('Bot running'));
