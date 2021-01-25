import { Block } from './src/blocks/block.ts';
import { Mine } from './src/blocks/mine.ts';
import { Blockchain } from './src/blocks/blockchain.ts';
import { Application } from "https://deno.land/x/oak/mod.ts";
import routes from './routes/index.routes.ts';
import router from "./routes/index.routes.ts";
import { P2PService } from './p2p.ts';
import { config } from "https://deno.land/x/dotenv/mod.ts";

const env = config();

//console.log(env.HTTP_PORT); // 'XYZDEF123987...'
//console.log(env.P2P_PORT); // '56780987ABCQWERTY...'

const blockchain = new Blockchain();
const p2pService = new P2PService(blockchain);

const HTTP_PORT = parseInt(env.HTTP_PORT) || 3000;
const app = new Application();

app.use(router.routes());

app.use(router.allowedMethods());

app.addEventListener("listen", ({ hostname, port, secure }) => {
    console.log(
      `Listening on: ${secure ? "https://" : "http://"}${hostname ??
        "localhost"}:${port}`,
    );
    p2pService.connectNode();
  });

await app.listen({port : HTTP_PORT});
