import { Router } from "express";

let router = Router();

router.use((request,response,next)=>
{
    // console.log('Middleware example');
    //Always call the next one
    next();
});


router.get('/',(request,response)=>
{
    
    response.send(`${rootRouteName}`);

})

router.get('/:gameName',(request,response)=>
{
    
    response.send(`Game Name: ${request.params.gameName}`);

})

/**
 * Gets all items from a given game name.
 * @param :gameName => The game where the items will be retrived.
 */
router.get('/:seriesName/games',(request,response)=>
{
    
    response.send(`${rootRouteName}/${request.params.seriesName}/games`);

})





export const rootRouteName = `/games`;
export default router;