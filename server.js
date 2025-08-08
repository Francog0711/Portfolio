const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();


app.use(cors());
app.use(bodyParser.json());

// Servir archivos estáticos desde /public
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/contactos');

// model
const Contacto = mongoose.model('Contacto', {
  nombre: String,
  email: String,
  mensaje: String
});

// guardar contacto y enviar email
app.post('/guardar-contacto', async (req, res) => {
  try {
    const nuevoContacto = new Contacto(req.body);
    await nuevoContacto.save();

    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.CORREO,
        pass: process.env.PASS
      }
    });

    const mailOptions = {
      from: process.env.CORREO,
      to: process.env.CORREO,
      subject: 'Nuevo mensaje de tu formulario de contacto',
      text: `
        Nombre: ${req.body.nombre}
        Email: ${req.body.email}
        Mensaje: ${req.body.mensaje}
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).send('Guardado y enviado');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Render usa process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
