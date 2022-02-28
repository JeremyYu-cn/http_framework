import { Server, Router, Static, BodyParse } from '../src/index';
import path from 'path';
const app = new Server();
const router = new Router({ prefix: 'hello/' });

router.post('/test', (req, res) => {
  res.send('hello world');
});

// app.use(BodyParse());
// app.use(router.routes());
// app.use(
//   Static({
//     pathName: path.resolve(__dirname, 'asset'),
//     expire: 100,
//     cache: true,
//   })
// );

app.listen(9988, () => {
  console.log('server running at 9988');
});
