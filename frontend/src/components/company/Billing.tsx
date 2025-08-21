import React, { useState, useEffect } from 'react'
import { useAppSelector } from '../../store/hooks'
import { StatusBadge } from '../shared'
import Button from '../shared/Button'

interface BillingData {
  id: number
  appointment_id: number
  company_name: string
  user_name: string
  service_name: string
  service_price: number
  appointment_date: string
  appointment_time: string
  commission_amount: number
  status: 'pending' | 'paid'
  created_at: string
}

interface BillingSummary {
  total_appointments: number
  total_revenue: number
  total_commission: number
  pending_commission: number
  paid_commission: number
  current_month_commission: number
}

const Billing: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth)
  const [billingData, setBillingData] = useState<BillingData[]>([])
  const [summary, setSummary] = useState<BillingSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [paymentAmount, setPaymentAmount] = useState('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const [cardHolderName, setCardHolderName] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [paymentProcessing, setPaymentProcessing] = useState(false)

  useEffect(() => {
    fetchBillingData()
  }, [selectedMonth])

  const fetchBillingData = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      let url = '/api/company/billing'
      if (selectedMonth) {
        url += `?month=${selectedMonth}`
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (data.success) {
        setBillingData(data.data.billing)
        setSummary(data.data.summary)
      } else {
        setError(data.message || 'Failed to fetch billing data')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      setError('Please enter a valid payment amount')
      return
    }

    if (!cardNumber || !cardHolderName || !expiryDate || !cvv) {
      setError('Please fill in all credit card details')
      return
    }

    // Basic credit card validation
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Please enter a valid 16-digit card number')
      return
    }

    if (cvv.length < 3 || cvv.length > 4) {
      setError('Please enter a valid CVV')
      return
    }

    setPaymentProcessing(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/company/billing/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parseFloat(paymentAmount),
          month: selectedMonth || new Date().toISOString().slice(0, 7),
          paymentMethod: 'credit_card',
          cardDetails: {
            number: cardNumber.replace(/\s/g, ''),
            holderName: cardHolderName,
            expiryDate: expiryDate,
            cvv: cvv
          }
        })
      })
      const data = await response.json()
      
      if (data.success) {
        setShowPaymentModal(false)
        setPaymentAmount('')
        setCardNumber('')
        setCardHolderName('')
        setExpiryDate('')
        setCvv('')
        setError('')
        fetchBillingData() // Refresh data
        alert('Payment processed successfully!')
      } else {
        setError(data.message || 'Payment failed')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setPaymentProcessing(false)
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusBadge = (status: string) => {
    const paymentStatusConfig = {
      pending: {
        label: 'PENDING',
        backgroundColor: '#ffc107',
        textColor: '#ffffff'
      },
      paid: {
        label: 'PAID',
        backgroundColor: '#28a745',
        textColor: '#ffffff'
      }
    }
    
    return <StatusBadge status={status} statusConfig={paymentStatusConfig} size="sm" />
  }

  const generateMonthOptions = () => {
    const months = []
    const currentDate = new Date()
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const value = date.toISOString().slice(0, 7)
      const label = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
      months.push({ value, label })
    }
    
    return months
  }

  if (loading) {
    return <div className="container">Loading billing information...</div>
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Company Billing</h1>
        <p>View your billing details and commission payments</p>
      </div>
      
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Billing Summary */}
      {summary && (
        <div className="card">
          <div className="card-header">
            <h3>Billing Summary</h3>
          </div>
          <div className="card-body">
            <div className="billing-summary-grid">
              <div className="summary-item">
                <h4>Total Appointments</h4>
                <p className="summary-value">{summary.total_appointments}</p>
              </div>
              <div className="summary-item">
                <h4>Total Revenue</h4>
                <p className="summary-value">{formatCurrency(summary.total_revenue)}</p>
              </div>
              <div className="summary-item">
                <h4>Total Commission</h4>
                <p className="summary-value">{formatCurrency(summary.total_commission)}</p>
              </div>
              <div className="summary-item">
                <h4>Pending Commission</h4>
                <p className="summary-value pending">{formatCurrency(summary.pending_commission)}</p>
              </div>
              <div className="summary-item">
                <h4>Paid Commission</h4>
                <p className="summary-value paid">{formatCurrency(summary.paid_commission)}</p>
              </div>
              <div className="summary-item">
                <h4>Current Month Commission</h4>
                <p className="summary-value current">{formatCurrency(summary.current_month_commission)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Payment Section */}
      <div className="card">
        <div className="card-header">
          <h3>Filter & Payment</h3>
        </div>
        <div className="card-body">
          <div className="billing-controls">
            <div className="form-group">
              <label htmlFor="month">Select Month</label>
              <select
                id="month"
                className="form-input"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="">All Months</option>
                {generateMonthOptions().map(month => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="payment-actions">
              <Button 
                variant="primary"
                onClick={() => setShowPaymentModal(true)}
                disabled={!summary || summary.pending_commission <= 0}
              >
                Pay Commission
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Billing Details */}
      <div className="card">
        <div className="card-header">
          <h3>Billing Details ({billingData.length} records)</h3>
        </div>
        <div className="card-body">
          {billingData.length === 0 ? (
            <p>No billing records found for the selected criteria.</p>
          ) : (
            <div className="billing-table">
              <table>
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Revenue</th>
                    <th>Commission (0.5%)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {billingData.map((billing) => (
                    <tr key={billing.id}>
                      <td>
                        <div>{formatDate(billing.appointment_date)}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {billing.appointment_time}
                        </div>
                      </td>
                      <td>
                        <strong>{billing.user_name}</strong>
                      </td>
                      <td>
                        <strong>{billing.service_name}</strong>
                      </td>
                      <td>{formatCurrency(billing.service_price)}</td>
                      <td>{formatCurrency(billing.commission_amount)}</td>
                      <td>{getStatusBadge(billing.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

             {/* Payment Modal */}
       {showPaymentModal && (
         <div className="modal-overlay">
           <div className="modal payment-modal">
             <div className="modal-header">
               <h3>Pay Commission with Credit Card</h3>
               <Button 
                 variant="outline"
                 size="sm"
                 onClick={() => setShowPaymentModal(false)}
               >
                 ×
               </Button>
             </div>
             <div className="modal-body">
               <div className="payment-amount-section">
                 <div className="form-group">
                   <label htmlFor="payment_amount">Payment Amount</label>
                   <input
                     type="number"
                     id="payment_amount"
                     className="form-input"
                     value={paymentAmount}
                     onChange={(e) => setPaymentAmount(e.target.value)}
                     placeholder="Enter amount to pay"
                     min="0"
                     step="0.01"
                   />
                 </div>
                 {summary && (
                   <div className="payment-info">
                     <p><strong>Pending Commission:</strong> {formatCurrency(summary.pending_commission)}</p>
                     <p><strong>Current Month Commission:</strong> {formatCurrency(summary.current_month_commission)}</p>
                   </div>
                 )}
               </div>

               <div className="credit-card-section">
                 <h4>Credit Card Details</h4>
                 <div className="credit-card-form">
                   <div className="form-group">
                     <label htmlFor="card_number">Card Number</label>
                     <input
                       type="text"
                       id="card_number"
                       className="form-input card-input"
                       value={cardNumber}
                       onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                       placeholder="1234 5678 9012 3456"
                       maxLength={19}
                     />
                     <div className="card-icons">
                       <span className="card-icon visa">💳</span>
                       <span className="card-icon mastercard">💳</span>
                     </div>
                   </div>

                   <div className="form-group">
                     <label htmlFor="card_holder">Cardholder Name</label>
                     <input
                       type="text"
                       id="card_holder"
                       className="form-input"
                       value={cardHolderName}
                       onChange={(e) => setCardHolderName(e.target.value.toUpperCase())}
                       placeholder="JOHN DOE"
                     />
                   </div>

                   <div className="card-row">
                     <div className="form-group">
                       <label htmlFor="expiry_date">Expiry Date</label>
                       <input
                         type="text"
                         id="expiry_date"
                         className="form-input"
                         value={expiryDate}
                         onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                         placeholder="MM/YY"
                         maxLength={5}
                       />
                     </div>

                     <div className="form-group">
                       <label htmlFor="cvv">CVV</label>
                       <input
                         type="text"
                         id="cvv"
                         className="form-input"
                         value={cvv}
                         onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                         placeholder="123"
                         maxLength={4}
                       />
                     </div>
                   </div>
                 </div>
               </div>
             </div>
             <div className="modal-footer">
               <Button 
                 variant="secondary"
                 onClick={() => setShowPaymentModal(false)}
                 disabled={paymentProcessing}
               >
                 Cancel
               </Button>
               <Button 
                 variant="primary"
                 onClick={handlePayment}
                 disabled={paymentProcessing}
               >
                 {paymentProcessing ? 'Processing Payment...' : 'Process Payment'}
               </Button>
             </div>
           </div>
         </div>
       )}
    </div>
  )
}

export default Billing
