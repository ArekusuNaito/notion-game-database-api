import {Client} from '@notionhq/client';
import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';

export interface SecretFileProperties
{
    notion:string
    itemDatabaseID:string
    gameDatabaseID:string
    gameSeriesDatabaseID:string
}

/**
 * THIS CLASS DOESN'T CONSIDER PAGINATION YET
 * THE REASON OF THIS ITS BECAUSE THE DATABASES ARE VERY SMALL AT THE MOMENT.
 * ADD PAGINATION  WHEN THE CASE IS NEEDED
 * ---
 * Also there's no caching. Caching would be useful too! :)
 */






export class GameDatabaseNotion
{
    
    itemDatabaseID:string;
    gameDatabaseID:string;
    gameSeriesDatabaseID:string;
    notion:Client;
    constructor()
    {
        
    }
    SetCredentials(secret:SecretFileProperties)
    {
        try
        {
            //Don't store secret.notion
            //Also, we don't need it.
            this.notion = new Client({auth:secret.notion});
            this.itemDatabaseID = secret.itemDatabaseID;
            this.gameDatabaseID = secret.gameDatabaseID;
            this.gameSeriesDatabaseID = secret.gameSeriesDatabaseID;
            console.log('API Creation ~ OK');
        }catch(error)
        {
            console.error('Error creating Game Database API - Are credentials ok on secret file?');
        }
    }
    SetItemsDB_ID(itemDatabaseID:string)
    {
        this.itemDatabaseID = itemDatabaseID;
    }
    async GetItemDatabaseMetaData()
    {
        return await this.notion.databases.retrieve({database_id:this.itemDatabaseID})
        
    }
    /**
     * ToDo: Provide a solution for pagination
     * @returns An array with the pages from the Item Database
     */
    async GetItems()
    {
        const pages = await this.notion.databases.query({database_id:this.itemDatabaseID});
        //remove the upper object, then we just return the results array
        

        return await this.SimplifyQueryResult(pages);
    }
    async GetItemsByName(itemName:string)
    {
    
        //HOW TO CHECK FOR PASCAL CASING OR OTHERS?
        //Filtering is case sensitive
        const query = await this.notion.databases.query(
            {
                database_id:this.itemDatabaseID,
                filter:
                {
                    "property":"Name",
                    "text":
                    {
                        contains:itemName
                    }
                }
            });
        try
        {   if(query.results.length>0)
            {
                return await this.SimplifyQueryResult(query);
            }
            else return null;
            
        }
        catch(error) //prob a 404 - not found
        {
            return null;
        }
        
    }
    async GetIDFromGame(gameName:string)
    {
        const pages = await this.notion.databases.query(
            {
                database_id:this.gameDatabaseID,
                filter:
                {
                    property:'Name',
                    text:
                    {
                        contains:gameName
                    }
                }
            })
        return this.GetFirstIDFromQuery(pages);
    }

    GetFirstIDFromQuery(query:QueryDatabaseResponse)
    {
        try
        {
            return query.results[0].id;
            
        }catch(error)
        {
            return null;
        }
    }

    /**
     * From Items => All Items from a specified game name.
     * @param gameName 
     * @returns 
     */
    async GetItemsByGame(gameName:string)
    {
        const gameID = await this.GetIDFromGame(gameName);
        if(gameID)
        {
            // ee352af0-b1f7-4b0c-b523-afadf6a57f19
            const queryResult = await this.notion.databases.query(
                {
                    database_id:this.itemDatabaseID,
                    filter:
                    {
                        property:'Game',
                        relation:
                        {
                            contains:gameID
                        }
                    }
                })
            if(queryResult)
            {
                return this.SimplifyQueryResult(queryResult);
            }
            else return null;
        }
        else return null;
        
    }

    /**
     * Gets the first ID of the specified game series name.
     * @param gameSeries 
     * @returns 
     */
    private async GetIDFromSeries(gameSeries:string)
    {
        const pages = await this.notion.databases.query(
            {
                database_id: this.gameSeriesDatabaseID,
                filter:
                {
                    property:"Name",
                    text:
                    {
                        equals:gameSeries
                    }
                }
            })
        return this.GetFirstIDFromQuery(pages);
    }
    /**
     * 
     * Gets all games from a given game series.
     * 1. Get the ID from the series
     * 2. Get all games that have that series ID.
     * 3. Simplify result set
     * @param gameSeries 
     * @returns 
     */
    async GetAllGamesFromSeries(gameSeries:string)
    {

        let gameSeriesID = await this.GetIDFromSeries(gameSeries);
        if(gameSeriesID!==null)
        {
            const gameListQuery = await this.notion.databases.query(
                {
                    database_id:this.gameDatabaseID,
                    filter:
                    {
                        property:"Series",
                        relation:
                        {
                            contains:gameSeriesID
                        }
                    }
                });
            console.log(gameListQuery);
            try
            {
                if(gameListQuery.results)return await this.SimplifyQueryResult(gameListQuery);
            }catch(error)
            {
                console.log('Error simplyfing results from - GetAllGamesFromSeries()');
            }
            
            
        }
        else 
        {
            return null;
        };
    }
        /**
         * From Game Series => Get All Items from that series
         * Process:
         * 1. Gets all games from the series
         * 2. Gets all items from the games collected
         * 3. Simplifies/Projects the item result set.
         * @param gameSeries 
         * @returns 
         */
    async GetAllItemsFromSeries(gameSeries:string)
    {
        const gameList = await this.GetAllGamesFromSeries(gameSeries);
        if(gameList)
        {
            const promiseList = []
            for(let index=0;index<gameList.length;index++)
            {
                const currentGame = gameList[index];
                promiseList.push(this.GetItemsByGame(currentGame.Name));
            }
            const results = await (await Promise.all(promiseList)).flat(2);
            let simplifiedResults = []
            for(let index=0;index<results.length;index++)
            {
                const currentItemPage = results[index];
                let newPage:any = this.ProjectPage(currentItemPage);
                newPage = await this.SimplifyPropertiesForPage(newPage);
                newPage.GameSeries = gameSeries;
                simplifiedResults.push(newPage);
            }
            return simplifiedResults;
        }
        else
        {
            return null;
        }
       
    }

    /**
     * For testing purposes.
     * This function was to test how to use the filter function like the actual notion app filter.
     */
    private async GetItemsWithQuery()
    {
        
        const pages = await this.notion.databases.query(
            {
                database_id:this.itemDatabaseID,
                filter:
                {
                    "property":"Name",
                    "text":{equals:'Rare Candy'}
                }
            });
        console.log(pages.results.length);
    }

    //TODO: ADD THE CASE WHEN A ROW IS EMPTY, BUT ADDED
    private async SimplifyQueryResult(pages:QueryDatabaseResponse)
    {
        

        //Custom map function but with normal for loop
        let simplifiedPages:any = []
        for(let index = 0;index<pages.results.length;index++)
        {
         
            let currentPage:any = pages.results[index];
            //Projection / Projected Pages means that will take specific fields from an object.
            //In this case, we pluck properties we want for this item
            currentPage = this.ProjectPage(currentPage);
            //Page properties have other nested properties.
            //We just want the actual raw data from the data fields from the notion table.

            currentPage = await this.SimplifyPropertiesForPage(currentPage);
            simplifiedPages.push(currentPage);
        }
        return simplifiedPages;
    }

    /***
     * Simply returns properties we will use for our API
     */
    private ProjectPage(page:any)
    {
        return {
            id:page.id,
            properties:page['properties']
        }
    }

    private async SimplifyPropertiesForPage(pageItem:any)
    {
        const pageProperties = pageItem.properties;
        // const pageName = pageProperties.Name.title[0].plain_text;
        let newProperties = {id:pageItem.id}
        for(let propertyName in pageProperties)
        {
            const currentProperty = pageProperties[propertyName];
            // const propertyType = currentProperty.type;
            newProperties[propertyName] = await this.GetDataFromPropertyType(currentProperty);
        }
        
        return newProperties;

        
    }
    private async GetDataFromPropertyType(property:any)
    {
        if(property.type == 'title')return property.title[0].plain_text;
        //Rich can have many elements. This property has to be iterated if the text has styling. Bold/italics/etc
        //For now we won't use this, and just assume there's no text styling
        else if(property.type == 'rich_text')return property.rich_text[0].plain_text
        
        //Next is a relation case
        //This just does 1 level deep nesting.
        //If we need to get (and we will later) page.father.grandfather, think about another algorithm
        else if(property.type == 'relation')
        {
            //Relations are like a foreign key
            //Eg.
            //property.id = "Qdbd"
            //property.relation = [{}]
            //property.relation[0].id = the foreign key
            
            const relationForeignID = property.relation[0].id
            return relationForeignID;
            //So we need to request for that
            // ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! 
            //This code makes the request slow, because it makes more requests to get the game name
            //To make the request to get the name: 👇
            // let foreignPage:any = await this.notion.pages.retrieve({page_id:relationForeignID});
            // foreignPage = this.ProjectPage(foreignPage);
            // return await this.GetDataFromPropertyType(foreignPage.properties.Name);
        }
        else return null;
    }

    private async ExtractOneProperty(pageID:string,properyName:string)
    {
        
    }

}

export default new GameDatabaseNotion();