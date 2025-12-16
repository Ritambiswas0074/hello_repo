import { Request, Response } from 'express';

export const getWhatsAppContact = async (req: Request, res: Response) => {
  try {
    // Indian WhatsApp number: 9477493296 (with country code +91)
    const whatsappNumber = process.env.WHATSAPP_NUMBER || '9477493296';
    const { message } = req.query;

    // Format phone number for WhatsApp (remove any non-digit characters)
    let formattedNumber = whatsappNumber.replace(/[^\d]/g, '');
    
    // If it's a 10-digit Indian number, add +91 country code
    if (formattedNumber.length === 10) {
      formattedNumber = '91' + formattedNumber; // Add country code without + for wa.me URL
    } else if (formattedNumber.startsWith('91') && formattedNumber.length === 12) {
      // Already has country code, use as is
      formattedNumber = formattedNumber;
    } else if (formattedNumber.startsWith('+91')) {
      // Remove + if present
      formattedNumber = formattedNumber.replace('+', '');
    }

    // Default message
    const defaultMessage = 'Hello! I need help with my billboard booking on FeatureMe.';
    const textMessage = message ? encodeURIComponent(message as string) : encodeURIComponent(defaultMessage);

    // Generate WhatsApp link
    const whatsappLink = `https://wa.me/${formattedNumber}?text=${textMessage}`;

    res.json({
      whatsappLink,
      phoneNumber: '+' + formattedNumber, // Return with + for display
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

