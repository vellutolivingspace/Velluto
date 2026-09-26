# Velluto Living Space - Google Sheets & Email Setup Guide

Follow these 4 simple steps to connect the website Inquiry Form to your Google Sheet and receive email notifications at **info@vellutolivingspace.com** for every new inquiry.

---

### Step 1: Create a Google Sheet
1. Open [Google Sheets](https://sheets.new) and create a new blank spreadsheet.
2. Name it: **"Velluto Living Space - Inquiries"**.

---

### Step 2: Add Google Apps Script
1. In the Google Sheets top menu bar, click: **Extensions &rarr; Apps Script**.
2. A new tab will open with a code editor (`Code.gs`).
3. Delete any default code in the editor.
4. Copy the entire contents of [`google-apps-script/Code.gs`](file:///d:/VellutoLivingSpace/google-apps-script/Code.gs) and paste it into the editor.
5. Click the **Save** icon (disk icon or `Ctrl+S`).

---

### Step 3: Deploy as a Web App
1. In the top-right corner of the Apps Script window, click the blue **Deploy** button &rarr; **New deployment**.
2. Click the **Gear icon (⚙️)** next to *Select type* and select **Web app**.
3. Fill in the deployment settings:
   - **Description**: `Velluto Inquiry Webhook`
   - **Execute as**: `Me (your google account)`
   - **Who has access**: `Anyone` *(Crucial: This allows form submissions from the website)*
4. Click **Deploy**.
5. Google will ask you to *Authorize Access*:
   - Click **Authorize Access** &rarr; select your Google account.
   - If you see *"Google hasn't verified this app"*, click **Advanced** &rarr; **Go to Untitled project (unsafe)** &rarr; click **Allow**.
6. Copy the generated **Web app URL** (starts with `https://script.google.com/macros/s/.../exec`).

---

### Step 4: Add URL to Website
1. Open the [`.env`](file:///d:/VellutoLivingSpace/.env) file in your project root.
2. Paste the copied URL:
   ```env
   VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```
3. Save the file. Vite will automatically reload, and your website inquiry form is now live!

---

### What happens on each submission:
- **New Row in Google Sheet**: A new row is automatically appended with `Timestamp`, `Full Name`, `Mobile Number`, `Email`, `Role`, `Requirement`, and `Notes`.
- **Instant Email Notification**: An HTML email with the client's information and direct WhatsApp/call links is automatically sent to **info@vellutolivingspace.com**.
