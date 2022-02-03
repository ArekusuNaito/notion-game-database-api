import { GraphQLObjectType,GraphQLList, GraphQLString, GraphQLNonNull, graphql, graphqlSync } from 'graphql';
//Then import our api types.
import { GameTypeQL } from './GameTypeQL';
import { ItemTypeQL } from './ItemTypeQL';
import { items,games } from '../..';
import database from '../../notion-game-database';

export const RootTypeQL = new GraphQLObjectType(
    {
        name:'RootQuery',
        description:'The root of the game database API',
        fields:()=>
        ({
            items:{
                type: new GraphQLList(ItemTypeQL),
                description: 'List of All Items that exist in the game multiverse.',
                resolve : async ()=> await database.GetItems()
            },
            item:{
                type: ItemTypeQL,
                description: 'Just one item ;)',
                args:
                {
                    Name:{type:new GraphQLNonNull(GraphQLString)}
                },
                resolve:async (parent,{Name})=>
                {
                    return await database.GetItem(Name);
                }
            },
            games:
            {
                type: new GraphQLList(GameTypeQL),
                description: 'List of All Games that exist in the game multiverse.',
                resolve:async ()=>  await database.GetAllGames()
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
                resolve: async (parent,args)=>
                {
                    //Endpoints would go here
                    //game/:gameID
                    if(args.id)return await database.GetGameGivenID(args.id)
                    //game/:gameName
                    else if(args.Name)return await database.GetGameGivenName(args.Name);
                }
            },
        })
    });

   