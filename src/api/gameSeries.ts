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

router.get('/:seriesName',(request,response)=>
{
    
    response.send(`Series Name: ${request.params.seriesName}`);

})

router.get('/:seriesName/games',(request,response)=>
{
    
    response.send(`${rootRouteName}/${request.params.seriesName}/games`);

})

export const rootRouteName = `/gameSeries`;
export default router;