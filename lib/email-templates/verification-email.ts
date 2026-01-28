export const buildPCMCEmailHtml = (
  APP_NAME: string,
  heading: string,
  message: string,
  ctaLabel: string,
  ctaHref: string,
  subMessage?: string,
) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${heading}</title>
    <style>
        body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f1f5f9; color: #334155; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .header-strip { height: 6px; width: 100%; display: flex; }
        .strip-blue { background-color: #1d4ed8; width: 33.33%; height: 6px; }
        .strip-yellow { background-color: #facc15; width: 33.33%; height: 6px; }
        .strip-red { background-color: #dc2626; width: 33.33%; height: 6px; }
        .content { padding: 40px 32px; text-align: center; }
        .logo-text { font-size: 24px; font-weight: 800; color: #1e3a8a; margin-bottom: 4px; letter-spacing: -0.5px; }
        .logo-sub { font-size: 14px; font-weight: 600; color: #dc2626; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 24px; }
        h1 { color: #0f172a; font-size: 22px; font-weight: 700; margin-bottom: 16px; margin-top: 0; }
        p { font-size: 16px; line-height: 1.6; margin-bottom: 24px; color: #475569; }
        .btn { display: inline-block; padding: 14px 32px; background-color: #1d4ed8; color: #ffffff !important; text-decoration: none; font-weight: 600; border-radius: 8px; font-size: 16px; transition: background-color 0.2s; }
        .btn:hover { background-color: #1e40af; }
        .divider { height: 1px; background-color: #e2e8f0; margin: 32px 0; }
        .footer { font-size: 12px; color: #94a3b8; line-height: 1.5; }
        .link-fallback { font-size: 12px; color: #64748b; margin-top: 24px; word-break: break-all; }
        .logo-img { width: 60px; height: auto; margin-bottom: 10px; }
    </style>
</head>
<body>
    <div style="padding: 40px 16px;">
        <div class="container">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="height:6px;">
                <tr>
                    <td style="background-color: #1d4ed8; width: 33%; height: 6px;"></td>
                    <td style="background-color: #facc15; width: 34%; height: 6px;"></td>
                    <td style="background-color: #dc2626; width: 33%; height: 6px;"></td>
                </tr>
            </table>

            <div class="content">
                <div class="logo-text">PCMC</div>
                <div class="logo-sub">${APP_NAME}</div>
                
                <h1>${heading}</h1>
                <p>${message}</p>
                
                ${
                  subMessage
                    ? `<p style="font-size: 14px; background: #fffbeb; color: #92400e; padding: 12px; border-radius: 6px; border: 1px solid #fcd34d;">${subMessage}</p>`
                    : ''
                }

                <div style="margin: 32px 0;">
                    <a href="${ctaHref}" class="btn" target="_blank">${ctaLabel}</a>
                </div>

                <div class="link-fallback">
                    If the button doesn't work, copy and paste this link into your browser:<br/>
                    <a href="${ctaHref}" style="color: #2563eb;">${ctaHref}</a>
                </div>

                <div class="divider"></div>

                <div class="footer">
                    This is an automated message from the <strong>${APP_NAME}</strong>.<br/>
                    Philippine Children's Medical Center<br/>
                    Quezon Ave, Quezon City, Metro Manila
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;

export const buildPCMCRegistraionEmailHtml = (
  APP_NAME: string,
  heading: string,
  message: string,
  subMessage?: string,
) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${heading}</title>
    <style>
        body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f1f5f9; color: #334155; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .header-strip { height: 6px; width: 100%; display: flex; }
        .strip-blue { background-color: #1d4ed8; width: 33.33%; height: 6px; }
        .strip-yellow { background-color: #facc15; width: 33.33%; height: 6px; }
        .strip-red { background-color: #dc2626; width: 33.33%; height: 6px; }
        .content { padding: 40px 32px; text-align: center; }
        .logo-text { font-size: 24px; font-weight: 800; color: #1e3a8a; margin-bottom: 4px; letter-spacing: -0.5px; }
        .logo-sub { font-size: 14px; font-weight: 600; color: #dc2626; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 24px; }
        h1 { color: #0f172a; font-size: 22px; font-weight: 700; margin-bottom: 16px; margin-top: 0; }
        p { font-size: 16px; line-height: 1.6; margin-bottom: 24px; color: #475569; }
        .btn { display: inline-block; padding: 14px 32px; background-color: #1d4ed8; color: #ffffff !important; text-decoration: none; font-weight: 600; border-radius: 8px; font-size: 16px; transition: background-color 0.2s; }
        .btn:hover { background-color: #1e40af; }
        .divider { height: 1px; background-color: #e2e8f0; margin: 32px 0; }
        .footer { font-size: 12px; color: #94a3b8; line-height: 1.5; }
        .link-fallback { font-size: 12px; color: #64748b; margin-top: 24px; word-break: break-all; }
        .logo-img { width: 60px; height: auto; margin-bottom: 10px; }
        .info-card { background: #f0f9ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin: 16px 0; text-align: left; }
        .info-row { display: flex; margin-bottom: 12px; }
        .info-label { font-weight: 600; color: #1e3a8a; min-width: 120px; }
        .info-value { color: #334155; }
        .qr-section { background: #fffbeb; border: 2px solid #fcd34d; border-radius: 12px; padding: 16px; margin: 20px 0; }
        .qr-image { max-width: 200px; height: auto; display: inline-block; }
    </style>
</head>
<body>
    <div style="padding: 40px 16px;">
        <div class="container">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="height:6px;">
                <tr>
                    <td style="background-color: #1d4ed8; width: 33%; height: 6px;"></td>
                    <td style="background-color: #facc15; width: 34%; height: 6px;"></td>
                    <td style="background-color: #dc2626; width: 33%; height: 6px;"></td>
                </tr>
            </table>

            <div class="content">
                <div class="logo-text">PCMC</div>
                <div class="logo-sub">Christmas Incentives</div>
                
                <h1>${heading}</h1>
                <p>${message}</p>
                
                ${
                  subMessage
                    ? `<p style="font-size: 14px; background: #fffbeb; color: #92400e; padding: 12px; border-radius: 6px; border: 1px solid #fcd34d;">${subMessage}</p>`
                    : ''
                }

                <div class="divider"></div>

                <div class="footer">
                    This is an automated message from the <strong>${APP_NAME}</strong>.<br/>
                    Philippine Children's Medical Center<br/>
                    Quezon Ave, Quezon City, Metro Manila
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;

export interface RegistrationEmailData {
  employeeName: string;
  packageName: string;
  packageDescription?: string | null;
  storeName: string;
  storeAddress: string;
  storeContactNumber?: string | null;
  eventName?: string;
  redemptionDate?: string;
  redemptionStart?: string;
  redemptionEnd?: string;
}

export const buildPCMCRegistrationDetailedEmailHtml = (
  APP_NAME: string,
  data: RegistrationEmailData,
) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Confirmation</title>
    <style>
        body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f1f5f9; color: #334155; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .header-strip { height: 6px; width: 100%; display: flex; }
        .strip-blue { background-color: #1d4ed8; width: 33.33%; height: 6px; }
        .strip-yellow { background-color: #facc15; width: 33.33%; height: 6px; }
        .strip-red { background-color: #dc2626; width: 33.33%; height: 6px; }
        .content { padding: 40px 32px; }
        .logo-text { font-size: 24px; font-weight: 800; color: #1e3a8a; margin-bottom: 4px; letter-spacing: -0.5px; text-align: center; }
        .logo-sub { font-size: 14px; font-weight: 600; color: #dc2626; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 24px; text-align: center; }
        h1 { color: #0f172a; font-size: 22px; font-weight: 700; margin-bottom: 8px; margin-top: 0; text-align: center; }
        .greeting { font-size: 16px; line-height: 1.6; margin-bottom: 24px; color: #475569; text-align: center; }
        .info-card { background: #f0f9ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .card-title { font-size: 14px; font-weight: 700; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
        .info-row { display: flex; margin-bottom: 10px; }
        .info-label { font-weight: 600; color: #1e3a8a; min-width: 100px; }
        .info-value { color: #334155; flex: 1; }
        .qr-section { background: #fffbeb; border: 2px solid #fcd34d; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center; }
        .qr-title { font-weight: 700; color: #92400e; margin-bottom: 12px; font-size: 14px; }
        .qr-image { max-width: 180px; height: auto; display: inline-block; border-radius: 8px; }
        .guidelines { background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: left; }
        .guidelines-title { font-weight: 700; color: #92400e; margin-bottom: 12px; }
        .guidelines-list { list-style: none; padding: 0; margin: 0; }
        .guidelines-list li { margin-bottom: 8px; font-size: 14px; color: #78350f; padding-left: 24px; position: relative; }
        .guidelines-list li:before { content: "✓"; position: absolute; left: 0; font-weight: bold; color: #dc2626; }
        .divider { height: 1px; background-color: #e2e8f0; margin: 24px 0; }
        .footer { font-size: 12px; color: #94a3b8; line-height: 1.5; text-align: center; }
        .email-note { background: #dbeafe; border: 1px solid #93c5fd; border-radius: 6px; padding: 12px; margin: 16px 0; font-size: 13px; color: #1e40af; }
    </style>
</head>
<body>
    <div style="padding: 40px 16px;">
        <div class="container">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="height:6px;">
                <tr>
                    <td style="background-color: #1d4ed8; width: 33%; height: 6px;"></td>
                    <td style="background-color: #facc15; width: 34%; height: 6px;"></td>
                    <td style="background-color: #dc2626; width: 33%; height: 6px;"></td>
                </tr>
            </table>

            <div class="content">
                <div class="logo-text">PCMC</div>
                <div class="logo-sub">Christmas Incentives</div>
                
                <h1>Registration Confirmed! 🎉</h1>
                <p class="greeting">Hello ${data.employeeName},</p>
                <p style="text-align: center; color: #475569; margin-bottom: 24px;">
                    Your registration has been successfully processed. Your QR code is attached to this email and will be needed when claiming your package.
                </p>

                <!-- Package Information -->
                <div class="info-card">
                    <div class="card-title">📦 Package Details</div>
                    <div class="info-row">
                        <div class="info-label">Package:</div>
                        <div class="info-value"><strong>${
                          data.packageName
                        }</strong></div>
                    </div>
                    ${
                      data.packageDescription
                        ? `<div class="info-row">
                        <div class="info-label">Description:</div>
                        <div class="info-value">${data.packageDescription}</div>
                    </div>`
                        : ''
                    }
                </div>

                <!-- Store Information -->
                <div class="info-card">
                    <div class="card-title">🏪 Pickup Location</div>
                    <div class="info-row">
                        <div class="info-label">Store:</div>
                        <div class="info-value"><strong>${
                          data.storeName
                        }</strong></div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Address:</div>
                        <div class="info-value">${data.storeAddress}</div>
                    </div>
                    ${
                      data.storeContactNumber
                        ? `<div class="info-row">
                        <div class="info-label">Contact:</div>
                        <div class="info-value">${data.storeContactNumber}</div>
                    </div>`
                        : ''
                    }
                </div>

                <!-- Event Information -->
                ${
                  data.eventName
                    ? `<div class="info-card">
                    <div class="card-title">📅 Event Details</div>
                    <div class="info-row">
                        <div class="info-label">Event:</div>
                        <div class="info-value"><strong>${
                          data.eventName
                        }</strong></div>
                    </div>
                    ${
                      data.redemptionDate
                        ? `<div class="info-row">
                        <div class="info-label">Redemption Date:</div>
                        <div class="info-value">${data.redemptionDate}</div>
                    </div>`
                        : ''
                    }
                </div>`
                    : ''
                }

                <!-- QR Code Section -->
                <div class="qr-section">
                    <div class="qr-title">Your Digital Claim Voucher</div>
                    <p style="font-size: 13px; color: #92400e; margin-bottom: 12px;">
                        Please save and present this QR code when claiming your package
                    </p>
                    <img src="cid:appointment_qr_code" alt="QR Code" class="qr-image" />
                </div>

                <!-- Guidelines -->
                <div class="guidelines">
                    <div class="guidelines-title">📋 Claiming Guidelines</div>
                    <ul class="guidelines-list">
                        <li>Valid ID (Employee ID) is required upon claiming</li>
                        <li>Strictly <strong>NO QR CODE, NO CLAIM</strong> policy</li>
                        <li>Claiming period must be strictly followed</li>
                        <li>Present this email or the QR code to the store admin</li>
                    </ul>
                </div>

                <!-- Email Confirmation Note -->
                <div class="email-note">
                    ℹ️ This email serves as your registration confirmation. Please keep it for your records.
                </div>

                <div class="divider"></div>

                <div class="footer">
                    This is an automated message from the <strong>${APP_NAME}</strong>.<br/>
                    Philippine Children's Medical Center<br/>
                    Quezon Ave, Quezon City, Metro Manila<br/>
                    <br/>
                    If you have any questions, please contact the store admin at the location above.
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;

export interface RedemptionEmailData {
  employeeName: string;
  packageName: string;
  packageDescription?: string | null;
  storeName: string;
  storeAddress: string;
  storeContactNumber?: string | null;
  redemptionDate: string;
  redemptionTime: string;
}

export const buildPCMCRedemptionConfirmationEmailHtml = (
  APP_NAME: string,
  data: RedemptionEmailData,
) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Package Redemption Confirmed</title>
    <style>
        body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f1f5f9; color: #334155; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .header-strip { height: 6px; width: 100%; display: flex; }
        .strip-blue { background-color: #1d4ed8; width: 33.33%; height: 6px; }
        .strip-yellow { background-color: #facc15; width: 33.33%; height: 6px; }
        .strip-red { background-color: #dc2626; width: 33.33%; height: 6px; }
        .content { padding: 40px 32px; }
        .logo-text { font-size: 24px; font-weight: 800; color: #1e3a8a; margin-bottom: 4px; letter-spacing: -0.5px; text-align: center; }
        .logo-sub { font-size: 14px; font-weight: 600; color: #dc2626; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 24px; text-align: center; }
        h1 { color: #0f172a; font-size: 22px; font-weight: 700; margin-bottom: 8px; margin-top: 0; text-align: center; }
        .greeting { font-size: 16px; line-height: 1.6; margin-bottom: 24px; color: #475569; text-align: center; }
        .success-badge { background: #dcfce7; border: 2px solid #22c55e; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: center; }
        .success-badge-text { color: #166534; font-weight: 700; font-size: 16px; }
        .info-card { background: #f0f9ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .card-title { font-size: 14px; font-weight: 700; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
        .info-row { display: flex; margin-bottom: 10px; }
        .info-label { font-weight: 600; color: #1e3a8a; min-width: 100px; }
        .info-value { color: #334155; flex: 1; }
        .divider { height: 1px; background-color: #e2e8f0; margin: 24px 0; }
        .footer { font-size: 12px; color: #94a3b8; line-height: 1.5; text-align: center; }
        .thank-you-note { background: #fef3c7; border: 1px solid #fcd34d; border-radius: 6px; padding: 12px; margin: 16px 0; font-size: 13px; color: #92400e; }
    </style>
</head>
<body>
    <div style="padding: 40px 16px;">
        <div class="container">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="height:6px;">
                <tr>
                    <td style="background-color: #1d4ed8; width: 33%; height: 6px;"></td>
                    <td style="background-color: #facc15; width: 34%; height: 6px;"></td>
                    <td style="background-color: #dc2626; width: 33%; height: 6px;"></td>
                </tr>
            </table>

            <div class="content">
                <div class="logo-text">PCMC</div>
                <div class="logo-sub">Christmas Incentives</div>
                
                <h1>Package Redeemed! ✅</h1>
                <p class="greeting">Hello ${data.employeeName},</p>
                <p style="text-align: center; color: #475569; margin-bottom: 24px;">
                    Your package has been successfully redeemed on <strong>${
                      data.redemptionDate
                    }</strong> at <strong>${data.redemptionTime}</strong>.
                </p>

                <!-- Success Badge -->
                <div class="success-badge">
                    <div class="success-badge-text">✓ Redemption Confirmed</div>
                </div>

                <!-- Package Information -->
                <div class="info-card">
                    <div class="card-title">📦 Package Details</div>
                    <div class="info-row">
                        <div class="info-label">Package:</div>
                        <div class="info-value"><strong>${
                          data.packageName
                        }</strong></div>
                    </div>
                    ${
                      data.packageDescription
                        ? `<div class="info-row">
                        <div class="info-label">Description:</div>
                        <div class="info-value">${data.packageDescription}</div>
                    </div>`
                        : ''
                    }
                </div>

                <!-- Store Information -->
                <div class="info-card">
                    <div class="card-title">🏪 Redemption Location</div>
                    <div class="info-row">
                        <div class="info-label">Store:</div>
                        <div class="info-value"><strong>${
                          data.storeName
                        }</strong></div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Address:</div>
                        <div class="info-value">${data.storeAddress}</div>
                    </div>
                    ${
                      data.storeContactNumber
                        ? `<div class="info-row">
                        <div class="info-label">Contact:</div>
                        <div class="info-value">${data.storeContactNumber}</div>
                    </div>`
                        : ''
                    }
                </div>

                <!-- Thank You Note -->
                <div class="thank-you-note">
                    Thank you for participating in the PCMC Christmas Incentives program. We hope you enjoy your package!
                </div>

                <div class="divider"></div>

                <div class="footer">
                    This is an automated message from the <strong>${APP_NAME}</strong>.<br/>
                    Philippine Children's Medical Center<br/>
                    Quezon Ave, Quezon City, Metro Manila<br/>
                    <br/>
                    If you have any questions, please contact the store admin.
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;

export const buildStoreRedemptionNotificationEmailHtml = (
  APP_NAME: string,
  data: RedemptionEmailData & { employeeId: string },
) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Package Redemption Notification</title>
    <style>
        body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f1f5f9; color: #334155; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .header-strip { height: 6px; width: 100%; display: flex; }
        .strip-blue { background-color: #1d4ed8; width: 33.33%; height: 6px; }
        .strip-yellow { background-color: #facc15; width: 33.33%; height: 6px; }
        .strip-red { background-color: #dc2626; width: 33.33%; height: 6px; }
        .content { padding: 40px 32px; }
        .logo-text { font-size: 24px; font-weight: 800; color: #1e3a8a; margin-bottom: 4px; letter-spacing: -0.5px; text-align: center; }
        .logo-sub { font-size: 14px; font-weight: 600; color: #dc2626; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 24px; text-align: center; }
        h1 { color: #0f172a; font-size: 22px; font-weight: 700; margin-bottom: 8px; margin-top: 0; text-align: center; }
        .greeting { font-size: 16px; line-height: 1.6; margin-bottom: 24px; color: #475569; text-align: center; }
        .info-card { background: #f0f9ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .card-title { font-size: 14px; font-weight: 700; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
        .info-row { display: flex; margin-bottom: 10px; }
        .info-label { font-weight: 600; color: #1e3a8a; min-width: 120px; }
        .info-value { color: #334155; flex: 1; }
        .divider { height: 1px; background-color: #e2e8f0; margin: 24px 0; }
        .footer { font-size: 12px; color: #94a3b8; line-height: 1.5; text-align: center; }
        .notification-badge { background: #dbeafe; border: 1px solid #93c5fd; border-radius: 6px; padding: 12px; margin: 16px 0; font-size: 13px; color: #1e40af; }
    </style>
</head>
<body>
    <div style="padding: 40px 16px;">
        <div class="container">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="height:6px;">
                <tr>
                    <td style="background-color: #1d4ed8; width: 33%; height: 6px;"></td>
                    <td style="background-color: #facc15; width: 34%; height: 6px;"></td>
                    <td style="background-color: #dc2626; width: 33%; height: 6px;"></td>
                </tr>
            </table>

            <div class="content">
                <div class="logo-text">PCMC</div>
                <div class="logo-sub">Christmas Incentives</div>
                
                <h1>Package Redemption Notification 📋</h1>
                <p class="greeting">Store Admin,</p>
                <p style="text-align: center; color: #475569; margin-bottom: 24px;">
                    A package has been successfully redeemed at your store location.
                </p>

                <!-- Employee Information -->
                <div class="info-card">
                    <div class="card-title">👤 Employee Information</div>
                    <div class="info-row">
                        <div class="info-label">Employee Name:</div>
                        <div class="info-value"><strong>${
                          data.employeeName
                        }</strong></div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Employee ID:</div>
                        <div class="info-value"><strong>${
                          data.employeeId
                        }</strong></div>
                    </div>
                </div>

                <!-- Package Information -->
                <div class="info-card">
                    <div class="card-title">📦 Package Details</div>
                    <div class="info-row">
                        <div class="info-label">Package:</div>
                        <div class="info-value"><strong>${
                          data.packageName
                        }</strong></div>
                    </div>
                    ${
                      data.packageDescription
                        ? `<div class="info-row">
                        <div class="info-label">Description:</div>
                        <div class="info-value">${data.packageDescription}</div>
                    </div>`
                        : ''
                    }
                </div>

                <!-- Redemption Information -->
                <div class="info-card">
                    <div class="card-title">✅ Redemption Details</div>
                    <div class="info-row">
                        <div class="info-label">Date:</div>
                        <div class="info-value"><strong>${
                          data.redemptionDate
                        }</strong></div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Time:</div>
                        <div class="info-value"><strong>${
                          data.redemptionTime
                        }</strong></div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Store:</div>
                        <div class="info-value"><strong>${
                          data.storeName
                        }</strong></div>
                    </div>
                </div>

                <!-- Notification -->
                <div class="notification-badge">
                    ℹ️ This is an automated notification. No action is required from you.
                </div>

                <div class="divider"></div>

                <div class="footer">
                    This is an automated message from the <strong>${APP_NAME}</strong>.<br/>
                    Philippine Children's Medical Center<br/>
                    Quezon Ave, Quezon City, Metro Manila
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;

export interface RemindRedemptionEmailData {
  employeeName: string;
  packageName: string;
  storeName: string;
  redemptionStart: string;
  redemptionEnd: string;
  eventName: string;
}

export const buildRemindRedemptionEmailHtml = (
  APP_NAME: string,
  data: RemindRedemptionEmailData,
) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redemption Reminder</title>
    <style>
        body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f1f5f9; color: #334155; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .header-strip { height: 6px; width: 100%; display: flex; }
        .strip-blue { background-color: #1d4ed8; width: 33.33%; height: 6px; }
        .strip-yellow { background-color: #facc15; width: 33.33%; height: 6px; }
        .strip-red { background-color: #dc2626; width: 33.33%; height: 6px; }
        .content { padding: 40px 32px; }
        .logo-text { font-size: 24px; font-weight: 800; color: #1e3a8a; margin-bottom: 4px; letter-spacing: -0.5px; text-align: center; }
        .logo-sub { font-size: 14px; font-weight: 600; color: #dc2626; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 24px; text-align: center; }
        h1 { color: #0f172a; font-size: 22px; font-weight: 700; margin-bottom: 8px; margin-top: 0; text-align: center; }
        .greeting { font-size: 16px; line-height: 1.6; margin-bottom: 24px; color: #475569; text-align: center; }
        .warning-badge { background: #fef3c7; border: 2px solid #fcd34d; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: center; }
        .warning-badge-text { color: #92400e; font-weight: 700; font-size: 16px; }
        .info-card { background: #f0f9ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .card-title { font-size: 14px; font-weight: 700; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
        .info-row { display: flex; margin-bottom: 10px; }
        .info-label { font-weight: 600; color: #1e3a8a; min-width: 100px; }
        .info-value { color: #334155; flex: 1; }
        .divider { height: 1px; background-color: #e2e8f0; margin: 24px 0; }
        .footer { font-size: 12px; color: #94a3b8; line-height: 1.5; text-align: center; }
        .urgency-note { background: #fee2e2; border: 1px solid #fecaca; border-radius: 6px; padding: 12px; margin: 16px 0; font-size: 13px; color: #991b1b; }
    </style>
</head>
<body>
    <div style="padding: 40px 16px;">
        <div class="container">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="height:6px;">
                <tr>
                    <td style="background-color: #1d4ed8; width: 33%; height: 6px;"></td>
                    <td style="background-color: #facc15; width: 34%; height: 6px;"></td>
                    <td style="background-color: #dc2626; width: 33%; height: 6px;"></td>
                </tr>
            </table>

            <div class="content">
                <div class="logo-text">PCMC</div>
                <div class="logo-sub">Christmas Incentives</div>
                
                <h1>⏰ Redemption Reminder</h1>
                <p class="greeting">Hello ${data.employeeName},</p>
                <p style="text-align: center; color: #475569; margin-bottom: 24px;">
                    This is a friendly reminder that you have a package waiting to be redeemed!
                </p>

                <!-- Warning Badge -->
                <div class="warning-badge">
                    <div class="warning-badge-text">⚠️ Don't miss the redemption deadline!</div>
                </div>

                <!-- Package Information -->
                <div class="info-card">
                    <div class="card-title">📦 Your Package</div>
                    <div class="info-row">
                        <div class="info-label">Package:</div>
                        <div class="info-value"><strong>${data.packageName}</strong></div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Event:</div>
                        <div class="info-value"><strong>${data.eventName}</strong></div>
                    </div>
                </div>

                <!-- Redemption Details -->
                <div class="info-card">
                    <div class="card-title">🏪 Redemption Details</div>
                    <div class="info-row">
                        <div class="info-label">Store:</div>
                        <div class="info-value"><strong>${data.storeName}</strong></div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Period:</div>
                        <div class="info-value"><strong>${data.redemptionStart} to ${data.redemptionEnd}</strong></div>
                    </div>
                </div>

                <!-- Urgency Note -->
                <div class="urgency-note">
                    ⏱️ The redemption period is limited. Please visit the store and redeem your package before the deadline to avoid missing out!
                </div>

                <div class="divider"></div>

                <div class="footer">
                    This is an automated reminder from the <strong>${APP_NAME}</strong>.<br/>
                    Philippine Children's Medical Center<br/>
                    Quezon Ave, Quezon City, Metro Manila<br/>
                    <br/>
                    If you have any questions, please contact the store admin.
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
