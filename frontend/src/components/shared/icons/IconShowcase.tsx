import React from 'react'
import { useThemeContext } from '../../../theme/ThemeProvider'
import {
  EditIcon,
  DeleteIcon,
  DropdownArrowIcon,
  PlusIcon,
  SearchIcon,
  CalendarIcon,
  UserIcon,
  BuildingIcon,
  CheckIcon,
  XIcon
} from './index'

const IconShowcase: React.FC = () => {
  const { currentTheme } = useThemeContext()

  const icons = [
    { name: 'Edit', component: EditIcon, description: 'Edit actions' },
    { name: 'Delete', component: DeleteIcon, description: 'Delete actions' },
    { name: 'Dropdown Arrow', component: DropdownArrowIcon, description: 'Dropdown indicators' },
    { name: 'Plus', component: PlusIcon, description: 'Add actions' },
    { name: 'Search', component: SearchIcon, description: 'Search functionality' },
    { name: 'Calendar', component: CalendarIcon, description: 'Date/time related' },
    { name: 'User', component: UserIcon, description: 'User related' },
    { name: 'Building', component: BuildingIcon, description: 'Company related' },
    { name: 'Check', component: CheckIcon, description: 'Success/confirmation' },
    { name: 'X (Close)', component: XIcon, description: 'Close/cancel actions' }
  ]

  return (
    <div style={{ padding: 'var(--spacing-lg)' }}>
      <h2 style={{ 
        color: 'var(--color-text-primary)',
        fontSize: 'var(--font-fontSize-xl)',
        fontWeight: 'var(--font-fontWeight-semibold)',
        marginBottom: 'var(--spacing-lg)',
        textAlign: 'center'
      }}>
        Icon Library - {currentTheme.name} Theme
      </h2>
      
      <div style={{
        backgroundColor: 'var(--color-background-card)',
        padding: 'var(--spacing-xl)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border-primary)',
        boxShadow: 'var(--color-shadow-md)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--spacing-lg)'
        }}>
          {icons.map(({ name, component: IconComponent, description }) => (
            <div key={name} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 'var(--spacing-lg)',
              backgroundColor: 'var(--color-background-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-primary)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                marginBottom: 'var(--spacing-md)',
                backgroundColor: 'var(--color-background-primary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-primary)'
              }}>
                <IconComponent size={24} />
              </div>
              
              <h4 style={{
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-fontSize-base)',
                fontWeight: 'var(--font-fontWeight-semibold)',
                margin: '0 0 var(--spacing-xs) 0',
                textAlign: 'center'
              }}>
                {name}
              </h4>
              
              <p style={{
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-fontSize-sm)',
                margin: 0,
                textAlign: 'center'
              }}>
                {description}
              </p>
            </div>
          ))}
        </div>

        {/* Dropdown Arrow Variations */}
        <div style={{
          marginTop: 'var(--spacing-xl)',
          padding: 'var(--spacing-lg)',
          backgroundColor: 'var(--color-background-secondary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border-primary)'
        }}>
          <h3 style={{
            color: 'var(--color-text-primary)',
            fontSize: 'var(--font-fontSize-lg)',
            fontWeight: 'var(--font-fontWeight-semibold)',
            marginBottom: 'var(--spacing-md)',
            textAlign: 'center'
          }}>
            Dropdown Arrow Variations
          </h3>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--spacing-lg)',
            flexWrap: 'wrap'
          }}>
            {(['down', 'up', 'left', 'right'] as const).map((direction) => (
              <div key={direction} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 'var(--spacing-md)',
                backgroundColor: 'var(--color-background-primary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-primary)'
              }}>
                <DropdownArrowIcon 
                  size={24} 
                  direction={direction}
                />
                <span style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--font-fontSize-sm)',
                  marginTop: 'var(--spacing-xs)',
                  textTransform: 'capitalize'
                }}>
                  {direction}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Examples */}
        <div style={{
          marginTop: 'var(--spacing-xl)',
          padding: 'var(--spacing-lg)',
          backgroundColor: 'var(--color-background-secondary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border-primary)'
        }}>
          <h3 style={{
            color: 'var(--color-text-primary)',
            fontSize: 'var(--font-fontSize-lg)',
            fontWeight: 'var(--font-fontWeight-semibold)',
            marginBottom: 'var(--spacing-md)',
            textAlign: 'center'
          }}>
            Usage Examples
          </h3>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--spacing-md)',
            flexWrap: 'wrap'
          }}>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              backgroundColor: 'var(--color-button-primary-background)',
              color: 'var(--color-button-primary-text)',
              border: '1px solid var(--color-button-primary-background)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-fontSize-sm)',
              cursor: 'pointer'
            }}>
              <PlusIcon size={16} />
              Add New
            </button>
            
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              backgroundColor: 'var(--color-button-secondary-background)',
              color: 'var(--color-button-secondary-text)',
              border: '1px solid var(--color-button-secondary-background)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-fontSize-sm)',
              cursor: 'pointer'
            }}>
              <SearchIcon size={16} />
              Search
            </button>
            
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              backgroundColor: 'var(--color-status-error)',
              color: 'white',
              border: '1px solid var(--color-status-error)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-fontSize-sm)',
              cursor: 'pointer'
            }}>
              <DeleteIcon size={16} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IconShowcase
