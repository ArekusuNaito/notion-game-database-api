import { GraphQLObjectType,GraphQLNonNull,GraphQLString } from "graphql"
import { GameTypeQL } from "./GameTypeQL"
//This is just a placeholder to make it work in a modularized way.
import { games } from "../.."

export const ItemTypeQL = new GraphQLObjectType(
    {
        name: 'Item',
        description: `Item's data is stored here`,
        fields:()=>
        ({
            Name:
            {
                type:new GraphQLNonNull(GraphQLString),
            },
            Description:
            {
                type:new GraphQLNonNull(GraphQLString),
            },
            GameID:
            {
                type: new GraphQLNonNull(GraphQLString),
                resolve:(source)=>source.Game
            },
            Game:
            {
                type: new GraphQLNonNull(GameTypeQL),
                resolve:(itemSource)=>games.find(game=>game.id===itemSource.Game)
            }
    
        })
    })