const http = require('http');
const app = require('../server/index');

const server = http.createServer(app);

function normalizePort(val) {
    const port = parseInt(val, 10);
    if (Number.isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? `Pipe ${port}`
        : `Port ${port}`;
    switch (error.code) {
        case 'EACCES':
            logger.log(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            logger.log(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? `PIPE ${addr}`
        : `PORT ${addr.port}`;
    console.log(`Server started listening on ${bind}`);
}

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);