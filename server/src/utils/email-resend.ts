// Alternative email service using Resend API
// To use this, install: npm install resend
// And replace the import in routes/MagicLink.ts

import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const sendMagicLinkEmail = async (email: string, magicLink: string) => {
  const emailTemplate = {
    from: process.env.EMAIL_FROM || 'True Believers <noreply@yourdomain.com>',
    to: email,
    subject: '🎄 Tu enlace mágico para True Believers',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 20px 0; background: linear-gradient(135deg, #dc2626 0%, #16a34a 100%); color: white; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; padding: 12px 30px; background: #dc2626; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🎄 True Believers 🎄</h1>
            </div>
            <div class="content">
              <h2>¡Hola!</h2>
              <p>Recibimos una solicitud para iniciar sesión en tu cuenta de True Believers.</p>
              <p>Haz clic en el botón de abajo para iniciar sesión (el enlace expira en 15 minutos):</p>
              <div style="text-align: center;">
                <a href="${magicLink}" class="button">Iniciar Sesión</a>
              </div>
              <p style="margin-top: 20px; font-size: 14px; color: #666;">
                O copia y pega este enlace en tu navegador:<br>
                <a href="${magicLink}">${magicLink}</a>
              </p>
              <p style="margin-top: 30px; font-size: 14px; color: #666;">
                Si no solicitaste este enlace, puedes ignorar este correo de forma segura.
              </p>
            </div>
            <div class="footer">
              <p>True Believers - Películas de Navidad</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  if (resend) {
    try {
      const data = await resend.emails.send(emailTemplate);
      console.log('✅ Magic link email sent via Resend:', data.id);
      return { success: true, messageId: data.id };
    } catch (error) {
      console.error('❌ Error sending magic link email:', error);
      throw error;
    }
  } else {
    // Development mode: just log the link
    console.log("\n=================================");
    console.log("🔗 MAGIC LINK (Development Mode)");
    console.log("=================================");
    console.log(`Email: ${email}`);
    console.log(`Link: ${magicLink}`);
    console.log("=================================\n");
    return { success: true, dev: true };
  }
};
