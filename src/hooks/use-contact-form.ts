"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { contactContent } from "@/data/contact"
import type { ContactFormValues } from "@/types"

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
})

export function useContactForm() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY

  async function onSubmit(values: ContactFormValues) {
    if (!accessKey) {
      throw new Error(contactContent.missingKeyMessage)
    }

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: accessKey,
        ...values,
      }),
    })

    const result = (await response.json()) as { success?: boolean }

    if (!response.ok || !result.success) {
      throw new Error(contactContent.errorMessage)
    }

    form.reset()
  }

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
    errors: form.formState.errors,
    register: form.register,
    handleSubmit: form.handleSubmit,
  }
}
