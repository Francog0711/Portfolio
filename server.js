const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// conexión a mongo
mongoose.connect('mongodb+srv://francogabrielalconchel:franco0711@cluster0.vkqewcl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// model 
const Contacto = mongoose.model('Contacto', {
  nombre: String,
  email: String,
  mensaje: String
});

// ruta de guardado y mail
app.post('/guardar-contacto', async (req, res) => {
  try {
    const nuevoContacto = new Contacto(req.body);
    await nuevoContacto.save();

    // enviar
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

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
