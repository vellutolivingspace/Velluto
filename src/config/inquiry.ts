/**
 * Velluto Living Space - Inquiry Configuration & Service
 * 
 * To connect your Google Sheet & email notification:
 * 1. Follow the quick guide in google-apps-script/Code.gs
 * 2. Set your deployed Web App URL in your .env file:
 *    VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/.../exec
 */

export const INQUIRY_CONFIG = {
  // Google Apps Script Web App endpoint URL
  googleScriptUrl: (import.meta.env.VITE_GOOGLE_SCRIPT_URL as string) || '',
  notificationEmail: 'info@vellutolivingspace.com',
  directPhone: '+919213518005',
};

export interface InquiryPayload {
  name: string;
  phone: string;
  email?: string;
  role: string;
  requirement: string;
  message?: string;
}

/**
 * Submits the inquiry directly to the Google Apps Script Web App.
 * Handles row insertion into Google Sheet and triggers email notification to info@vellutolivingspace.com.
 */
export async function submitInquiryToGoogleSheet(
  data: InquiryPayload
): Promise<{ success: boolean; simulated?: boolean; message?: string }> {
  const endpoint = INQUIRY_CONFIG.googleScriptUrl.trim();

  // If the user hasn't pasted their Web App URL yet, simulate gracefully in dev
  if (!endpoint) {
    console.info(
      '%c[Velluto Living Space]%c Google Sheet Web App URL not set yet. Please paste your deployed Web App URL into .env as VITE_GOOGLE_SCRIPT_URL. See instructions in google-apps-script/Code.gs',
      'color: #8c4c1d; font-weight: bold;',
      'color: inherit;'
    );
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      success: true,
      simulated: true,
      message: 'Demo mode: Connect your Google Sheet URL in .env to log entries live.',
    };
  }

  try {
    // Sending JSON with text/plain prevents CORS preflight blocks with Google Apps Script 302 redirects
    await fetch(endpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(data),
    });

    return { success: true, simulated: false };
  } catch (error: any) {
    console.error('Failed to submit inquiry:', error);
    throw new Error(error?.message || 'Unable to connect to inquiry server. Please call us directly.');
  }
}
