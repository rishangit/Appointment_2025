import React, { useState } from 'react'
import { 
  Button, 
  Input, 
  TextArea, 
  Select, 
  Alert, 
  Badge, 
  Card, 
  LoadingSpinner, 
  Modal,
  UserRoleExample
} from '../shared'
import { UserRole } from '../../types'

const ComponentShowcase: React.FC = () => {
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const roleOptions = [
    { value: UserRole.USER, label: 'User' },
    { value: UserRole.COMPANY, label: 'Company' },
    { value: UserRole.ADMIN, label: 'Admin' }
  ]

  return (
    <div className="container">
      <div className="page-header">
        <h1>Component Showcase</h1>
        <p>Explore all shared components with different props and variations</p>
      </div>

      {/* Button Component Showcase */}
      <Card title="Button Component" subtitle="Different button variants, sizes, and states">
        <div className="showcase-section">
          <h3>Button Variants</h3>
          <div className="showcase-grid">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="success">Success Button</Button>
            <Button variant="danger">Danger Button</Button>
            <Button variant="warning">Warning Button</Button>
            <Button variant="info">Info Button</Button>
            <Button variant="outline">Outline Button</Button>
          </div>

          <h3>Button Sizes</h3>
          <div className="showcase-grid">
            <Button size="sm" variant="primary">Small Button</Button>
            <Button size="md" variant="primary">Medium Button</Button>
            <Button size="lg" variant="primary">Large Button</Button>
          </div>

          <h3>Button States</h3>
          <div className="showcase-grid">
            <Button variant="primary" disabled>Disabled Button</Button>
            <Button variant="primary" loading>Loading Button</Button>
            <Button variant="primary" icon="🚀">Button with Icon</Button>
            <Button variant="primary" fullWidth>Full Width Button</Button>
          </div>

          <h3>Button Types</h3>
          <div className="showcase-grid">
            <Button type="button" variant="primary">Button Type</Button>
            <Button type="submit" variant="success">Submit Type</Button>
            <Button type="reset" variant="warning">Reset Type</Button>
          </div>
        </div>
      </Card>

      {/* Input Component Showcase */}
      <Card title="Input Component" subtitle="Different input types and states">
        <div className="showcase-section">
          <h3>Input Types</h3>
          <div className="showcase-grid">
            <Input
              type="text"
              name="text"
              placeholder="Text input"
              label="Text Input"
            />
            <Input
              type="email"
              name="email"
              placeholder="Email input"
              label="Email Input"
            />
            <Input
              type="password"
              name="password"
              placeholder="Password input"
              label="Password Input"
            />
            <Input
              type="number"
              name="number"
              placeholder="Number input"
              label="Number Input"
            />
          </div>

          <h3>Input States</h3>
          <div className="showcase-grid">
            <Input
              type="text"
              name="disabled"
              placeholder="Disabled input"
              label="Disabled Input"
              disabled
            />
            <Input
              type="text"
              name="error"
              placeholder="Error input"
              label="Input with Error"
              error="This field is required"
            />
            <Input
              type="text"
              name="icon"
              placeholder="Input with icon"
              label="Input with Icon"
              icon="🔍"
            />
            <Input
              type="text"
              name="fullWidth"
              placeholder="Full width input"
              label="Full Width Input"
              fullWidth
            />
          </div>

          <h3>Input with Values</h3>
          <div className="showcase-grid">
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              label="Name Input"
            />
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              label="Email Input"
            />
          </div>
        </div>
      </Card>

      {/* TextArea Component Showcase */}
      <Card title="TextArea Component" subtitle="TextArea with different configurations">
        <div className="showcase-section">
          <h3>TextArea Variations</h3>
          <div className="showcase-grid">
            <TextArea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Enter your message"
              label="Message TextArea"
              rows={4}
            />
            <TextArea
              name="disabled"
              placeholder="Disabled textarea"
              label="Disabled TextArea"
              disabled
              rows={3}
            />
            <TextArea
              name="error"
              placeholder="TextArea with error"
              label="TextArea with Error"
              error="This field is required"
              rows={3}
            />
            <TextArea
              name="fullWidth"
              placeholder="Full width textarea"
              label="Full Width TextArea"
              fullWidth
              rows={3}
            />
          </div>
        </div>
      </Card>

      {/* Select Component Showcase */}
      <Card title="Select Component" subtitle="Select dropdowns with different options">
        <div className="showcase-section">
          <h3>Select Variations</h3>
          <div className="showcase-grid">
            <Select
              name="role"
              value={formData.role}
              onChange={handleSelectChange}
              options={roleOptions}
              placeholder="Select a role"
              label="Role Selection"
            />
            <Select
              name="disabled"
              options={roleOptions}
              placeholder="Disabled select"
              label="Disabled Select"
              disabled
            />
            <Select
              name="error"
              options={roleOptions}
              placeholder="Select with error"
              label="Select with Error"
              error="Please select a role"
            />
            <Select
              name="fullWidth"
              options={roleOptions}
              placeholder="Full width select"
              label="Full Width Select"
              fullWidth
            />
          </div>
        </div>
      </Card>

      {/* Alert Component Showcase */}
      <Card title="Alert Component" subtitle="Different alert types and states">
        <div className="showcase-section">
          <h3>Alert Types</h3>
          <div className="showcase-grid">
            <Alert type="success" message="This is a success alert message!" />
            <Alert type="error" message="This is an error alert message!" />
            <Alert type="warning" message="This is a warning alert message!" />
            <Alert type="info" message="This is an info alert message!" />
          </div>

          <h3>Dismissible Alerts</h3>
          <div className="showcase-grid">
            <Alert 
              type="success" 
              message="This is a dismissible success alert!" 
              dismissible 
            />
            <Alert 
              type="error" 
              message="This is a dismissible error alert!" 
              dismissible 
            />
          </div>
        </div>
      </Card>

      {/* Badge Component Showcase */}
      <Card title="Badge Component" subtitle="Different badge variants and sizes">
        <div className="showcase-section">
          <h3>Badge Variants</h3>
          <div className="showcase-grid">
            <Badge variant="primary">Primary Badge</Badge>
            <Badge variant="secondary">Secondary Badge</Badge>
            <Badge variant="success">Success Badge</Badge>
            <Badge variant="danger">Danger Badge</Badge>
            <Badge variant="warning">Warning Badge</Badge>
            <Badge variant="info">Info Badge</Badge>
          </div>

          <h3>Badge Sizes</h3>
          <div className="showcase-grid">
            <Badge size="sm" variant="primary">Small Badge</Badge>
            <Badge size="md" variant="primary">Medium Badge</Badge>
            <Badge size="lg" variant="primary">Large Badge</Badge>
          </div>

          <h3>Badge with Dot</h3>
          <div className="showcase-grid">
            <Badge variant="success" dot>Online</Badge>
            <Badge variant="danger" dot>Offline</Badge>
            <Badge variant="warning" dot>Away</Badge>
          </div>
        </div>
      </Card>

      {/* Card Component Showcase */}
      <Card title="Card Component" subtitle="Cards with different configurations">
        <div className="showcase-section">
          <h3>Card Variations</h3>
          <div className="showcase-grid">
            <Card title="Simple Card" subtitle="A basic card with title and subtitle">
              <p>This is the content of a simple card.</p>
            </Card>

            <Card 
              title="Card with Actions" 
              subtitle="Card with header actions"
              headerActions={
                <Button variant="primary" size="sm">Action</Button>
              }
            >
              <p>This card has header actions.</p>
            </Card>

            <Card 
              title="Card with Footer" 
              subtitle="Card with footer content"
              footer={
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <Button variant="secondary" size="sm">Cancel</Button>
                  <Button variant="primary" size="sm">Save</Button>
                </div>
              }
            >
              <p>This card has footer content.</p>
            </Card>
          </div>

          <h3>Card Styles</h3>
          <div className="showcase-grid">
            <Card title="No Shadow" subtitle="Card without shadow" shadow={false}>
              <p>This card has no shadow.</p>
            </Card>

            <Card title="Hover Effect" subtitle="Card with hover effect" hover>
              <p>This card has a hover effect.</p>
            </Card>

            <Card title="No Padding" subtitle="Card without padding" padding={false}>
              <p>This card has no padding.</p>
            </Card>
          </div>
        </div>
      </Card>

      {/* LoadingSpinner Component Showcase */}
      <Card title="LoadingSpinner Component" subtitle="Different spinner sizes and colors">
        <div className="showcase-section">
          <h3>Spinner Sizes</h3>
          <div className="showcase-grid">
            <div className="spinner-demo">
              <LoadingSpinner size="sm" />
              <span>Small Spinner</span>
            </div>
            <div className="spinner-demo">
              <LoadingSpinner size="md" />
              <span>Medium Spinner</span>
            </div>
            <div className="spinner-demo">
              <LoadingSpinner size="lg" />
              <span>Large Spinner</span>
            </div>
          </div>

          <h3>Spinner Colors</h3>
          <div className="showcase-grid">
            <div className="spinner-demo">
              <LoadingSpinner color="primary" />
              <span>Primary Color</span>
            </div>
            <div className="spinner-demo">
              <LoadingSpinner color="white" />
              <span>White Color</span>
            </div>
            <div className="spinner-demo">
              <LoadingSpinner color="gray" />
              <span>Gray Color</span>
            </div>
          </div>

          <h3>Spinner with Text</h3>
          <div className="showcase-grid">
            <LoadingSpinner text="Loading data..." />
            <LoadingSpinner text="Processing..." color="primary" />
            <LoadingSpinner text="Please wait..." color="gray" />
          </div>
        </div>
      </Card>

      {/* Modal Component Showcase */}
      <Card title="Modal Component" subtitle="Modal dialogs with different configurations">
        <div className="showcase-section">
          <h3>Modal Triggers</h3>
          <div className="showcase-grid">
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Open Modal
            </Button>
            <Button variant="secondary" onClick={() => setShowModal(true)}>
              Open Large Modal
            </Button>
            <Button variant="success" onClick={() => setShowModal(true)}>
              Open Small Modal
            </Button>
          </div>

          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title="Sample Modal"
            size="md"
          >
            <div>
              <p>This is a sample modal content. You can put any content here.</p>
              <p>It supports different sizes and configurations.</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setShowModal(false)}>
                Confirm
              </Button>
            </div>
          </Modal>
        </div>
      </Card>

      {/* UserRoleExample Component Showcase */}
      <Card title="UserRole Example Component" subtitle="Demonstration of UserRole utilities">
        <div className="showcase-section">
          <UserRoleExample />
        </div>
      </Card>

      {/* Interactive Form Demo */}
      <Card title="Interactive Form Demo" subtitle="See all components working together">
        <div className="showcase-section">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-row">
              <Input
                type="text"
                name="demoName"
                placeholder="Enter your name"
                label="Name"
                required
              />
              <Input
                type="email"
                name="demoEmail"
                placeholder="Enter your email"
                label="Email"
                required
              />
            </div>

            <div className="form-row">
              <Select
                name="demoRole"
                options={roleOptions}
                placeholder="Select your role"
                label="Role"
                required
              />
              <Input
                type="tel"
                name="demoPhone"
                placeholder="Enter your phone"
                label="Phone"
              />
            </div>

            <TextArea
              name="demoMessage"
              placeholder="Enter your message"
              label="Message"
              rows={4}
            />

            <div className="form-actions">
              <Button type="submit" variant="primary">
                Submit Form
              </Button>
              <Button type="reset" variant="secondary">
                Reset Form
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}

export default ComponentShowcase

