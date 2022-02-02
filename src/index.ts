import express from 'express';
import 'dotenv/config';
const server = express();

import database from './notion-game-database'
//Import API
import api from './api';

const hitomi =
{
    "notion":process.env.notion,
    "itemDatabaseID":process.env.itemDatabaseID,
    "gameDatabaseID":process.env.gameDatabaseID,
    "gameSeriesDatabaseID":process.env.gameSeriesDatabaseID,
    "port":process.env.port
}

//Everything in one single router for the sake of organization/legibilty
server.use('/',api);

server.get('/ping',(request,response)=>
{
    response.send('Pong');
});

server.listen(hitomi.port,async ()=>
{
    try
    {
        database.SetCredentials(hitomi);
        console.log(`Server started: ${hitomi.port} ~ OK!`);
    }
    catch(error)
    {
        console.error('Error creating server');
    }
})


