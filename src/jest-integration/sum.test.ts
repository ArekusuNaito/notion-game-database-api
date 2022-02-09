import 'dotenv/config';
import database from '../notion-game-database';

const hitomi =
{
    "notion":process.env.notion,
    "itemDatabaseID":process.env.itemDatabaseID,
    "gameDatabaseID":process.env.gameDatabaseID,
    "gameSeriesDatabaseID":process.env.gameSeriesDatabaseID,
    "port":process.env.port
}

beforeAll(async ()=>
{
    database.SetCredentials(hitomi);
    
});

test('Get 1 game',async ()=>
{
    const kss = await database.GetGameGivenName('Kirby Super Star');
    console.log(kss);
    expect(kss).not.toBeNull();
})