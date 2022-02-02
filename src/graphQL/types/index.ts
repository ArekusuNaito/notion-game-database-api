import { GraphQLObjectType,GraphQLList, GraphQLString, GraphQLNonNull, graphql, graphqlSync } from 'graphql';
//Then import our api types.
import { GameTypeQL } from './GameTypeQL';
import { ItemTypeQL } from './ItemTypeQL';
import { items,games } from '../..';


export const RootTypeQL = new GraphQLObjectType(
    {
        name:'RootQuery',
        description:'The root of the game database API',
        fields:()=>
        ({
            items:{
                type: new GraphQLList(ItemTypeQL),
                description: 'List of All Items that exist in the game multiverse.',
                resolve:()=>items
            },
            item:{
                type: ItemTypeQL,
                description: 'Just one item ;)',
                args:
                {
                    Name:{type:new GraphQLNonNull(GraphQLString)}
                },
                resolve:(parent,{Name})=>
                {
                    return items.find(item=>item.Name===Name)
                }
            },
            games:
            {
                type: new GraphQLList(GameTypeQL),
                description: 'List of All Games that exist in the game multiverse.',
                resolve:()=>games
            },
            game:
            {
                type: GameTypeQL,
                description: 'Data for 1 Game data',
                args:
                {
                    id:{type:GraphQLString},
                    Name:{type:GraphQLString},
                },
                resolve:(parent,args)=>
                {
                    //Endpoints would go here
                    //game/:gameID
                    if(args.id)return games.find(game=>game.id==args.id)
                    //game/:gameName
                    else if(args.Name)return games.find(game=>game.Name==args.Name)
                }
            },
        })
    });

   