const { Server } = require('../dist/index');

const app = new Server();

app.listen(8989, () => {
  console.log('server running at 8989');
});
