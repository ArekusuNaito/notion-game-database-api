import { Response, Router } from "express";
import database from '../../notion-game-database';
import { notFoundHandler } from "../tools";

export const rootRouteName = `/items`;
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
    notFoundHandler(response,items);
})
/**
 * Get 1 item from the items database.
 * @param :itemName => The name of the item needed
 */
router.get('/:itemName',async (request,response)=>
{
    const item = await database.GetItemsByName(request.params.itemName);
    notFoundHandler(response,item);
})



export default router;