const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();
const {mongoose} = require('./database');


//Settings
app.set('port',process.env.PORT || 5000); // Escoge un puerto según el servicio o el 5000 por defecto

//Middlewares
app.use(morgan("dev"))
app.use(express.json())

//Static files 
app.use(express.static(path.join(__dirname, 'build')))

//Routes
app.use(require('./src/routes/api.routes'))

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile( path.join( __dirname, 'build/index.html'))
});

//Starting server
app.listen(app.get('port'), () => {
    console.log('Server on port ' + app.get('port'))
})
