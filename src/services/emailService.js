import emailjs from '@emailjs/browser'

export const EMAILJS_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_srlljf2',
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '95Zo_Mf1Bx2xtI1m8',
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_yfonski',
  TO_EMAIL: import.meta.env.VITE_EMAILJS_TO_EMAIL || 'info@countryholidaysinnsuites.com',
}

/**
 * Send an inquiry or reservation message via EmailJS
 * @param {Object} params - Template parameters (from_name, from_email, message, etc.)
 * @param {string} [customTemplateId] - Optional template ID override
 * @returns {Promise<any>}
 */
export async function sendEmail(params, customTemplateId = null) {
  const templateId = customTemplateId || EMAILJS_CONFIG.TEMPLATE_ID

  try {
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      templateId,
      {
        to_email: EMAILJS_CONFIG.TO_EMAIL,
        to_name: 'Country Holidays Inn & Suites',
        recipient: EMAILJS_CONFIG.TO_EMAIL,
        send_to: EMAILJS_CONFIG.TO_EMAIL,
        site_name: 'Country Holidays Inn & Suites',
        submission_time: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
        ...params,
      },
      EMAILJS_CONFIG.PUBLIC_KEY
    )
    return { success: true, response }
  } catch (error) {
    console.error('EmailJS Send Error:', error)
    return {
      success: false,
      error: error?.text || error?.message || 'Failed to send message via EmailJS',
    }
  }
}
