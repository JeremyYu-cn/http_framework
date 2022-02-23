import { Server, Router, Static } from '../src/index';
import path from 'path';
const app = new Server();
const router = new Router({ prefix: 'hello/' });

router.get('/:world', (req, res) => {
  console.log(req.route);
  res.send('hello world');
  res.end();
});

app.use(router.routes());
app.use(
  Static({
    pathName: path.resolve(__dirname, 'asset'),
    expire: 100,
    cache: true,
  })
);

app.listen(9988, () => {
  console.log('server running at 9988');
});
