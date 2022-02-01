// const {fusebox} = require('fuse-box');
// const {pluginJSON} = require('fuse-box');
import {fusebox} from 'fuse-box';
import {pluginJSON} from 'fuse-box';
const fuse = fusebox
({
    entry: './src/index.ts',
    target: 'server',
     //If you already have a tsconfig, you can tell fusebox where it is, using the "compilerOptions"
    // hmr: true,
    // watch:true,
    hmr:true,

    watcher: {
      include: 
      [
        "*.ts"
      ],
      ignore: 
      [
        
      ]
    },
    plugins: [pluginJSON()]
});

// https: //github.com/fuse-box/fuse-box/blob/grand-refactor/docs/changelog-fuse-compiler.md


//If you wanna to a hot-reloading, this will do the job
//Just save your code and your terminal will auto-reload your process
async function startBundling()
{
  const {onComplete} = await fuse.runDev()
  onComplete(({server}) => server.start());
}

startBundling();

//Promise bundling
// const devServer = fuse.runDev();
// devServer.then(runResponse=>
// {
//   runResponse.onComplete(handler=>handler.server.start({argsAfter:['after'],argsBefore:['before']}))
// })