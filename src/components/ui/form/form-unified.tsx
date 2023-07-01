"use client"

import { CheckboxProps } from "@radix-ui/react-checkbox"
import clsx from "clsx"
import get from "lodash/get"
import dynamic from "next/dynamic"
import { HTMLInputTypeAttribute, forwardRef } from "react"
import { InputProps } from "../input"
import { TextareaProps } from "../textarea"
import { FormRadioGroupProps } from "./components/form-radio-group"
import { FORM_UNIFIED_VARIANT } from "./constants"
import FormControl from "./form-control"
import FormDescription from "./form-description"
import FormField from "./form-field"
import FormItem from "./form-item"
import FormLabel from "./form-label"
import FormMessage from "./form-message"
import { FormUnifiedVariantTypes } from "./types"

const FormInput = dynamic(() => import("./components/form-input"), {
  ssr: true,
})
const FormTextarea = dynamic(() => import("./components/form-textarea"), {
  ssr: true,
})
const FormCheckbox = dynamic(() => import("./components/form-checkbox"), {
  ssr: true,
})
const RadioGroup = dynamic(() => import("./components/form-radio-group"), {
  ssr: true,
})

type ExtendTextInputProps = Omit<
  InputProps & React.RefAttributes<HTMLInputElement>,
  "type" | "id" | "placeholder" | "disabled" | "name"
>

type ExtendTextareaProps = Omit<
  TextareaProps & React.RefAttributes<HTMLTextAreaElement>,
  keyof InputProps | "placeholder" | "disabled" | "name" | "type" | "id"
>

type ExtendCheckboxProps = CheckboxProps

type ExtendRadioGroupProps = FormRadioGroupProps

export interface FormUnifiedProps {
  variant: keyof FormUnifiedVariantTypes
  type?: HTMLInputTypeAttribute
  name: string
  id?: string
  label?: string
  placeholder?: string
  description?: string
  disabled?: boolean

  wrapperClassName?: string
  className?: string

  textInputProps?: ExtendTextInputProps
  textareaProps?: ExtendTextareaProps
  checkboxProps?: ExtendCheckboxProps
  radioGroupProps?: ExtendRadioGroupProps
}

const FORM_UNIFIED_VARIANT_LOADER = {
  [FORM_UNIFIED_VARIANT.TEXT_INPUT]: FormInput,
  [FORM_UNIFIED_VARIANT.TEXTAREA]: FormTextarea,
  [FORM_UNIFIED_VARIANT.CHECKBOX]: FormCheckbox,
  [FORM_UNIFIED_VARIANT.RADIO_GROUP]: RadioGroup,
}

const FormUnified = forwardRef<HTMLDivElement, FormUnifiedProps>(
  (
    {
      name,
      variant,
      description,
      label,
      wrapperClassName,
      className,
      textInputProps,
      textareaProps,
      checkboxProps,
      radioGroupProps,
      ...baseProps
    },
    ref
  ) => {
    const InputComp = FORM_UNIFIED_VARIANT_LOADER[variant] as any

    return (
      <FormItem className={wrapperClassName} ref={ref}>
        <FormControl>
          <FormField
            name={name}
            render={({ field, formState: { errors } }) => {
              const _error = get(errors, name)

              return (
                <>
                  {label ? (
                    <FormLabel className="mb-2">{label}</FormLabel>
                  ) : null}

                  <InputComp
                    {...field}
                    {...baseProps}
                    {...textInputProps}
                    {...textareaProps}
                    {...checkboxProps}
                    {...radioGroupProps}
                    className={clsx(textInputProps?.className)}
                  />

                  {_error?.message ? null : description ? (
                    <FormDescription />
                  ) : null}

                  {_error && _error.message ? <FormMessage /> : null}
                </>
              )
            }}
          />
        </FormControl>
      </FormItem>
    )
  }
)

FormUnified.displayName = "FormUnified"

export default FormUnified
