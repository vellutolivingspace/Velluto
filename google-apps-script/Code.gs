/**
 * VELLUTO LIVING SPACE - FACTORY INQUIRY WEBHOOK & NOTIFICATION SYSTEM
 * 
 * Instructions:
 * 1. Open your Google Sheet where you want inquiries stored.
 * 2. In Google Sheets top menu, click: Extensions > Apps Script.
 * 3. Delete any default code in Code.gs, paste this entire file, and click Save (disk icon).
 * 4. In the top right, click: Deploy > New deployment.
 * 5. Click the gear icon next to "Select type", and choose: "Web app".
 * 6. Set Description: "Velluto Inquiry Form Webhook"
 * 7. Set "Execute as": "Me (your email)"
 * 8. Set "Who has access": "Anyone" (CRITICAL: this allows your website form to submit entries)
 * 9. Click "Deploy", review/grant permissions when prompted.
 * 10. Copy the "Web app URL" (starts with https://script.google.com/macros/s/...)
 * 11. Paste that URL into your .env file as VITE_GOOGLE_SCRIPT_URL=your_url_here
 */

// Target email for notifications
const NOTIFICATION_EMAIL = 'info@vellutolivingspace.com';
const SHEET_TAB_NAME = 'Inquiries';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const sheetApp = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = sheetApp.getSheetByName(SHEET_TAB_NAME);

    // If sheet tab does not exist, create it
    if (!sheet) {
      sheet = sheetApp.insertSheet(SHEET_TAB_NAME);
    }

    // Initialize header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Timestamp',
        'Full Name',
        'Mobile Number',
        'Email Address',
        'Role / Profession',
        'Requirement',
        'Notes / Message'
      ];
      sheet.appendRow(headers);
      
      // Style header row
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#38271e');
      headerRange.setFontColor('#ffffff');
      headerRange.setFontWeight('bold');
      headerRange.setHorizontalAlignment('center');
      sheet.setFrozenRows(1);
    }

    // Parse payload safely from JSON or form post
    let data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    const timestamp = new Date();
    const formattedDate = Utilities.formatDate(timestamp, 'Asia/Kolkata', 'dd MMM yyyy, hh:mm:ss a') + ' IST';
    
    const name = data.name || 'Anonymous';
    const phone = data.phone || 'N/A';
    const email = data.email || 'N/A';
    const role = data.role || 'Homeowner';
    const requirement = data.requirement || 'General Inquiry';
    const message = data.message || 'N/A';

    // Append new entry row
    sheet.appendRow([
      formattedDate,
      name,
      phone,
      email,
      role,
      requirement,
      message
    ]);

    // Send email notification to info@vellutolivingspace.com
    sendEmailNotification({
      date: formattedDate,
      name: name,
      phone: phone,
      email: email,
      role: role,
      requirement: requirement,
      message: message,
      sheetUrl: sheetApp.getUrl()
    });

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Inquiry stored and notification sent successfully',
      row: sheet.getLastRow()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'active',
    service: 'Velluto Living Space Inquiry Webhook',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

function sendEmailNotification(inquiry) {
  const subject = `🔔 New Factory Inquiry: ${inquiry.name} (${inquiry.requirement})`;
  
  const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f3ee; margin: 0; padding: 24px; color: #2e2017; }
          .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #decbb8; box-shadow: 0 4px 20px rgba(80, 50, 20, 0.08); overflow: hidden; }
          .header { background: linear-gradient(135deg, #743e1d 0%, #9c5525 100%); color: #ffffff; padding: 28px 24px; text-align: center; }
          .header h1 { margin: 0; font-size: 20px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; }
          .header p { margin: 6px 0 0; font-size: 12px; opacity: 0.9; letter-spacing: 0.08em; }
          .content { padding: 28px 24px; }
          .table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          .table td { padding: 12px 14px; border-bottom: 1px solid #f0e6dc; font-size: 13px; }
          .table td.label { width: 35%; font-weight: 600; color: #8c4c1d; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; }
          .table td.value { color: #2e2017; font-weight: 500; }
          .badge { display: inline-block; padding: 4px 10px; background-color: #f5ebe1; color: #8c4c1d; border-radius: 20px; font-weight: 600; font-size: 11px; }
          .btn-container { text-align: center; margin-top: 28px; }
          .btn { display: inline-block; padding: 12px 24px; background: #8c4c1d; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 13px; letter-spacing: 0.05em; }
          .footer { background: #faf6f1; padding: 16px; text-align: center; font-size: 11px; color: #8b776a; border-top: 1px solid #ebdcd0; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1>Velluto Living Space</h1>
            <p>Direct Factory Inquiry Received</p>
          </div>
          <div class="content">
            <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.5;">
              A new customer inquiry has just been submitted via the website:
            </p>
            <table class="table">
              <tr>
                <td class="label">Date & Time</td>
                <td class="value">${inquiry.date}</td>
              </tr>
              <tr>
                <td class="label">Client Name</td>
                <td class="value" style="font-size: 14px; font-weight: 600;">${inquiry.name}</td>
              </tr>
              <tr>
                <td class="label">Mobile Number</td>
                <td class="value">
                  <a href="tel:${inquiry.phone}" style="color: #8c4c1d; text-decoration: none; font-weight: 600;">
                    ${inquiry.phone}
                  </a>
                  &nbsp;
                  <a href="https://wa.me/${inquiry.phone.replace(/[^0-9]/g, '')}" style="color: #25D366; text-decoration: none; font-size: 12px;">(WhatsApp)</a>
                </td>
              </tr>
              <tr>
                <td class="label">Email Address</td>
                <td class="value">
                  ${inquiry.email !== 'N/A' ? `<a href="mailto:${inquiry.email}" style="color: #8c4c1d; text-decoration: none;">${inquiry.email}</a>` : '<span style="color: #999;">Not Provided</span>'}
                </td>
              </tr>
              <tr>
                <td class="label">Profile / Role</td>
                <td class="value"><span class="badge">${inquiry.role}</span></td>
              </tr>
              <tr>
                <td class="label">Requirement</td>
                <td class="value"><span class="badge" style="background: #e8ded2; color: #69340e;">${inquiry.requirement}</span></td>
              </tr>
              ${inquiry.message !== 'N/A' ? `
              <tr>
                <td class="label">Notes / Drawing</td>
                <td class="value" style="line-height: 1.4;">${inquiry.message}</td>
              </tr>
              ` : ''}
            </table>

            <div class="btn-container">
              <a href="${inquiry.sheetUrl}" class="btn" target="_blank">
                Open Google Sheet Inquiries &rarr;
              </a>
            </div>
          </div>
          <div class="footer">
            Velluto Living Space &bull; Plot No. A-55, GIDC, Sector 25, Gandhinagar, Gujarat 382024
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    MailApp.sendEmail({
      to: NOTIFICATION_EMAIL,
      subject: subject,
      htmlBody: htmlBody
    });
  } catch (err) {
    Logger.log('Error sending notification email: ' + err.toString());
  }
}
