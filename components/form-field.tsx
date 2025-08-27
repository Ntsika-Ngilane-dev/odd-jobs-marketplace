"use client"

import { forwardRef } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface BaseFieldProps {
  label: string
  error?: string
  required?: boolean
  className?: string
  description?: string
}

interface InputFieldProps extends BaseFieldProps {
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "date" | "time"
  placeholder?: string
  value?: string | number
  onChange?: (value: string) => void
  disabled?: boolean
}

interface TextareaFieldProps extends BaseFieldProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  rows?: number
  disabled?: boolean
}

interface SelectFieldProps extends BaseFieldProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  options: { value: string; label: string }[]
  disabled?: boolean
}

export const FormField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, required, className, description, type = "text", placeholder, value, onChange, disabled, ...props }, ref) => {
    return (
      <div className={cn("space-y-2", className)}>
        <Label htmlFor={props.id} className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        <Input
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={cn(error && "border-red-500 focus-visible:ring-red-500")}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

FormField.displayName = "FormField"

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, error, required, className, description, placeholder, value, onChange, rows = 4, disabled, ...props }, ref) => {
    return (
      <div className={cn("space-y-2", className)}>
        <Label htmlFor={props.id} className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        <Textarea
          ref={ref}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          rows={rows}
          disabled={disabled}
          className={cn(error && "border-red-500 focus-visible:ring-red-500")}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

TextareaField.displayName = "TextareaField"

export function SelectField({ 
  label, 
  error, 
  required, 
  className, 
  description, 
  placeholder, 
  value, 
  onChange, 
  options, 
  disabled,
  ...props 
}: SelectFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className={cn(error && "border-red-500 focus:ring-red-500")}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}
