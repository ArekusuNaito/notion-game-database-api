import { Router } from "express";
import database from "../../notion-game-database";
import { notFoundHandler, responseHandler } from "../tools";
let router = Router();

export const rootRouteName = `/gameSeries`;

router.use((request,response,next)=>
{
    // console.log('Middleware example');
    //Always call the next one
    next();
});

router.get('/',async (request,response)=>
{
    const gameSeries = await database.GetAllGameSeries();
    notFoundHandler(response,gameSeries);
})

router.get('/:seriesName',async (request,response)=>
{
    
    const series = await database.GetGameSeriesGivenName(request.params.seriesName);
    notFoundHandler(response,series);

})

router.get('/:seriesName/games',async (request,response)=>
{
    
    const games = await database.GetAllGamesFromSeries(request.params.seriesName);
    notFoundHandler(response,games);

})

router.get('/:seriesName/items',async (request,response)=>
{
    console.log('???')
    const items = await database.GetAllItemsFromSeries(request.params.seriesName);
    notFoundHandler(response,items);

})





export default router;