import Server from './server';
import Router from './router';

const app = new Server();
const router = new Router({ prefix: 'hello/' });

router.get('/:world', (req, res) => {
  console.log(req.route);
  res.send('hello world');
  res.end();
});

app.use(router.routes());

app.listen(9988, () => {
  console.log('server running at 9988');
});

export { Server };
