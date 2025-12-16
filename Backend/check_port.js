const net = require('net');

const checkPort = (port) => {
    return new Promise((resolve, reject) => {
        const server = net.createServer();

        server.once('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                resolve(true); // Port is in use
            } else {
                reject(err);
            }
        });

        server.once('listening', () => {
            server.close();
            resolve(false); // Port is free
        });

        server.listen(port);
    });
};

checkPort(3000).then(inUse => {
    if (inUse) {
        console.log("PORT 3000 IS BUSY");
        process.exit(1);
    } else {
        console.log("PORT 3000 IS FREE");
        process.exit(0);
    }
});
