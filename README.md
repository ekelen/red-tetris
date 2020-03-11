# Red Tetris

This is a Javascript implementation of the classic game of Tetris in multiplayer mode using the [redpelicans Red Tetris boilerplate](https://github.com/redpelicans/red_tetris_boilerplate).

The interface was built with React + Redux with exclusively functional components.

The node server uses an object-oriented structure and communicates with the front using the [socketIO websocket API](https://socket.io/).

A project for École 42 (web branch). Project requirements can be found in the `/ressources` subfolder in this repository.

## Development Mode

### 1. Installation

Install [node](https://nodejs.org/en/) first. After that:

```shell
npm install
```

Edit `params.js` for your needs.

### 2. Launch Server

```shell
npm run srv-dev
```

### 3. Launch client

```shell
npm run client-dev
```

Point your browser to `http://0.0.0.0:8080/` it will load the development version of Red Tetris.

## Testing

### Run unit tests

```shell
npm run test
```

### Get coverage

```shell
npm run coverage
```

## Production

```shell
npm run srv-dist
npm run client-dist

DEBUG=tetris:* ./node_modules/babel-cli/bin/babel-node.js dist/server/main.js
```

The game can then be played at the URL specified in params.js with proper hash URL formatting (e.g. localhost:3000/#username\[roomname\])

Enjoy :)
