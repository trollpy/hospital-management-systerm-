// Payment service for handling billing and payment processing

interface PaymentMethod {
  id: string
  type: 'cash' | 'card' | 'insurance' | 'mobile_money' | 'bank_transfer'
  details: Record<string, any>
  isDefault: boolean
}

interface Payment {
  id: string
  invoiceId: string
  amount: number
  currency: string
  method: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  transactionId?: string
  paidAt?: string
  receivedBy: string
  metadata?: Record<string, any>
}

interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'canceled' | 'succeeded'
  clientSecret?: string
  nextAction?: any
}

/**
 * Payment service for handling financial transactions
 */
export class PaymentService {
  private static instance: PaymentService
  private stripe: any = null

  private constructor() {
    // Initialize Stripe or other payment processor
    this.initializeStripe()
  }

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService()
    }
    return PaymentService.instance
  }

  /**
   * Initialize Stripe payment processor
   */
  private initializeStripe(): void {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      // Lazy load Stripe to avoid bundle bloat
      import('@stripe/stripe-js').then(({ loadStripe }) => {
        loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!).then(stripe => {
          this.stripe = stripe
        })
      })
    }
  }

  /**
   * Create a payment intent for card payments
   */
  public async createPaymentIntent(
    amount: number,
    currency: string = 'usd',
    metadata?: Record<string, any>
  ): Promise<PaymentIntent> {
    try {
      // This would typically call your backend to create a PaymentIntent
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency,
          metadata,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create payment intent')
      }

      return await response.json()
    } catch (error) {
      console.error('Payment intent creation error:', error)
      throw new Error('Failed to create payment intent')
    }
  }

  /**
   * Process a payment
   */
  public async processPayment(
    invoiceId: string,
    amount: number,
    method: string,
    paymentDetails: Record<string, any>,
    receivedBy: string
  ): Promise<Payment> {
    try {
      // Validate payment amount
      if (amount <= 0) {
        throw new Error('Invalid payment amount')
      }

      // Process based on payment method
      let transactionId: string | undefined
      let status: Payment['status'] = 'completed'

      switch (method) {
        case 'card':
          transactionId = await this.processCardPayment(paymentDetails, amount)
          break
        
        case 'cash':
          transactionId = await this.processCashPayment(paymentDetails, amount)
          break
        
        case 'insurance':
          transactionId = await this.processInsurancePayment(paymentDetails, amount)
          status = 'pending' // Insurance payments often require processing
          break
        
        case 'mobile_money':
          transactionId = await this.processMobileMoneyPayment(paymentDetails, amount)
          break
        
        case 'bank_transfer':
          transactionId = await this.processBankTransfer(paymentDetails, amount)
          status = 'pending' // Bank transfers may take time to clear
          break
        
        default:
          throw new Error(`Unsupported payment method: ${method}`)
      }

      const payment: Payment = {
        id: this.generatePaymentId(),
        invoiceId,
        amount,
        currency: 'USD',
        method,
        status,
        transactionId,
        paidAt: new Date().toISOString(),
        receivedBy,
        metadata: paymentDetails,
      }

      // Save payment to database
      await this.savePayment(payment)

      return payment
    } catch (error) {
      console.error('Payment processing error:', error)
      throw error
    }
  }

  /**
   * Process card payment using Stripe
   */
  private async processCardPayment(
    paymentDetails: Record<string, any>,
    amount: number
  ): Promise<string> {
    if (!this.stripe) {
      throw new Error('Stripe not initialized')
    }

    try {
      const { paymentMethod, confirm = true } = paymentDetails

      if (confirm) {
        const { error, paymentIntent } = await this.stripe.confirmCardPayment(
          paymentDetails.clientSecret,
          {
            payment_method: paymentMethod.id,
          }
        )

        if (error) {
          throw new Error(error.message)
        }

        return paymentIntent.id
      } else {
        // For manual confirmation (e.g., after 3D Secure)
        return paymentDetails.paymentIntentId
      }
    } catch (error) {
      console.error('Card payment error:', error)
      throw new Error('Card payment failed')
    }
  }

  /**
   * Process cash payment
   */
  private async processCashPayment(
    paymentDetails: Record<string, any>,
    amount: number
  ): Promise<string> {
    // Cash payments are immediately confirmed
    // Generate a transaction ID for tracking
    return `CASH_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Process insurance payment
   */
  private async processInsurancePayment(
    paymentDetails: Record<string, any>,
    amount: number
  ): Promise<string> {
    const { insuranceProvider, policyNumber, groupNumber } = paymentDetails

    if (!insuranceProvider || !policyNumber) {
      throw new Error('Insurance provider and policy number are required')
    }

    // Submit claim to insurance provider
    // This would integrate with insurance company APIs
    return `INS_${insuranceProvider}_${Date.now()}`
  }

  /**
   * Process mobile money payment
   */
  private async processMobileMoneyPayment(
    paymentDetails: Record<string, any>,
    amount: number
  ): Promise<string> {
    const { phoneNumber, provider } = paymentDetails

    if (!phoneNumber || !provider) {
      throw new Error('Phone number and provider are required for mobile money')
    }

    // Integrate with mobile money provider (M-Pesa, etc.)
    // This would call the provider's API
    return `MOBILE_${provider}_${Date.now()}`
  }

  /**
   * Process bank transfer
   */
  private async processBankTransfer(
    paymentDetails: Record<string, any>,
    amount: number
  ): Promise<string> {
    const { bankName, accountNumber, reference } = paymentDetails

    if (!bankName || !accountNumber) {
      throw new Error('Bank name and account number are required')
    }

    // Generate bank transfer reference
    return `BANK_${bankName}_${reference || Date.now()}`
  }

  /**
   * Save payment to database
   */
  private async savePayment(payment: Payment): Promise<void> {
    try {
      // Save to Convex database
      const response = await fetch('/api/payments/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payment),
      })

      if (!response.ok) {
        throw new Error('Failed to save payment')
      }
    } catch (error) {
      console.error('Payment save error:', error)
      throw error
    }
  }

  /**
   * Generate unique payment ID
   */
  private generatePaymentId(): string {
    return `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  }

  /**
   * Refund a payment
   */
  public async refundPayment(
    paymentId: string,
    amount?: number,
    reason?: string
  ): Promise<boolean> {
    try {
      // Process refund based on original payment method
      const payment = await this.getPayment(paymentId)

      if (!payment) {
        throw new Error('Payment not found')
      }

      if (payment.status !== 'completed') {
        throw new Error('Only completed payments can be refunded')
      }

      const refundAmount = amount || payment.amount

      switch (payment.method) {
        case 'card':
          await this.processCardRefund(payment.transactionId!, refundAmount)
          break
        
        case 'cash':
          // Cash refunds require manual processing
          await this.processCashRefund(payment, refundAmount, reason)
          break
        
        default:
          throw new Error(`Refunds not supported for ${payment.method} payments`)
      }

      // Update payment status
      await this.updatePaymentStatus(paymentId, 'refunded')

      return true
    } catch (error) {
      console.error('Refund error:', error)
      throw error
    }
  }

  /**
   * Process card refund through Stripe
   */
  private async processCardRefund(transactionId: string, amount: number): Promise<void> {
    if (!this.stripe) {
      throw new Error('Stripe not initialized')
    }

    try {
      await this.stripe.refunds.create({
        payment_intent: transactionId,
        amount: Math.round(amount * 100), // Convert to cents
      })
    } catch (error) {
      console.error('Card refund error:', error)
      throw new Error('Card refund failed')
    }
  }

  /**
   * Process cash refund
   */
  private async processCashRefund(
    payment: Payment,
    amount: number,
    reason?: string
  ): Promise<void> {
    // Cash refunds are manual processes
    // Log the refund request for accounting
    console.log(`Cash refund requested: ${amount} for payment ${payment.id} - ${reason}`)
  }

  /**
   * Get payment by ID
   */
  public async getPayment(paymentId: string): Promise<Payment | null> {
    try {
      const response = await fetch(`/api/payments/${paymentId}`)
      
      if (!response.ok) {
        return null
      }

      return await response.json()
    } catch (error) {
      console.error('Get payment error:', error)
      return null
    }
  }

  /**
   * Get payments for an invoice
   */
  public async getInvoicePayments(invoiceId: string): Promise<Payment[]> {
    try {
      const response = await fetch(`/api/payments/invoice/${invoiceId}`)
      
      if (!response.ok) {
        return []
      }

      return await response.json()
    } catch (error) {
      console.error('Get invoice payments error:', error)
      return []
    }
  }

  /**
   * Update payment status
   */
  private async updatePaymentStatus(paymentId: string, status: Payment['status']): Promise<void> {
    try {
      await fetch(`/api/payments/${paymentId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })
    } catch (error) {
      console.error('Update payment status error:', error)
      throw error
    }
  }

  /**
   * Calculate total paid amount for an invoice
   */
  public async getTotalPaid(invoiceId: string): Promise<number> {
    const payments = await this.getInvoicePayments(invoiceId)
    return payments
      .filter(p => p.status === 'completed')
      .reduce((total, payment) => total + payment.amount, 0)
  }

  /**
   * Get payment methods supported by the system
   */
  public getSupportedPaymentMethods(): Array<{
    value: string
    label: string
    description: string
    requiresProcessing?: boolean
  }> {
    return [
      {
        value: 'cash',
        label: 'Cash',
        description: 'Physical currency payment',
      },
      {
        value: 'card',
        label: 'Credit/Debit Card',
        description: 'Card payment processed securely',
      },
      {
        value: 'insurance',
        label: 'Insurance',
        description: 'Payment through insurance provider',
        requiresProcessing: true,
      },
      {
        value: 'mobile_money',
        label: 'Mobile Money',
        description: 'Payment via mobile money service',
      },
      {
        value: 'bank_transfer',
        label: 'Bank Transfer',
        description: 'Direct bank transfer',
        requiresProcessing: true,
      },
    ]
  }
}

// Export singleton instance
export const paymentService = PaymentService.getInstance()

/**
 * React hook for payment operations
 */
export function usePayments() {
  const createPaymentIntent = async (amount: number, currency?: string, metadata?: Record<string, any>) => {
    return paymentService.createPaymentIntent(amount, currency, metadata)
  }

  const processPayment = async (
    invoiceId: string,
    amount: number,
    method: string,
    paymentDetails: Record<string, any>,
    receivedBy: string
  ) => {
    return paymentService.processPayment(invoiceId, amount, method, paymentDetails, receivedBy)
  }

  const refundPayment = async (paymentId: string, amount?: number, reason?: string) => {
    return paymentService.refundPayment(paymentId, amount, reason)
  }

  const getPayment = async (paymentId: string) => {
    return paymentService.getPayment(paymentId)
  }

  const getInvoicePayments = async (invoiceId: string) => {
    return paymentService.getInvoicePayments(invoiceId)
  }

  const getTotalPaid = async (invoiceId: string) => {
    return paymentService.getTotalPaid(invoiceId)
  }

  const getSupportedPaymentMethods = () => {
    return paymentService.getSupportedPaymentMethods()
  }

  return {
    createPaymentIntent,
    processPayment,
    refundPayment,
    getPayment,
    getInvoicePayments,
    getTotalPaid,
    getSupportedPaymentMethods,
  }
}