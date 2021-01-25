import { Router } from 'https://deno.land/x/oak/mod.ts';
import * as controllers from '../controllers/controllers.ts';

const router = new Router();

router.get('/getBlocks', controllers.getBlocks);

router.post('/mine', controllers.mineBlock);

export default router;