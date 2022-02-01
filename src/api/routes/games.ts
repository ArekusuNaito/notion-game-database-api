import { Router } from "express";
import database from "../../notion-game-database";
import { notFoundHandler, responseHandler } from "../tools";

export const rootRouteName = `/games`;
let router = Router();

router.use((request,response,next)=>
{
    // console.log('Middleware example');
    //Always call the next one
    next();
});


router.get('/',async (request,response)=>
{
    
    const games = await database.GetAllGames();
    notFoundHandler(response,games);

})

router.get('/:gameName',async (request,response)=>
{
    
    const game = await database.GetGameGivenName(request.params.gameName);
    notFoundHandler(response,game);

})

/**
 * Gets all items from a given game name.
 * @param :gameName => The game where the items will be retrived.
 */
router.get('/:gameName/items',async (request,response)=>
{
    console.log(request.params.gameName)   
    const items = await database.GetItemsByGame(request.params.gameName);
    notFoundHandler(response,items);
})






export default router;