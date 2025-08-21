# Shared Components

This directory contains reusable UI components that can be imported and used throughout the application.

## Available Components

### Form Components

#### Button
A versatile button component with multiple variants and sizes.

```tsx
import { Button } from '../shared'

<Button 
  variant="primary" 
  size="md" 
  loading={false}
  onClick={() => console.log('clicked')}
>
  Click Me
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'success' | 'outline'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: boolean - shows spinner when true
- `disabled`: boolean
- `fullWidth`: boolean
- `icon`: React.ReactNode
- `type`: 'button' | 'submit' | 'reset'

#### Input
A form input component with built-in validation and styling.

```tsx
import { Input } from '../shared'

<Input
  type="email"
  name="email"
  value={email}
  onChange={handleChange}
  label="Email Address"
  placeholder="Enter your email"
  required
  icon="📧"
  error={emailError}
/>
```

**Props:**
- `type`: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
- `name`: string
- `value`: string
- `onChange`: function
- `label`: string
- `placeholder`: string
- `required`: boolean
- `disabled`: boolean
- `error`: string
- `icon`: React.ReactNode
- `autoComplete`: string

#### TextArea
A multi-line text input component.

```tsx
import { TextArea } from '../shared'

<TextArea
  name="description"
  value={description}
  onChange={handleChange}
  label="Description"
  placeholder="Enter description"
  rows={4}
  maxLength={500}
/>
```

**Props:**
- `name`: string
- `value`: string
- `onChange`: function
- `label`: string
- `placeholder`: string
- `rows`: number
- `maxLength`: number
- `required`: boolean
- `disabled`: boolean
- `error`: string

#### Select
A dropdown select component.

```tsx
import { Select } from '../shared'

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' }
]

<Select
  name="category"
  value={category}
  onChange={handleChange}
  options={options}
  label="Category"
  placeholder="Select a category"
  required
/>
```

**Props:**
- `name`: string
- `value`: string | number
- `onChange`: function
- `options`: SelectOption[]
- `label`: string
- `placeholder`: string
- `required`: boolean
- `disabled`: boolean
- `error`: string
- `multiple`: boolean

### UI Components

#### Alert
A notification component for displaying messages.

```tsx
import { Alert } from '../shared'

<Alert 
  type="success" 
  message="Operation completed successfully!" 
  dismissible 
  onClose={() => setShowAlert(false)}
/>
```

**Props:**
- `type`: 'success' | 'error' | 'warning' | 'info'
- `message`: string
- `dismissible`: boolean
- `onClose`: function

#### Badge
A small status indicator component.

```tsx
import { Badge } from '../shared'

<Badge variant="success" size="md" dot>
  Active
</Badge>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'
- `size`: 'sm' | 'md' | 'lg'
- `dot`: boolean - shows colored dot indicator

#### Card
A container component for grouping related content.

```tsx
import { Card } from '../shared'

<Card 
  title="User Profile" 
  subtitle="Manage your account settings"
  headerActions={<Button>Edit</Button>}
  footer={<Button>Save Changes</Button>}
>
  <p>Card content goes here...</p>
</Card>
```

**Props:**
- `title`: string
- `subtitle`: string
- `headerActions`: React.ReactNode
- `footer`: React.ReactNode
- `padding`: 'sm' | 'md' | 'lg'
- `shadow`: 'none' | 'sm' | 'md' | 'lg'
- `hover`: boolean

#### LoadingSpinner
A loading indicator component.

```tsx
import { LoadingSpinner } from '../shared'

<LoadingSpinner 
  size="lg" 
  color="primary" 
  text="Loading data..." 
/>
```

**Props:**
- `size`: 'sm' | 'md' | 'lg'
- `color`: 'primary' | 'white' | 'gray'
- `text`: string

#### Modal
A modal dialog component.

```tsx
import { Modal } from '../shared'

<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Confirm Action"
  size="md"
  footer={
    <div>
      <Button variant="secondary" onClick={() => setShowModal(false)}>
        Cancel
      </Button>
      <Button variant="danger" onClick={handleConfirm}>
        Confirm
      </Button>
    </div>
  }
>
  <p>Are you sure you want to proceed?</p>
</Modal>
```

**Props:**
- `isOpen`: boolean
- `onClose`: function
- `title`: string
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `showCloseButton`: boolean
- `closeOnOverlayClick`: boolean
- `footer`: React.ReactNode

## Usage Examples

### Complete Form Example
```tsx
import React, { useState } from 'react'
import { Button, Input, TextArea, Select, Alert, Card } from '../shared'

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      // Submit form logic here
      setSuccess('Message sent successfully!')
    } catch (err) {
      setError('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const subjectOptions = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'support', label: 'Technical Support' },
    { value: 'billing', label: 'Billing Question' }
  ]

  return (
    <Card title="Contact Us" subtitle="Send us a message">
      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}
      
      <form onSubmit={handleSubmit}>
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          label="Full Name"
          placeholder="Enter your full name"
          required
          icon="👤"
        />
        
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          label="Email Address"
          placeholder="Enter your email"
          required
          icon="📧"
        />
        
        <Select
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          options={subjectOptions}
          label="Subject"
          placeholder="Select a subject"
          required
        />
        
        <TextArea
          name="message"
          value={formData.message}
          onChange={handleChange}
          label="Message"
          placeholder="Enter your message"
          rows={5}
          required
        />
        
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          fullWidth
        >
          Send Message
        </Button>
      </form>
    </Card>
  )
}
```

## Styling

All components use CSS classes that can be customized in the main stylesheet. The components are designed to work with the existing theme system and will automatically adapt to any theme changes.

## Best Practices

1. **Consistent Usage**: Use these shared components instead of creating custom HTML elements
2. **Props Validation**: Always provide required props and handle optional ones appropriately
3. **Error Handling**: Use the error props for form validation feedback
4. **Accessibility**: Components include proper ARIA labels and keyboard navigation
5. **Responsive Design**: Components are designed to be responsive by default

## Adding New Components

When adding new shared components:

1. Create the component file in this directory
2. Add TypeScript interfaces for props
3. Include proper JSDoc comments
4. Export from the index.ts file
5. Add to this README with usage examples
6. Test across different screen sizes and themes
