import { Router } from "express";
import database from '../notion-game-database';

let router = Router();

router.use((request,response,next)=>
{
    // console.log('Middleware example');
    //Always call the next one
    next();
});

router.get('/',async (request,response)=>
{
    console.log('/items');
    const items = await database.GetItems();
    response.json(items);
})
/**
 * Get 1 item from the items database.
 * @param :itemName => The name of the item needed
 */
router.get('/:itemName',(request,response)=>
{
    
    response.send(`Item Name: ${request.params.itemName}`);

})


export const rootRouteName = `/items`;
export default router;