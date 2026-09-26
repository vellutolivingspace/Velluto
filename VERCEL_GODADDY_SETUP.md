# Connecting vellutolivingspace.com to Vercel via GoDaddy DNS

Since you have the domain on GoDaddy with DNS management, you can host the website for **100% free** on **Vercel** with a global fast CDN and automatic free SSL.

---

### Step 1: Deploy on Vercel (2 Minutes)
1. Go to **[vercel.com/signup](https://vercel.com/signup)** and click **Continue with GitHub**.
2. Once logged in, click the **"Add New..."** button &rarr; **Project**.
3. Under *Import Git Repository*, find **`Velluto`** (or `vellutolivingspace/Velluto`) and click **Import**.
4. In the Project Configuration screen:
   - Framework Preset: **Vite** (auto-detected)
   - Expand the **Environment Variables** section and add:
     - **Name**: `VITE_GOOGLE_SCRIPT_URL`
     - **Value**: `https://script.google.com/macros/s/AKfycbwi6WryHmqWsTUJzc_V9Sv1yIoef2kVOd7D9ADT5jK9MOqRThyhILoF1rCLUbpGf454rg/exec`
5. Click **Deploy**.
6. Wait ~45 seconds while Vercel builds your site. You will see a congratulations screen with confetti!

---

### Step 2: Add Your Domain in Vercel
1. On your Vercel project dashboard, click **Settings** (top menu bar) &rarr; **Domains** (left sidebar).
2. In the input box, type:
   ```
   vellutolivingspace.com
   ```
3. Click **Add**.
4. Vercel will recommend adding both `vellutolivingspace.com` and `www.vellutolivingspace.com`. Select that recommended option.
5. Vercel will now show the exact DNS records needed for GoDaddy:
   - **Type**: `A` | **Name**: `@` | **Value**: `76.76.21.21`
   - **Type**: `CNAME` | **Name**: `www` | **Value**: `cname.vercel-dns.com`

---

### Step 3: Add the Records in GoDaddy DNS
1. Open **[godaddy.com](https://www.godaddy.com)** and sign in.
2. Go to **My Products** &rarr; find **vellutolivingspace.com** &rarr; click **DNS** (or **Manage DNS**).
3. In the **DNS Records** table:
   - Look for an existing **A** record with Name **`@`**:
     - Click the **Pencil (Edit)** icon next to it.
     - Change the **Value / Points to** to: **`76.76.21.21`**
     - TTL: `1/2 Hour` (or Default) &rarr; click **Save**.
     *(If no `A` record exists for `@`, click **Add New Record** &rarr; Type: `A`, Name: `@`, Value: `76.76.21.21`).*
   - Look for an existing **CNAME** record with Name **`www`**:
     - Click **Edit**, change **Value / Points to** to: **`cname.vercel-dns.com`**
     - Click **Save**.
     *(If it doesn't exist, click **Add New Record** &rarr; Type: `CNAME`, Name: `www`, Value: `cname.vercel-dns.com`).*

---

### Step 4: Verification
- Go back to your Vercel **Domains** tab.
- Click **Refresh**.
- Within a few minutes (usually 1 to 5 minutes), the status will turn green with a checkmark: **Valid Configuration**.
- An SSL (HTTPS) certificate will automatically be generated for free.

Your site will be live worldwide at:
👉 **[https://vellutolivingspace.com](https://vellutolivingspace.com)**
