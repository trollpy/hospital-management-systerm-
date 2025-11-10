// SMS service for sending text message notifications

interface SMSOptions {
  to: string
  message: string
  from?: string
  template?: string
  data?: Record<string, any>
}

interface SMSProvider {
  name: string
  send: (options: SMSOptions) => Promise<boolean>
}

/**
 * SMS service for sending text message notifications
 */
export class SMSService {
  private static instance: SMSService
  private enabled: boolean = true
  private provider: SMSProvider

  private constructor() {
    this.enabled = !!process.env.SMS_SERVICE_ENABLED
    this.provider = this.initializeProvider()
  }

  public static getInstance(): SMSService {
    if (!SMSService.instance) {
      SMSService.instance = new SMSService()
    }
    return SMSService.instance
  }

  /**
   * Initialize SMS provider based on configuration
   */
  private initializeProvider(): SMSProvider {
    const providerName = process.env.SMS_PROVIDER || 'twilio'

    switch (providerName.toLowerCase()) {
      case 'twilio':
        return this.createTwilioProvider()
      case 'africastalking':
        return this.createAfricaTalkingProvider()
      case 'aws_sns':
        return this.createAWSSNSProvider()
      default:
        return this.createMockProvider()
    }
  }

  /**
   * Create Twilio SMS provider
   */
  private createTwilioProvider(): SMSProvider {
    return {
      name: 'twilio',
      send: async (options: SMSOptions): Promise<boolean> => {
        try {
          // This would use the Twilio SDK
          // const client = require('twilio')(accountSid, authToken);
          
          // const message = await client.messages.create({
          //   body: options.message,
          //   from: options.from || process.env.TWILIO_PHONE_NUMBER,
          //   to: options.to
          // });

          // return message.sid !== undefined;

          // Mock implementation for development
          console.log('Twilio SMS sent:', {
            to: options.to,
            message: options.message,
            from: options.from,
          })

          await new Promise(resolve => setTimeout(resolve, 500))
          return true
        } catch (error) {
          console.error('Twilio SMS error:', error)
          return false
        }
      },
    }
  }

  /**
   * Create Africa's Talking SMS provider
   */
  private createAfricaTalkingProvider(): SMSProvider {
    return {
      name: 'africastalking',
      send: async (options: SMSOptions): Promise<boolean> => {
        try {
          // This would use the Africa's Talking SDK
          // const AfricaTalking = require('africastalking');
          
          // const africastalking = AfricaTalking({
          //   apiKey: process.env.AFRICASTALKING_API_KEY,
          //   username: process.env.AFRICASTALKING_USERNAME
          // });

          // const result = await africastalking.SMS.send({
          //   to: options.to,
          //   message: options.message,
          //   from: options.from
          // });

          // return result.SMSMessageData.Recipients[0].status === 'Success';

          // Mock implementation
          console.log('Africa\'s Talking SMS sent:', {
            to: options.to,
            message: options.message,
            from: options.from,
          })

          await new Promise(resolve => setTimeout(resolve, 500))
          return true
        } catch (error) {
          console.error('Africa\'s Talking SMS error:', error)
          return false
        }
      },
    }
  }

  /**
   * Create AWS SNS SMS provider
   */
  private createAWSSNSProvider(): SMSProvider {
    return {
      name: 'aws_sns',
      send: async (options: SMSOptions): Promise<boolean> => {
        try {
          // This would use AWS SDK for SNS
          // const AWS = require('aws-sdk');
          // const sns = new AWS.SNS();
          
          // const params = {
          //   Message: options.message,
          //   PhoneNumber: options.to
          // };

          // const result = await sns.publish(params).promise();
          // return result.MessageId !== undefined;

          // Mock implementation
          console.log('AWS SNS SMS sent:', {
            to: options.to,
            message: options.message,
          })

          await new Promise(resolve => setTimeout(resolve, 500))
          return true
        } catch (error) {
          console.error('AWS SNS SMS error:', error)
          return false
        }
      },
    }
  }

  /**
   * Create mock provider for development
   */
  private createMockProvider(): SMSProvider {
    return {
      name: 'mock',
      send: async (options: SMSOptions): Promise<boolean> => {
        console.log('Mock SMS sent:', {
          to: options.to,
          message: options.message,
          from: options.from,
        })

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 300))
        return true
      },
    }
  }

  /**
   * Send an SMS
   */
  public async sendSMS(options: SMSOptions): Promise<boolean> {
    if (!this.enabled) {
      console.log('SMS service is disabled. Would send SMS:', options)
      return true
    }

    // Validate phone number
    if (!this.isValidPhoneNumber(options.to)) {
      console.error('Invalid phone number:', options.to)
      return false
    }

    // Validate message length
    if (options.message.length > 160) {
      console.warn('SMS message exceeds 160 characters, may be split into multiple messages')
    }

    try {
      return await this.provider.send(options)
    } catch (error) {
      console.error('SMS sending error:', error)
      return false
    }
  }

  /**
   * Validate phone number format
   */
  private isValidPhoneNumber(phoneNumber: string): boolean {
    // Basic international phone number validation
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    return phoneRegex.test(phoneNumber.replace(/\s/g, ''))
  }

  /**
   * Format phone number to E.164 format
   */
  public formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters except leading +
    let formatted = phoneNumber.replace(/[^\d+]/g, '')

    // If no country code, assume US and add +1
    if (!formatted.startsWith('+')) {
      // Remove leading 1 if present (US numbers)
      if (formatted.startsWith('1')) {
        formatted = formatted.substring(1)
      }
      formatted = '+1' + formatted
    }

    return formatted
  }

  /**
   * Send appointment reminder SMS
   */
  public async sendAppointmentReminder(
    phoneNumber: string,
    patientName: string,
    appointmentDate: string,
    appointmentTime: string,
    providerName: string,
    location: string
  ): Promise<boolean> {
    const message = `Hi ${patientName}, this is a reminder for your appointment with ${providerName} on ${appointmentDate} at ${appointmentTime}. Location: ${location}. Please arrive 15 mins early. Reply STOP to unsubscribe.`

    return this.sendSMS({
      to: this.formatPhoneNumber(phoneNumber),
      message,
      template: 'appointment_reminder',
      data: {
        patientName,
        appointmentDate,
        appointmentTime,
        providerName,
        location,
      },
    })
  }

  /**
   * Send lab results notification SMS
   */
  public async sendLabResultsNotification(
    phoneNumber: string,
    patientName: string
  ): Promise<boolean> {
    const message = `Hi ${patientName}, your lab results are ready. Please check your patient portal or contact your healthcare provider. Reply STOP to unsubscribe.`

    return this.sendSMS({
      to: this.formatPhoneNumber(phoneNumber),
      message,
      template: 'lab_results_ready',
      data: { patientName },
    })
  }

  /**
   * Send prescription ready notification SMS
   */
  public async sendPrescriptionReady(
    phoneNumber: string,
    patientName: string,
    medicationName: string
  ): Promise<boolean> {
    const message = `Hi ${patientName}, your prescription for ${medicationName} is ready for pickup at our pharmacy. Pharmacy hours: Mon-Fri 8AM-6PM. Reply STOP to unsubscribe.`

    return this.sendSMS({
      to: this.formatPhoneNumber(phoneNumber),
      message,
      template: 'prescription_ready',
      data: { patientName, medicationName },
    })
  }

  /**
   * Send payment reminder SMS
   */
  public async sendPaymentReminder(
    phoneNumber: string,
    patientName: string,
    amount: number,
    dueDate: string
  ): Promise<boolean> {
    const message = `Hi ${patientName}, friendly reminder that your payment of $${amount} is due on ${dueDate}. You can pay online or visit our billing department. Reply STOP to unsubscribe.`

    return this.sendSMS({
      to: this.formatPhoneNumber(phoneNumber),
      message,
      template: 'payment_reminder',
      data: { patientName, amount, dueDate },
    })
  }

  /**
   * Send emergency alert SMS
   */
  public async sendEmergencyAlert(
    phoneNumber: string,
    message: string
  ): Promise<boolean> {
    return this.sendSMS({
      to: this.formatPhoneNumber(phoneNumber),
      message: `URGENT: ${message}`,
      template: 'emergency_alert',
    })
  }

  /**
   * Check if SMS service is available
   */
  public isAvailable(): boolean {
    return this.enabled && this.provider.name !== 'mock'
  }

  /**
   * Get SMS provider information
   */
  public getProviderInfo(): { name: string; status: string } {
    return {
      name: this.provider.name,
      status: this.enabled ? 'active' : 'disabled',
    }
  }

  /**
   * Get SMS sending statistics (mock implementation)
   */
  public async getStatistics(): Promise<{
    totalSent: number
    successful: number
    failed: number
    last30Days: number
  }> {
    // This would typically query your database or provider API
    return {
      totalSent: 0,
      successful: 0,
      failed: 0,
      last30Days: 0,
    }
  }
}

// Export singleton instance
export const smsService = SMSService.getInstance()

/**
 * React hook for SMS service
 */
export function useSMS() {
  const sendSMS = async (options: SMSOptions) => {
    return smsService.sendSMS(options)
  }

  const sendAppointmentReminder = async (
    phoneNumber: string,
    patientName: string,
    appointmentDate: string,
    appointmentTime: string,
    providerName: string,
    location: string
  ) => {
    return smsService.sendAppointmentReminder(
      phoneNumber,
      patientName,
      appointmentDate,
      appointmentTime,
      providerName,
      location
    )
  }

  const sendLabResultsNotification = async (phoneNumber: string, patientName: string) => {
    return smsService.sendLabResultsNotification(phoneNumber, patientName)
  }

  const sendPrescriptionReady = async (
    phoneNumber: string,
    patientName: string,
    medicationName: string
  ) => {
    return smsService.sendPrescriptionReady(phoneNumber, patientName, medicationName)
  }

  const sendPaymentReminder = async (
    phoneNumber: string,
    patientName: string,
    amount: number,
    dueDate: string
  ) => {
    return smsService.sendPaymentReminder(phoneNumber, patientName, amount, dueDate)
  }

  const sendEmergencyAlert = async (phoneNumber: string, message: string) => {
    return smsService.sendEmergencyAlert(phoneNumber, message)
  }

  const formatPhoneNumber = (phoneNumber: string) => {
    return smsService.formatPhoneNumber(phoneNumber)
  }

  const isAvailable = () => {
    return smsService.isAvailable()
  }

  const getProviderInfo = () => {
    return smsService.getProviderInfo()
  }

  const getStatistics = async () => {
    return smsService.getStatistics()
  }

  return {
    sendSMS,
    sendAppointmentReminder,
    sendLabResultsNotification,
    sendPrescriptionReady,
    sendPaymentReminder,
    sendEmergencyAlert,
    formatPhoneNumber,
    isAvailable,
    getProviderInfo,
    getStatistics,
  }
}