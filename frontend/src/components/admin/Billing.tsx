import React, { useState, useEffect } from 'react'
import Button from '../shared/Button'

interface BillingData {
  company_id: number
  company_name: string
  total_appointments: number
  total_revenue: number
  total_commission: number
  appointments: Array<{
    id: number
    service_name: string
    service_price: number
    appointment_date: string
    commission: number
  }>
}

interface BillingSummary {
  total_companies: number
  total_appointments: number
  total_revenue: number
  total_commission: number
  commission_rate: number
}

interface BillingResponse {
  companies: BillingData[]
  summary: BillingSummary
  date_range: {
    start_date: string | null
    end_date: string | null
  }
}

const Billing: React.FC = () => {
  const [billingData, setBillingData] = useState<BillingResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [expandedCompany, setExpandedCompany] = useState<number | null>(null)

  useEffect(() => {
    fetchBillingData()
  }, [])

  const fetchBillingData = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      let url = '/api/admin/billing'
      const params = new URLSearchParams()
      
      if (startDate) params.append('start_date', startDate)
      if (endDate) params.append('end_date', endDate)
      
      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (data.success) {
        setBillingData(data.data)
      } else {
        setError(data.message || 'Failed to fetch billing data')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = () => {
    fetchBillingData()
  }

  const handleClearFilter = () => {
    setStartDate('')
    setEndDate('')
    fetchBillingData()
  }

  const toggleCompanyExpansion = (companyId: number) => {
    setExpandedCompany(expandedCompany === companyId ? null : companyId)
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

  if (loading) {
    return <div className="container">Loading billing data...</div>
  }

  return (
    <div>
      <h1>Billing & Commission</h1>
      
      {error && (
        <div style={{
          color: 'var(--color-status-error)',
          marginBottom: '20px',
          padding: 'var(--spacing-md)',
          backgroundColor: 'var(--color-background-secondary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-status-error)'
        }}>
          {error}
        </div>
      )}

      {/* Filter Section */}
      <div className="card">
        <div className="card-header">
          <h3>Filter by Date Range</h3>
        </div>
        <div className="filter-section">
          <div className="form-group">
            <label htmlFor="start_date">Start Date</label>
            <input
              type="date"
              id="start_date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="end_date">End Date</label>
            <input
              type="date"
              id="end_date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="filter-actions">
            <Button variant="primary" onClick={handleFilter}>
              Apply Filter
            </Button>
            <Button variant="secondary" onClick={handleClearFilter}>
              Clear Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      {billingData && (
        <div className="card">
          <div className="card-header">
            <h3>Summary</h3>
          </div>
          <div className="summary-grid">
            <div className="summary-item">
              <div className="summary-label">Total Companies</div>
              <div className="summary-value">{billingData.summary.total_companies}</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Total Appointments</div>
              <div className="summary-value">{billingData.summary.total_appointments}</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Total Revenue</div>
              <div className="summary-value">{formatCurrency(billingData.summary.total_revenue)}</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Total Commission ({billingData.summary.commission_rate}%)</div>
              <div className="summary-value commission">{formatCurrency(billingData.summary.total_commission)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Companies Billing Data */}
      {billingData && billingData.companies.length > 0 ? (
        <div className="card">
          <div className="card-header">
            <h3>Company Billing Details</h3>
          </div>
          <div className="companies-billing">
            {billingData.companies.map((company) => (
              <div key={company.company_id} className="company-billing-item">
                <div className="company-header" onClick={() => toggleCompanyExpansion(company.company_id)}>
                  <div className="company-info">
                    <h4>{company.company_name}</h4>
                    <div className="company-stats">
                      <span>{company.total_appointments} appointments</span>
                      <span>{formatCurrency(company.total_revenue)} revenue</span>
                      <span className="commission">{formatCurrency(company.total_commission)} commission</span>
                    </div>
                  </div>
                  <div className="expand-icon">
                    {expandedCompany === company.company_id ? '▼' : '▶'}
                  </div>
                </div>
                
                {expandedCompany === company.company_id && (
                  <div className="company-appointments">
                    <table className="appointments-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Service</th>
                          <th>Price</th>
                          <th>Commission</th>
                        </tr>
                      </thead>
                      <tbody>
                        {company.appointments.map((appointment) => (
                          <tr key={appointment.id}>
                            <td>{formatDate(appointment.appointment_date)}</td>
                            <td>{appointment.service_name}</td>
                            <td>{formatCurrency(appointment.service_price)}</td>
                            <td className="commission">{formatCurrency(appointment.commission)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            <p>No billing data available for the selected date range.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Billing

