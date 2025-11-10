// Email service for sending notifications and alerts

interface EmailOptions {
  to: string | string[]
  subject: string
  template: string
  data: Record<string, any>
  attachments?: Array<{
    filename: string
    content: Buffer | string
    contentType: string
  }>
}

interface EmailTemplate {
  subject: string
  html: string
  text: string
}

/**
 * Email service for sending notifications
 */
export class EmailService {
  private static instance: EmailService
  private enabled: boolean = true

  private constructor() {
    this.enabled = !!process.env.EMAIL_SERVICE_ENABLED
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }

  /**
   * Send an email
   */
  public async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.enabled) {
      console.log('Email service is disabled. Would send email:', options)
      return true
    }

    try {
      // This would integrate with an email service like:
      // - SendGrid
      // - AWS SES
      // - NodeMailer
      // - etc.

      const template = this.getTemplate(options.template, options.data)
      const emailData = {
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: template.subject,
        html: template.html,
        text: template.text,
        attachments: options.attachments,
      }

      // Mock implementation - replace with actual email service
      console.log('Sending email:', emailData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return true
    } catch (error) {
      console.error('Failed to send email:', error)
      return false
    }
  }

  /**
   * Get email template
   */
  private getTemplate(templateName: string, data: Record<string, any>): EmailTemplate {
    const templates: Record<string, EmailTemplate> = {
      appointment_reminder: {
        subject: `Appointment Reminder - ${data.patientName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Appointment Reminder</h2>
            <p>Dear ${data.patientName},</p>
            <p>This is a reminder for your upcoming appointment:</p>
            <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <p><strong>Date:</strong> ${data.appointmentDate}</p>
              <p><strong>Time:</strong> ${data.appointmentTime}</p>
              <p><strong>Provider:</strong> ${data.providerName}</p>
              <p><strong>Location:</strong> ${data.location}</p>
            </div>
            <p>Please arrive 15 minutes before your scheduled time.</p>
            <p>If you need to reschedule, please contact us at ${data.contactPhone}.</p>
            <br>
            <p>Best regards,<br>${data.hospitalName}</p>
          </div>
        `,
        text: `
          Appointment Reminder - ${data.patientName}
          
          Dear ${data.patientName},
          
          This is a reminder for your upcoming appointment:
          
          Date: ${data.appointmentDate}
          Time: ${data.appointmentTime}
          Provider: ${data.providerName}
          Location: ${data.location}
          
          Please arrive 15 minutes before your scheduled time.
          
          If you need to reschedule, please contact us at ${data.contactPhone}.
          
          Best regards,
          ${data.hospitalName}
        `,
      },

      lab_results_ready: {
        subject: `Lab Results Ready - ${data.patientName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #059669;">Lab Results Ready</h2>
            <p>Dear ${data.patientName},</p>
            <p>Your lab results from ${data.testDate} are now available.</p>
            <p>You can view your results by logging into your patient portal or contacting your healthcare provider.</p>
            <div style="background: #f0fdf4; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <p><strong>Tests Completed:</strong> ${data.testsCompleted}</p>
              <p><strong>Ordering Provider:</strong> ${data.providerName}</p>
            </div>
            <p>If you have any questions about your results, please contact your provider.</p>
            <br>
            <p>Best regards,<br>${data.hospitalName} Laboratory</p>
          </div>
        `,
        text: `
          Lab Results Ready - ${data.patientName}
          
          Dear ${data.patientName},
          
          Your lab results from ${data.testDate} are now available.
          
          You can view your results by logging into your patient portal or contacting your healthcare provider.
          
          Tests Completed: ${data.testsCompleted}
          Ordering Provider: ${data.providerName}
          
          If you have any questions about your results, please contact your provider.
          
          Best regards,
          ${data.hospitalName} Laboratory
        `,
      },

      prescription_ready: {
        subject: `Prescription Ready - ${data.patientName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #7c3aed;">Prescription Ready for Pickup</h2>
            <p>Dear ${data.patientName},</p>
            <p>Your prescription is ready for pickup at our pharmacy.</p>
            <div style="background: #faf5ff; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <p><strong>Medication:</strong> ${data.medicationName}</p>
              <p><strong>Quantity:</strong> ${data.quantity}</p>
              <p><strong>Instructions:</strong> ${data.instructions}</p>
              <p><strong>Prescribing Doctor:</strong> ${data.doctorName}</p>
            </div>
            <p><strong>Pharmacy Hours:</strong> ${data.pharmacyHours}</p>
            <p><strong>Location:</strong> ${data.pharmacyLocation}</p>
            <p>Please bring your ID and insurance card when picking up your medication.</p>
            <br>
            <p>Best regards,<br>${data.hospitalName} Pharmacy</p>
          </div>
        `,
        text: `
          Prescription Ready - ${data.patientName}
          
          Dear ${data.patientName},
          
          Your prescription is ready for pickup at our pharmacy.
          
          Medication: ${data.medicationName}
          Quantity: ${data.quantity}
          Instructions: ${data.instructions}
          Prescribing Doctor: ${data.doctorName}
          
          Pharmacy Hours: ${data.pharmacyHours}
          Location: ${data.pharmacyLocation}
          
          Please bring your ID and insurance card when picking up your medication.
          
          Best regards,
          ${data.hospitalName} Pharmacy
        `,
      },

      invoice_generated: {
        subject: `Invoice Generated - ${data.invoiceNumber}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Invoice Generated</h2>
            <p>Dear ${data.patientName},</p>
            <p>An invoice has been generated for your recent visit.</p>
            <div style="background: #fef2f2; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <p><strong>Invoice Number:</strong> ${data.invoiceNumber}</p>
              <p><strong>Date:</strong> ${data.invoiceDate}</p>
              <p><strong>Total Amount:</strong> $${data.totalAmount}</p>
              <p><strong>Due Date:</strong> ${data.dueDate}</p>
            </div>
            <p>You can view and pay your invoice online through the patient portal, or visit our billing department.</p>
            <p>Payment Methods: ${data.paymentMethods}</p>
            <p>If you have insurance, we have submitted a claim on your behalf.</p>
            <br>
            <p>Best regards,<br>${data.hospitalName} Billing Department</p>
          </div>
        `,
        text: `
          Invoice Generated - ${data.invoiceNumber}
          
          Dear ${data.patientName},
          
          An invoice has been generated for your recent visit.
          
          Invoice Number: ${data.invoiceNumber}
          Date: ${data.invoiceDate}
          Total Amount: $${data.totalAmount}
          Due Date: ${data.dueDate}
          
          You can view and pay your invoice online through the patient portal, or visit our billing department.
          
          Payment Methods: ${data.paymentMethods}
          
          If you have insurance, we have submitted a claim on your behalf.
          
          Best regards,
          ${data.hospitalName} Billing Department
        `,
      },
    }

    const template = templates[templateName]
    if (!template) {
      throw new Error(`Email template '${templateName}' not found`)
    }

    return template
  }

  /**
   * Send appointment reminder
   */
  public async sendAppointmentReminder(
    patientEmail: string,
    patientName: string,
    appointmentDate: string,
    appointmentTime: string,
    providerName: string,
    location: string
  ): Promise<boolean> {
    return this.sendEmail({
      to: patientEmail,
      template: 'appointment_reminder',
      subject: `Appointment Reminder - ${patientName}`,
      data: {
        patientName,
        appointmentDate,
        appointmentTime,
        providerName,
        location,
        hospitalName: 'Hospital HMS',
        contactPhone: '+1 (555) 123-4567',
      },
    })
  }

  /**
   * Send lab results notification
   */
  public async sendLabResultsNotification(
    patientEmail: string,
    patientName: string,
    testDate: string,
    testsCompleted: string,
    providerName: string
  ): Promise<boolean> {
    return this.sendEmail({
      to: patientEmail,
      template: 'lab_results_ready',
      subject: `Lab Results Ready - ${patientName}`,
      data: {
        patientName,
        testDate,
        testsCompleted,
        providerName,
        hospitalName: 'Hospital HMS',
      },
    })
  }

  /**
   * Send prescription ready notification
   */
  public async sendPrescriptionReady(
    patientEmail: string,
    patientName: string,
    medicationName: string,
    quantity: string,
    instructions: string,
    doctorName: string
  ): Promise<boolean> {
    return this.sendEmail({
      to: patientEmail,
      template: 'prescription_ready',
      subject: `Prescription Ready - ${patientName}`,
      data: {
        patientName,
        medicationName,
        quantity,
        instructions,
        doctorName,
        pharmacyHours: 'Mon-Fri 8:00 AM - 6:00 PM',
        pharmacyLocation: 'Main Hospital Building, 1st Floor',
        hospitalName: 'Hospital HMS',
      },
    })
  }

  /**
   * Send invoice notification
   */
  public async sendInvoice(
    patientEmail: string,
    patientName: string,
    invoiceNumber: string,
    invoiceDate: string,
    totalAmount: number,
    dueDate: string
  ): Promise<boolean> {
    return this.sendEmail({
      to: patientEmail,
      template: 'invoice_generated',
      subject: `Invoice Generated - ${invoiceNumber}`,
      data: {
        patientName,
        invoiceNumber,
        invoiceDate,
        totalAmount,
        dueDate,
        paymentMethods: 'Cash, Credit Card, Insurance',
        hospitalName: 'Hospital HMS',
      },
    })
  }
}

// Export singleton instance
export const emailService = EmailService.getInstance()

/**
 * React hook for email service
 */
export function useEmail() {
  const sendEmail = async (options: EmailOptions) => {
    return emailService.sendEmail(options)
  }

  const sendAppointmentReminder = async (
    patientEmail: string,
    patientName: string,
    appointmentDate: string,
    appointmentTime: string,
    providerName: string,
    location: string
  ) => {
    return emailService.sendAppointmentReminder(
      patientEmail,
      patientName,
      appointmentDate,
      appointmentTime,
      providerName,
      location
    )
  }

  const sendLabResultsNotification = async (
    patientEmail: string,
    patientName: string,
    testDate: string,
    testsCompleted: string,
    providerName: string
  ) => {
    return emailService.sendLabResultsNotification(
      patientEmail,
      patientName,
      testDate,
      testsCompleted,
      providerName
    )
  }

  const sendPrescriptionReady = async (
    patientEmail: string,
    patientName: string,
    medicationName: string,
    quantity: string,
    instructions: string,
    doctorName: string
  ) => {
    return emailService.sendPrescriptionReady(
      patientEmail,
      patientName,
      medicationName,
      quantity,
      instructions,
      doctorName
    )
  }

  const sendInvoice = async (
    patientEmail: string,
    patientName: string,
    invoiceNumber: string,
    invoiceDate: string,
    totalAmount: number,
    dueDate: string
  ) => {
    return emailService.sendInvoice(
      patientEmail,
      patientName,
      invoiceNumber,
      invoiceDate,
      totalAmount,
      dueDate
    )
  }

  return {
    sendEmail,
    sendAppointmentReminder,
    sendLabResultsNotification,
    sendPrescriptionReady,
    sendInvoice,
  }
}