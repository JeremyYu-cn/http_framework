## Node.js web server framework for Http/1.1 or Http/2

Description: This is http framework, you can use it to create Http/1.1 or Http/2 service。

Now let's start to use it!

## install

### npm

> npm install httpfrk

### yarn

> yarn add httpfrk

## Start

It's very easy to create http server, and return a `HttpServer` object that we can use it to control the request and response.

### Server

```typescript
import { Server } from 'httpfrk';

const app = new Server();
app.use(async (req, res, next) => {
  res.send('hello world');
  res.end();
  await next();
});
app.listen(8080, () => {
  console.log('server running at 8080');
});
```

the `next` parameter is a **function**,we can call it to run the next middleware.

### MiddleWare

The `HttpServer` object provide `use` method to handle request, and the module provide some middleware for `HttpServer`

```typescript
import { Server, Router } from 'httpfrk';

const app = new Server();
const router = new Router();

router.get('hello', (req, res, next) => {
  res.send('hello world');
  res.end();
});

app.use(router.routes());

app.listen(8080, () => {
  console.log('server running at 8080');
});
```
