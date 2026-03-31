// Netlify Function — Envío de consultas vía Resend
// Variable de entorno requerida en Netlify: RESEND_API_KEY

const { Resend } = require('resend');

exports.handler = async (event) => {
  // Solo aceptar POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  // Parsear body
  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { nombre, email, etapa, mensaje } = body;

  // Validación básica
  if (!nombre || !email || !mensaje) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Faltan campos requeridos' }) };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      // Usa tu dominio verificado en Resend. Mientras configuras el dominio,
      // puedes usar: from: 'onboarding@resend.dev'
      from:     'Maitenmovimiento <consultas@maitenmovimiento.com>',
      to:       'maitenmovimiento@gmail.com',
      replyTo:  email,
      subject:  `💜 Nueva consulta de ${nombre}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"/></head>
        <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background:#f5edfb; margin:0; padding:20px;">
          <div style="max-width:560px; margin:0 auto; background:white; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(122,31,161,0.12);">
            <div style="background:#7A1FA1; padding:28px 32px;">
              <h1 style="color:white; margin:0; font-size:22px; font-weight:300;">✿ Nueva consulta desde el sitio</h1>
            </div>
            <div style="padding:28px 32px;">
              <table style="width:100%; border-collapse:collapse;">
                <tr>
                  <td style="padding:10px 0; border-bottom:1px solid #f0e8ff; font-size:12px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:#8a7a96; width:120px;">Nombre</td>
                  <td style="padding:10px 0; border-bottom:1px solid #f0e8ff; font-size:15px; color:#18101f;">${escHtml(nombre)}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0; border-bottom:1px solid #f0e8ff; font-size:12px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:#8a7a96;">Email</td>
                  <td style="padding:10px 0; border-bottom:1px solid #f0e8ff; font-size:15px; color:#18101f;"><a href="mailto:${escHtml(email)}" style="color:#7A1FA1;">${escHtml(email)}</a></td>
                </tr>
                <tr>
                  <td style="padding:10px 0; border-bottom:1px solid #f0e8ff; font-size:12px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:#8a7a96;">Etapa</td>
                  <td style="padding:10px 0; border-bottom:1px solid #f0e8ff; font-size:15px; color:#18101f;">${escHtml(etapa || 'No especificada')}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0; font-size:12px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:#8a7a96; vertical-align:top;">Mensaje</td>
                  <td style="padding:10px 0; font-size:15px; color:#18101f; line-height:1.65;">${escHtml(mensaje).replace(/\n/g, '<br>')}</td>
                </tr>
              </table>
              <div style="margin-top:24px;">
                <a href="mailto:${escHtml(email)}" style="display:inline-block; background:#7A1FA1; color:white; padding:12px 24px; border-radius:50px; font-size:13px; font-weight:700; letter-spacing:0.08em; text-decoration:none; text-transform:uppercase;">
                  Responder a ${escHtml(nombre)} →
                </a>
              </div>
            </div>
            <div style="padding:16px 32px; background:#faf7ff; border-top:1px solid #f0e8ff;">
              <p style="margin:0; font-size:11px; color:#8a7a96;">Este mensaje fue enviado desde el formulario de contacto de <strong>maitenmovimiento.com</strong></p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true }),
    };

  } catch (err) {
    console.error('Resend error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al enviar el correo. Intenta de nuevo.' }),
    };
  }
};

// Escapa HTML para el template del email
function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
