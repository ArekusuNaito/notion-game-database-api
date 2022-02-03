# readme

# Game Database from Notion — What it does?

As simplest terms this repository does the following.

- From Notion Databases → make queries to retrieve data in JSON.

That is the simplest way to describe it.

![image1 - notion to json.png](readme%207b43d2155efc405887228a510b003925/image1_-_notion_to_json.png)

### Example — Get all Items from the Item Page from the Notion App

```graphql
{
  items{
    Name
  }
}
```

Will get:

```json
{
  "data": {
    "items": [
      {
        "Name": "Three-Star Cane"
      },
      {
        "Name": "1 Up"
      },
      {
        "Name": "KerokeroCola"
      },
      {
        "Name": "Xal'atath, Blade of the Black Empire"
      },
      {
        "Name": "Oblivion"
      },
      {
        "Name": "Pick Me Up"
      },
      {
        "Name": "Rare Candy"
      },
      {
        "Name": "Red Potion"
      }
    ]
  }
}
```

# Technologies used

- Javascript → Typescript
- express
    - routers
- Notion API Client
- GraphQL → express-graphql
    - (Resolver were super awesome to use)
- dotenv → To secure our personal data in notion
- fuse-box
    - To transpile typescript to JavaScript and bundle it.
    - It auto-reloads code as well, for seamless testing.
- markdown — (otherwise how did I wrote this documentation?)
- Affinity Designer — For the diagrams
- Docker — To isolate the environment and test it like so.

<aside>
ℹ️ The architecture is well encapsulated in their directories and functions/objects.

</aside>

# Docker

# Iterations and Theory

## Iteration 1 — An express iteration

The first iteration consisted in choosing the database that was meant to be used for the API.

Notion was selected because its friendly and its very versatile to use from a front-end point of view. This tool is already made and its free to use. Retrieving data from notion and processing it here means that it can be easily migrated to another database, like MongoDB / MySQL.

There are 3 simple tables for this example, the most important tables that will be parents to many other tables that will be added in the future. 

### The Table Relations

![image2 - table relations.png](readme%207b43d2155efc405887228a510b003925/image2_-_table_relations.png)

Here are the following main facts:

- A `Game Series` is composed of Many `Games`
- A `Game` has Many Items
- Hence, an Item is related to a `Game` and thus to a `Game Series`.

---

### Relations on code

To explain these table relations, `typescript interfaces` will be used.

```tsx
interface GameSeries
{
    Name:string // => Eg. Kirby
    //Notion adds automatically a bidirectional field
    //This represents all the IDs of the games that belong to this game series.
    Games:string[]
}

/**
 * A Series has many games
 */
interface Game
{
    Name:string //Eg. Kirby Super Star Ultra Deluxe
    //Note: No suffix -ID because this is the name of the Notion database
    //Which lacks the -ID suffix
    GameSeries:string //the String ID of parent game series
    //Notion Adds automatically a bidirectional field.
    //This represents all IDs from the items of this game.
    GameItems:string[] 
}

interface Item
{
    Name:string //Eg. Three-Star Cane
    Description:string
    //GameID in API, but it shows the actual game name in Notion's App
    //Same as Game in the field GameSeries
    Game:string 
}
```

### The basic endpoints on a RESTful logic.

RESTful endpoints look like this: `/api/items`

As we’ve increased our technology — both in performance and knowledge — we can create interfaces that humans can create with natural language, or at least the attempt is to try and create things with natural language at the very edge.

Then, this endpoint — `/api/items/` — can be translated to a natural language as:

- Bring me all items from the table Items.

![image2 - api to json.png](readme%207b43d2155efc405887228a510b003925/image2_-_api_to_json.png)

And we can ask for a single item with: `/api/item/Red Potion`

Which it won’t take much to interpret it as:

- Bring an item named `Red Potion`

Now that this was explained these are the following endpoints that were implemented for the `express` iteration.

If there’s questions regarding the data objects [don’t forget the mentioned typescript interfaces](https://www.notion.so/readme-8516c596000944ec91bd8ed4865aacd3).  The following is the list of endpoints implemented for the `express` iteration.

- / — Root Router
    - /items — Item router
    - /games — Game router
    - /gameSeries — Game series router

### GET — /items

- Get `all items` from the `Item` database

### GET — /item/:itemName

- Get `one item` given the `Item’s Name` from the Item database.

### GET — /games

- Get `all games` from the Game database.

### GET — /game/:gameName

- Get `one game` given the `Game’s Name`.

### GET — /game/:gameName/items

- Get `all items` from one given `Game name`

### GET — /gameSeries/

- Get `all game series`

### GET — /gameSeries/:gameSeriesName

- Get `one Game Series` given the `Game Series’ Name` from the Game Series database.

### GET — /gameSeries/:gameSeriesName/games

- Get `all games` given one `game series name`.

### GET — /gameSeries/:gameSeriesName/items

- Get `all items` from one given `game series name`

## Iteration 2 — Adding GraphQL

The previous iteration ended after migrating everything from one file handling all endpoints to a single router with smaller routers inside to handle those requests.

The main disadvantage of using `GraphQL` is that it requires more time to setup the whole thing. And it’s not even using a client like `Apollo.` Because there’s some concepts that have to be learned in order to use it. However, `GraphQL` will allow a smaller code for even larger projects. As some endpoints will program themselves.

<aside>
ℹ️ GraphQL = Graph Query Language

</aside>

![image 4 - graph to json.png](readme%207b43d2155efc405887228a510b003925/image_4_-_graph_to_json.png)

The previous image explains that we only need `1 single endpoint`. And then, all queries will be handled with another language, a `query language`. That’s what it means to type that syntax very similar to `JSON`. 

- This allows multiple language clients to use this common ground to make requests and the backend will handle the query requests.

## The ingredients in GraphQL

The most basic things we are going to need to migrate this from the REST logic are:

- A Middleware to connect to express
    - A schema that defines our queries
        - root query object
            - items
                - List of `ItemTypeQL`
            - item : `ItemTypeQL`
            - games: List of `GameTypeQL`
            - game: `GameTypeQL`
            - gameSeries: `GameSeriesType`

The most important thing is that we have to define  our own GraphQL object types, which is like making typescript interfaces.

I personally added the suffix `-TypeQL` to reflect it comes from GraphQL. **This is the convention used for all types.**

Let’s take a look to `GameTypeQL`

### Example (Custom Object) — GameTypeQL

```tsx
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
```

Which is somewhat similar to the previous example of the `typescript interface`.

```tsx
interface Game
{
    Name:string //Eg. Kirby Super Star Ultra Deluxe
    //Note: No suffix -ID because this is the name of the Notion database
    //Which lacks the -ID suffix
    GameSeries:string //the String ID of parent game series
    //Notion Adds automatically a bidirectional field.
    //This represents all IDs from the items of this game.
    GameItems:string[] 
}
```

The most important thing is that on each field we are going to define:

- Restrictions
- Specific arguments
    - Which can have restrictions
- A resolve function

The `resolve` function will define how to retrieve data from the given field. 

For example — Adding the `Items` field allows us to recreate the endpoint we had in `express` → `/games/items` and also `/game/:gameName/items`

### Example — Making a query to get all games

```graphql
{
  games{

}
```

This then returns:

```json
{
  "data": {
    "games": [
      {
        "Name": "Kirby Super Star Ultra Deluxe"
      },
      {
        "Name": "Super Mario World"
      },
      {
        "Name": "World of Warcraft"
      },
      {
        "Name": "Kingdom Hearts III"
      },
      {
        "Name": "Super Mario RPG : The Legend of the Seven Stars"
      },
      {
        "Name": "Pokemon Soul Silver"
      },
      {
        "Name": "Kirby Mass Attack"
      },
      {
        "Name": "Kirby Super Star"
      },
      {
        "Name": "Majora’s Mask"
      },
      {
        "Name": "Warcraft III : Reign of Chaos"
      }
    ]
  }
}
```

### Example — Making a query to get all items from a game

```graphql
{
  games{
    Name
  }
}
```

This then returns:

```json
{
  "data": {
    "game": {
      "Name": "Super Mario RPG : The Legend of the Seven Stars",
      "Items": [
        {
          "Name": "KerokeroCola"
        },
        {
          "Name": "Pick Me Up"
        }
      ]
    }
  }
}
```

### Finally

Things are very smooth now. As the `resolve` functions provided funcionality that is logical to follow given this:

- One Game Series has Many Games
- One Game has many Items
- One Item belongs to a Game
    - One Game series has many,many items.

![image1 - notion to json.png](readme%207b43d2155efc405887228a510b003925/image1_-_notion_to_json%201.png)

<aside>
ℹ️ Transformed to JSON using GraphQL

</aside>