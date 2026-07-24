export const accountWelcomeTemplateVersion = 1;
export const accountWelcomeSubject = "Your free PDF resources are unlocked";
export const accountWelcomePreheader = "Your Data with Dylan account is ready.";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function buildResourceLibraryUrl(publicSiteUrl) {
  return new URL("/resources", publicSiteUrl).toString();
}

export function buildAccountWelcomeEmail(publicSiteUrl) {
  const resourceLibraryUrl = buildResourceLibraryUrl(publicSiteUrl);
  const safeResourceLibraryUrl = escapeHtml(resourceLibraryUrl);

  const text = [
    "Hi there,",
    "",
    "You’re all set—your account was created successfully.",
    "",
    "You now have free access to all available PDF cheat sheets and guided notes. There's nothing else you need to do.",
    "",
    `Browse free PDF resources: ${resourceLibraryUrl}`,
    "",
    "Happy learning,",
    "Data with Dylan",
    "",
    "This is a one-time account message and does not subscribe you to marketing emails.",
  ].join("\n");

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${accountWelcomeSubject}</title>
  </head>
  <body style="margin:0;background:#f6f3ec;color:#23211f;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
      ${accountWelcomePreheader}
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f6f3ec;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #ded8cc;border-radius:16px;">
            <tr>
              <td style="padding:40px 36px;">
                <p style="margin:0 0 24px;color:#7c5b35;font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">Data with Dylan</p>
                <h1 style="margin:0 0 24px;color:#23211f;font-size:30px;line-height:1.2;">Your free PDF resources are unlocked</h1>
                <p style="margin:0 0 18px;font-size:17px;line-height:1.6;">Hi there,</p>
                <p style="margin:0 0 18px;font-size:17px;line-height:1.6;">You’re all set—your account was created successfully.</p>
                <p style="margin:0 0 28px;font-size:17px;line-height:1.6;">You now have free access to all available PDF cheat sheets and guided notes. There’s nothing else you need to do.</p>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 24px;">
                  <tr>
                    <td style="border-radius:999px;background:#2f6f5e;">
                      <a href="${safeResourceLibraryUrl}" style="display:inline-block;padding:14px 24px;color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;">Browse free PDF resources</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 30px;font-size:14px;line-height:1.5;color:#625d56;">Or copy and paste this link into your browser:<br><a href="${safeResourceLibraryUrl}" style="color:#2f6f5e;word-break:break-all;">${safeResourceLibraryUrl}</a></p>
                <p style="margin:0;font-size:17px;line-height:1.6;">Happy learning,<br>Data with Dylan</p>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 36px;border-top:1px solid #e8e2d8;color:#77716a;font-size:13px;line-height:1.5;">
                This is a one-time account message and does not subscribe you to marketing emails.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return {
    html,
    resourceLibraryUrl,
    subject: accountWelcomeSubject,
    text,
  };
}
