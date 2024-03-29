import nodemailer from "nodemailer";
import sgMail from '@sendgrid/mail'


export const emailRegsitro = async (datos) => {
  const { email, nombre, token } = datos;
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Información del email
  const info = await transport.sendMail({
    from: '"UpTaks - Administrador de Proyectos" <cuentas@uptask.com>',
    to: email,
    subject: "UpTask - Comprueba tu cuenta",
    text: "Comprueba tu cuenta en UpTask",
    html: `
    <p>Hola: ${nombre} Comprueba tu cuenta en Uptask</p>
    <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace:</p>

    <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>

    <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
    
    `,
  });
};

export const emailOlvidePassword = async (datos) => {
  const { email, nombre, token } = datos;
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Información del email
  const info = await transport.sendMail({
    from: '"UpTaks - Administrador de Proyectos" <cuentas@uptask.com>',
    to: email,
    subject: "UpTask - Reestablece tu Password",
    text: "Reestablece tu Password",
    html: `
    <p>Hola: ${nombre} has solicitado reestablecere tu password</p>
    <p>Sigue el siguiente enlace para generar un nuevo password:</p>

    <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a>

    <p>Si tu no solicitaste este email, puedes ignorar el mensaje</p>
    
    `,
  });
};


export const mailRegister = async(datos)=>{
  const { email, nombre, token } = datos;
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
    to: email, // Change to your recipient
    from: 'hmartinezgenesisempresarial@gmail.com', // Change to your verified sender
    subject: 'UpTask - Comprueba tu cuenta',
    text: "Comprueba tu cuenta en UpTask",
    html: `
    <p>Hola: ${nombre} Comprueba tu cuenta en Uptask</p>
    <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace:</p>

    <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>

    <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
    
    `,
  }

  try {
    await sgMail.send(msg)
  } catch (error) {
    console.error(error)
  }
}

export const mailForgotPassword = async(datos)=>{
  const { email, nombre, token } = datos;
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
    to: email, // Change to your recipient
    from: 'hmartinezgenesisempresarial@gmail.com', // Change to your verified sender
    subject: "UpTask - Reestablece tu Password",
    text: "Reestablece tu Password",
    html: `
    <p>Hola: ${nombre} has solicitado reestablecere tu password</p>
    <p>Sigue el siguiente enlace para generar un nuevo password:</p>

    <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a>

    <p>Si tu no solicitaste este email, puedes ignorar el mensaje</p>
    
    `,
  }

  try {
    await sgMail.send(msg)
  } catch (error) {
    console.error(error)
  }
}