const {io} = require('../index')
const  Band = require('../models/band');
const  Bands = require('../models/bands');


const bands = new Bands();

bands.addBand(new Band('Queen'));
bands.addBand(new Band('Bon jovi'));
bands.addBand(new Band('Heroes del Silencio'));
bands.addBand(new Band('Metalica'));



//Mensajes de Socket
io.on('connection', client=>{
    console.log('Cliente conectado');

client.emit('active-bands', bands.getbands());



    client.on('disconnect', ()=>{
        console.log('Cliente desconectado');
    });
    client.on('mensaje', (payload)=>{
        console.log('Mensaje', payload);  
        io.emit('mensaje', {admin: 'nuevo mensaje'});
    });

    client.on('vote-band', (payload)=>{
        //console.log(payload );
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getbands());
    });

    client.on('emitir-mensaje', (payload) =>{
        //console.log(payload);
       // io.emit('nuevo-mensaje', payload);  //emite a todos
        client.broadcast.emit('nuevo-mensaje', payload);  //emite a todos menos el que lo escribio

    });

    //escuchar: add-band
    client.on('add-band', (payload)=>{
        //console.log(payload.id );
        const newBand = new Band(payload.name);
        bands.addBand(newBand);
        io.emit('active-bands', bands.getbands());
    });  

    client.on('delete-band', (payload) =>{
        //console.log(payload);
       // io.emit('nuevo-mensaje', payload);  //emite a todos
       bands.deleteband(payload.id);
       io.emit('active-bands', bands.getbands());
    });
});