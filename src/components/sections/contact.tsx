"use client"

import { Mail, MapPin, Phone } from "lucide-react"
import { toast } from "sonner"

import { SocialLinks } from "@/components/shared/social-links"
import { SectionHeader } from "@/components/shared/section-header"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { contactContent } from "@/data/contact"
import { siteConfig } from "@/data/site"
import { useContactForm } from "@/hooks/use-contact-form"

export function Contact() {
  const { section, fields, submitLabel, submittingLabel, successMessage, errorMessage } =
    contactContent
  const { contact, socialLinks } = siteConfig
  const { register, handleSubmit, onSubmit, isSubmitting, errors } =
    useContactForm()

  async function handleFormSubmit(
    values: Parameters<typeof onSubmit>[0]
  ) {
    try {
      await onSubmit(values)
      toast.success(successMessage)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : errorMessage
      )
    }
  }

  return (
    <SectionWrapper id="contact" className="bg-background-secondary/50">
      <SectionHeader title={section.title} description={section.description} />

      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
        <div className="space-y-6">
          <div className="space-y-4">
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Mail className="size-5 shrink-0 text-primary" aria-hidden="true" />
              {contact.email}
            </a>
            <a
              href={`tel:${contact.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Phone className="size-5 shrink-0 text-primary" aria-hidden="true" />
              {contact.phone}
            </a>
            <p className="flex items-center gap-3 text-sm text-muted-foreground">
              <MapPin className="size-5 shrink-0 text-primary" aria-hidden="true" />
              {contact.location}
            </p>
          </div>

          <SocialLinks links={socialLinks} />
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="mx-auto w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8"
          aria-label={section.title}
          noValidate
        >
          <div className="space-y-5">
            {fields.map((field) => {
              const error = errors[field.name]
              const isTextarea = field.name === "message"

              return (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  {isTextarea ? (
                    <Textarea
                      id={field.name}
                      rows={5}
                      placeholder={field.placeholder}
                      aria-invalid={Boolean(error)}
                      className="min-h-[140px] rounded-[10px] px-4 py-3 text-[15px]"
                      {...register(field.name)}
                    />
                  ) : (
                    <Input
                      id={field.name}
                      type={field.name === "email" ? "email" : "text"}
                      placeholder={field.placeholder}
                      aria-invalid={Boolean(error)}
                      className="h-12 rounded-[10px] px-4 text-[15px]"
                      {...register(field.name)}
                    />
                  )}
                  {error ? (
                    <p className="text-sm text-destructive" role="alert">
                      {error.message}
                    </p>
                  ) : null}
                </div>
              )
            })}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 h-11 w-full rounded-[10px] text-sm font-medium"
          >
            {isSubmitting ? submittingLabel : submitLabel}
          </Button>
        </form>
      </div>
    </SectionWrapper>
  )
}
