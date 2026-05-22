// server/src/services/verification.service.js
import axios from 'axios';

// For ID verification - You'll need to sign up for a service like:
// - SmileID (African-focused)
// - YouVerify
// - IdentityPass
// - Dojah

class VerificationService {
  constructor() {
    // Configure your verification provider
    this.apiKey = process.env.VERIFICATION_API_KEY;
    this.apiUrl = process.env.VERIFICATION_API_URL || 'https://api.youverify.co/v2';
  }

  // Verify Driver's License
  async verifyDriverLicense(licenseNumber, dob) {
    try {
      const response = await axios.post(`${this.apiUrl}/identity/ng/drivers-license`, {
        number: licenseNumber,
        date_of_birth: dob
      }, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      });
      
      return {
        verified: response.data.status === 'success',
        data: response.data.data,
        confidence: response.data.confidence
      };
    } catch (error) {
      console.error('License verification failed:', error);
      return { verified: false, error: error.message };
    }
  }

  // Liveness Detection (face matching)
  async verifyLiveness(selfieImage, idPhoto) {
    try {
      // Using Face++ or similar service
      const formData = new FormData();
      formData.append('image_base64_1', selfieImage);
      formData.append('image_base64_2', idPhoto);
      
      const response = await axios.post('https://api-us.faceplusplus.com/facepp/v3/compare', formData, {
        params: {
          api_key: process.env.FACEPLUS_API_KEY,
          api_secret: process.env.FACEPLUS_API_SECRET
        }
      });
      
      const confidence = response.data.confidence;
      const verified = confidence > 75; // 75% threshold
      
      return {
        verified,
        confidence,
        faceMatching: response.data
      };
    } catch (error) {
      console.error('Liveness verification failed:', error);
      return { verified: false, error: error.message };
    }
  }

  // Utility Bill Verification (address validation)
  async verifyUtilityBill(billImage, address) {
    try {
      // Using OCR to extract address from bill
      const formData = new FormData();
      formData.append('image_base64', billImage);
      formData.append('type', 'nepa_bill');
      
      const response = await axios.post('https://api.ocr.space/parse/image', formData);
      
      const extractedAddress = this.extractAddressFromOCR(response.data);
      const verified = this.compareAddresses(extractedAddress, address);
      
      return {
        verified,
        extractedAddress,
        confidence: response.data.OCRExitCode === 1 ? 0.9 : 0.5
      };
    } catch (error) {
      console.error('Utility bill verification failed:', error);
      return { verified: false, error: error.message };
    }
  }

  extractAddressFromOCR(ocrData) {
    // Parse OCR result to extract address
    // This is a simplified version - implement based on your OCR service
    const text = ocrData.ParsedResults?.[0]?.ParsedText || '';
    const addressMatch = text.match(/\d+\s+[\w\s]+(Street|Road|Avenue|Drive|Lane|Close)/i);
    return addressMatch ? addressMatch[0] : '';
  }

  compareAddresses(extracted, provided) {
    if (!extracted || !provided) return false;
    // Simple similarity check - implement better matching as needed
    const normalizedExtracted = extracted.toLowerCase().trim();
    const normalizedProvided = provided.toLowerCase().trim();
    return normalizedExtracted.includes(normalizedProvided) || 
           normalizedProvided.includes(normalizedExtracted);
  }
}

export default new VerificationService();