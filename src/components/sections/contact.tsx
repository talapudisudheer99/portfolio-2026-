"use client"

import { ArrowUpRight, MapPin } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { SectionReveal } from "@/components/motion/section-reveal"
import { MaskedLine, TraceRule } from "@/components/shared/motion"
import { SocialLinks } from "@/components/shared/social-links"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { contactContent } from "@/data/contact"
import { siteConfig } from "@/data/site"
import { useContactForm } from "@/hooks/use-contact-form"

export function Contact() {
  const {
    section,
    fields,
    submitLabel,
    submittingLabel,
    successMessage,
    errorMessage,
  } = contactContent
  const { contact, socialLinks } = siteConfig
  const { register, handleSubmit, onSubmit, isSubmitting, errors } =
    useContactForm()
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [statusMessage, setStatusMessage] = useState("")

  async function handleFormSubmit(values: Parameters<typeof onSubmit>[0]) {
    try {
      await onSubmit(values)
      setStatus("success")
      setStatusMessage(successMessage)
      toast.success(successMessage)
    } catch (error) {
      const message = error instanceof Error ? error.message : errorMessage
      setStatus("error")
      setStatusMessage(message)
      toast.error(message)
    }
  }

  return (
    <SectionWrapper id="contact" className="section-rule">
      <div className="content-grid items-center gap-y-10 md:gap-y-0">
        <div className="col-span-12 md:col-span-5">
          <p className="section-kicker text-primary mb-6">Let&rsquo;s build</p>
          <MaskedLine display>
            <h2 className="editorial-display type-title max-w-[16ch] text-foreground">
              Have a product worth building?
            </h2>
          </MaskedLine>
          <SectionReveal variant="body" delay={0.1}>
            <p className="type-lead mt-6 max-w-lg text-muted-foreground">
              {section.description}
            </p>

            <TraceRule className="mb-6 mt-10 bg-border" />
            <a
              href={`mailto:${contact.email}`}
              className="group type-lead inline-flex max-w-full items-center gap-2 border-b border-primary pb-2 font-extrabold tracking-[-0.035em] text-primary transition-colors hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <span className="truncate">{contact.email}</span>
              <ArrowUpRight
                className="size-5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>
            <p className="type-ui mt-6 flex items-center gap-2 text-muted-foreground">
              <MapPin className="size-4 text-primary" aria-hidden="true" />
              {contact.location}
            </p>
            <SocialLinks links={socialLinks} className="mt-6" />
          </SectionReveal>
        </div>

        <SectionReveal
          variant="visual"
          className="col-span-12 md:col-span-6 md:col-start-7 md:row-start-1 md:self-center"
        >
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="contact-form"
            aria-label="Contact form"
            noValidate
          >
          {fields.map((field) => {
            const error = errors[field.name]
            const isTextarea = field.name === "message"
            const errorId = `${field.name}-error`

            return (
              <div key={field.name} className="contact-field">
                <Label
                  htmlFor={field.name}
                  className="contact-label"
                >
                  {field.label}
                </Label>
                {isTextarea ? (
                  <Textarea
                    id={field.name}
                    rows={5}
                    placeholder={field.placeholder}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? errorId : undefined}
                    className="contact-control contact-control--area"
                    {...register(field.name)}
                  />
                ) : (
                  <Input
                    id={field.name}
                    type={field.name === "email" ? "email" : "text"}
                    placeholder={field.placeholder}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? errorId : undefined}
                    className="contact-control"
                    {...register(field.name)}
                  />
                )}
                {error ? (
                  <p
                    id={errorId}
                    className="contact-field-error"
                    role="alert"
                  >
                    {error.message}
                  </p>
                ) : null}
              </div>
            )
          })}

          <Button
            type="submit"
            disabled={isSubmitting}
            data-cursor="Send"
            variant="default"
            size="lg"
            className="contact-submit"
          >
            {isSubmitting ? submittingLabel : submitLabel}
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Button>
          <p
            role="status"
            aria-live="polite"
            className={
              status === "error"
                ? "contact-status contact-status--error"
                : status === "success"
                  ? "contact-status contact-status--success"
                  : "contact-status"
            }
          >
            {status === "idle" ? "" : statusMessage}
          </p>
        </form>
        </SectionReveal>
      </div>
    </SectionWrapper>
  )
}
