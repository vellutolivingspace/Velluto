# GoDaddy cPanel Hosting Deployment Guide for vellutolivingspace.com

This guide walks you through uploading your production build to your GoDaddy cPanel Web Hosting account to make **https://vellutolivingspace.com** live.

---

### Prerequisites
- Your ready-to-upload package: **`velluto-dist.zip`** (located in `d:\VellutoLivingSpace\velluto-dist.zip`).
- Includes:
  - Complete React 19 production bundle (minified JS & CSS)
  - 300 sequential 3D walkthrough frames
  - High-resolution brand assets
  - Pre-configured `.htaccess` file (forces HTTPS, enables 1-year browser caching for ultra-fast frame loading, and configures SPA routing).

---

### Step-by-Step Deployment Instructions

#### Step 1: Log in to GoDaddy & Open cPanel
1. Go to [godaddy.com](https://www.godaddy.com) and sign in.
2. Under **My Products**, scroll down to **Web Hosting** (or **cPanel Hosting**).
3. Click the **Manage** button next to your hosting account, then click **cPanel Admin**.

#### Step 2: Open File Manager
1. In cPanel, locate the **Files** section and click **File Manager**.
2. On the left sidebar, double-click the **`public_html`** folder.
   *(This is the root folder for your primary domain `vellutolivingspace.com`).*

#### Step 3: Clean Previous / Default Files (If Any)
- If you see default files like `default.html`, `index.php` (placeholder), you can delete them or move them into a backup folder.
- *Note: If you have existing files you want to keep, make sure not to overwrite unrelated folders.*

#### Step 4: Upload `velluto-dist.zip`
1. In the top toolbar of File Manager, click **Upload**.
2. A new tab opens. Click **Select File** and choose:
   `d:\VellutoLivingSpace\velluto-dist.zip`
3. Wait for the upload bar to reach 100% (it will turn green).
4. Click the link at the bottom: **"Go Back to /home/.../public_html"**.

#### Step 5: Extract the Zip File
1. In `public_html`, right-click on **`velluto-dist.zip`**.
2. Select **Extract** (or click the **Extract** button in the top toolbar).
3. Confirm the extraction path is `/public_html` and click **Extract Files**.
4. Once extraction finishes, click **Close**.
5. You can now delete `velluto-dist.zip` from `public_html` to save server disk space.

#### Step 6: Verify SSL (HTTPS)
1. In cPanel search for **SSL/TLS Status**.
2. Check that **vellutolivingspace.com** has an active SSL certificate (AutoSSL). If not, click **Run AutoSSL**.

---

### Done! 🎉
Visit **[https://vellutolivingspace.com](https://vellutolivingspace.com)** in your browser!
