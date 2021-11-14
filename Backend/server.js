//Importer package http, donne accès à l'objet http permettant de créer un serveur
const http = require('http'); //Création d'un programme qui écoute, attend et répond à des requêtes http
const app = require('./app');

//La fonction normalizePort renvoie un port valide
const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

//la fonction normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne ;
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port); //atribu le nom a la valeur port avec set d express

//La fonction errorHandler recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const server = http.createServer(app); //la fonction sera appele achaque requete recu par le server

server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

server.listen(port); //Ecouteur d'évènement, consignant le port nommé sur lequel le serveur s'exécute dans la console. Ecoute et attend les requêtes envoyées