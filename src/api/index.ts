import { Router } from "express";
import GameDatabaseNotion from "../notion-game-database";

const rootRouteName = `/foo`;

let apiRoot = Router();

//Import routers
//Game Series
import {rootRouteName as gameSeriesRouteName} from './routes/gameSeries';
import gameSeriesRouter from './routes/gameSeries';

//Games
import {rootRouteName as gamesRouteName} from './routes/games';
import gamesRouter from './routes/games';

//Items
import {rootRouteName as itemsRouteName} from './routes/items';
import itemsRouter from './routes/items';



apiRoot.use((request,response,next)=>
{
    // console.log('Middleware example');
    //Always call the next one
    
    next();
});

apiRoot.get('/',async (request,response)=>
{
    // const items = await wrapper.database.GetItems();
    response.send('Hi! /');
})

apiRoot.use(gameSeriesRouteName,gameSeriesRouter);
apiRoot.use(gamesRouteName,gamesRouter);
apiRoot.use(itemsRouteName,itemsRouter);





export default apiRoot;