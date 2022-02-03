import { GraphQLObjectType,GraphQLNonNull,GraphQLString, graphql, GraphQLList } from "graphql"
import database from "../../notion-game-database";
import { ItemTypeQL } from "./ItemTypeQL";

export const GameTypeQL = new GraphQLObjectType(
    {
        name: 'Game',
        description: `Game's data is stored here`,
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
            Items:
            {
                type:new GraphQLList(ItemTypeQL),
                resolve:async (sourceGame)=>
                {
                    
                    return await database.GetItemsByGame(sourceGame.Name);
                }
            }
        })
    })