import express from 'express';
const server = express();
const port = 3000;
import GameDatabaseNotion from './notion-queries'
import type { SecretFileProperties } from './notion-queries';
import hitomi from '../hitomi.json';

let database:GameDatabaseNotion;

// database.GetItems();

server.get('/',(request,response)=>
{
    response.send('Hi!');
});

server.get('/ping',(request,response)=>
{
    response.send('Pong');
});

/**
 * Get 1 item from the items database.
 * @param :itemName => The name of the item needed
 */
server.get(`/items/:itemName`,async (request,response)=>
{
    const itemName = request.params.itemName;

    const items = await database.GetItemsByName(itemName);
    // response.send(`Execution ok - ${itemName}`);
    if(items)
    {
        response.json(items);
    }
    else response.status(404).send('Error 404 - Item not found');
})

/**
 * Gets all items from a given game name.
 * @param :gameName => The game where the items will be retrived.
 */
server.get(`/games/:gameName/items/`,async (request,response)=>
{
    const gameName = request.params.gameName;
    const gameItems = await database.GetItemsByGame(gameName);
    if(gameItems)
    {
        response.json(gameItems);
    }
    else response.status(404).send('Error 404 - Game not found');
})

server.get(`/gameSeries/:gameSeriesName/games`,async (request,response)=>
{
    const gameSeriesName = request.params.gameSeriesName;
    const gameList = await database.GetAllGamesFromSeries(gameSeriesName);
    if(gameList)
    {
        response.json(gameList);
    }
    else 
    {   
        response.status(404).send('Error 404 - Game Series not found');
    }
    
})

server.listen(port,async ()=>
{
    try
    {
        database= new GameDatabaseNotion(hitomi as SecretFileProperties);
        await database.Create();
        // await database.GetItemsByName('rare candy');
        // await database.GetAllGamesFromSeries('Super Mario Bros.')
        // const foo = await database.GetIDFromGame('Super Mario RPG : The Legend of the Seven Stars');
        // const foo = await database.GetAllItemsFromSeries('Super Mario Bros.')
        // console.log(foo)
        console.log(`Server started: ${port} ~ OK!`);
    }
    catch(error)
    {
        console.error('Error creating server');
    }
})


