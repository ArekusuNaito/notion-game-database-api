import 'dotenv/config';
import express from 'express';
import database from './notion-game-database'
import api from './api';
import {GraphQLList, GraphQLObjectType,GraphQLSchema, GraphQLString,GraphQLNonNull, GraphQLInt} from 'graphql';
import { graphqlHTTP } from 'express-graphql';


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
const items =
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

const games =
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

//#region Custom Object Types
//In our case for -- mocking up, Game and Item
const GameTypeQL = new GraphQLObjectType(
{
    name: 'Game',
    description: `Game's data is stored here`,
    //Fields are in upper case, because that's how the Notion App defines their data.
    fields:()=>
    ({
        id:
        {
            type:new GraphQLNonNull(GraphQLString),
        },
        Name:
        {
            type:new GraphQLNonNull(GraphQLString),
        },

    })
})


const ItemTypeQL = new GraphQLObjectType(
    {
        name: 'Item',
        description: `Item's data is stored here`,
        //Fields are in upper case, because that's how the Notion App defines their data.
        fields:()=>
        ({
            Name:
            {
                type:new GraphQLNonNull(GraphQLString),
            },
            Description:
            {
                type:new GraphQLNonNull(GraphQLString),
            },
            GameID:
            {
                type: new GraphQLNonNull(GraphQLString),
                resolve:(source)=>source.Game
            },
            Game:
            {
                type: new GraphQLNonNull(GameTypeQL),
                // resolve:(source)=>games.find(game=>game.id===source.Game)
            }
    
        })
    })
//#endregion
//#region Our Root Query object. This is {  }
const RootTypeQL = new GraphQLObjectType(
    {
        name:'RootQuery',
        description:'The root of the game database API',
        fields:()=>
        ({
            items:{
                type: new GraphQLList(ItemTypeQL),
                description: 'List of All Items that exist in the game multiverse database.',
                resolve:()=>items
            },
            games:
            {
                type: new GraphQLList(GameTypeQL),
                description: 'List of All Games that exist in this database',
                resolve:()=>games
            }
        })
    });

//#endregion

//#region The Schema that defines our queries and mutations.
//In this case we are just reading/consuming data.

const apiSchema = new GraphQLSchema({query:RootTypeQL});



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
        console.log(`Server started: ${hitomi.port} ~ OK!`);
    }
    catch(error)
    {
        console.error('Error creating server');
    }
})


