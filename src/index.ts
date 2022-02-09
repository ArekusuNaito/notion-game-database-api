import 'dotenv/config';
import express from 'express';
import database from './notion-game-database'
import api from './api';
import { graphqlHTTP } from 'express-graphql';
import { apiSchema } from './graphQL/';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const hitomi =
{
    "notion":process.env.notion,
    "itemDatabaseID":process.env.itemDatabaseID,
    "gameDatabaseID":process.env.gameDatabaseID,
    "gameSeriesDatabaseID":process.env.gameSeriesDatabaseID,
    "port":process.env.port
}
/**
 * Mock up data for Items and Games Databases.
 */
export const items =
[
    {
        Name:'Red Potion',
        Description: 'A cool red potion',
        Game: 'dcba',
    },
    {
        Name:'Pick Me Up',
        Description: 'Revive friends',
        Game: 'abba',
    }
]

export const games =
[
    {
        id:'dcba',
        Name:`Majora's Mask`,
        
    },
    {
        id:'abba',
        Name:'Super Mario RPG',
    }
]




//Setup
const server = express();

server.use('/graphql',graphqlHTTP(
    { 
        schema:apiSchema,
        graphiql:true
    }
))


//Everything in one single router for the sake of organization/legibilty
// server.use('/',api);

server.get('/ping',(request,response)=>
{
    response.send('Pong');
});

server.listen(hitomi.port,async ()=>
{
    try
    {
        database.SetCredentials(hitomi);
        const items = await prisma.item.findMany();
        console.log(items);
        console.log(`Server started: ${hitomi.port} ~ OK!`);
    }
    catch(error)
    {
        console.error('Error creating server');
    }
})


