import express from 'express';
const server = express();
const port = 3000;
import database from './notion-game-database'
import hitomi from '../hitomi.json';
//Import API
import api from './api';


server.use('/',api);

server.get('/ping',(request,response)=>
{
    response.send('Pong');
});

server.listen(port,async ()=>
{
    try
    {
        database.SetCredentials(hitomi);
        console.log(`Server started: ${port} ~ OK!`);
    }
    catch(error)
    {
        console.error('Error creating server');
    }
})


