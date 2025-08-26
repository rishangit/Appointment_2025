// Icon Components
export { default as EditIcon } from './EditIcon'
export { default as DeleteIcon } from './DeleteIcon'
export { default as DropdownArrowIcon } from './DropdownArrowIcon'
export { default as PlusIcon } from './PlusIcon'
export { default as SearchIcon } from './SearchIcon'
export { default as CalendarIcon } from './CalendarIcon'
export { default as UserIcon } from './UserIcon'
export { default as BuildingIcon } from './BuildingIcon'
export { default as CheckIcon } from './CheckIcon'
export { default as XIcon } from './XIcon'
export { default as DashboardIcon } from './DashboardIcon'
export { default as AppointmentsIcon } from './AppointmentsIcon'
export { default as ServicesIcon } from './ServicesIcon'
export { default as UsersIcon } from './UsersIcon'
export { default as BillingIcon } from './BillingIcon'
export { default as LogoutIcon } from './LogoutIcon'
export { default as ShowcaseIcon } from './ShowcaseIcon'
export { default as EmailIcon } from './EmailIcon'
export { default as PasswordIcon } from './PasswordIcon'
export { default as LocationIcon } from './LocationIcon'
export { default as PhoneIcon } from './PhoneIcon'
export { default as SelectArrowIcon } from './SelectArrowIcon'
export { default as SettingsIcon } from './SettingsIcon'

// Icon Types
export interface IconProps {
  size?: number
  color?: string
  className?: string
}

export interface DropdownArrowIconProps extends IconProps {
  direction?: 'down' | 'up' | 'left' | 'right'
}
