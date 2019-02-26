# Red Tetris

## Development Mode


#### Installation

Install [node](https://nodejs.org/en/) first. After that:
```
$ npm install
```
Edit `params.js` for your needs.

#### Launch Server
```
$ npm run srv-dev
```

#### Launch client
```
$ npm run client-dev
```

Point your browser to `http://0.0.0.0:8080/` it will load the development version of Red Tetris.


#### Test

```
$ npm run test
```

#### Coverage

```
$ npm run coverage

```

### Production Mode


```
$ npm run srv-dist
$ npm run client-dist

$ DEBUG=tetris:* ./node_modules/babel-cli/bin/babel-node.js dist/server/main.js
```

The game can then be played at the URL specified in params.js with proper hash URL formatting (e.g. localhost:3000/#username\[roomname\])

Enjoy :)