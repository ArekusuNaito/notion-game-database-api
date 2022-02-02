import { GraphQLObjectType,GraphQLNonNull,GraphQLString, graphql, GraphQLList } from "graphql"
import {items} from '../..';
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
                resolve:(sourceGame)=>
                {
                    return items.filter(item=>item.Game==sourceGame.id)
                }
            }
        })
    })