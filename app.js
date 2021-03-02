
'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// cargar archivos de rutas
var project_routes = require('./routes/project');

// middlewares --> El middleware es algo que se ejecuta antes que se ejecute la acción del controlador
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

// Configurar cabeceras y cors
// Esto es un middleware que nos ayuda con las configuraciones minimas necesarias para tener los menos problemas a la hora de trabajar con el frontend
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// rutas
app.use('/', project_routes);


// exportar
module.exports = app;