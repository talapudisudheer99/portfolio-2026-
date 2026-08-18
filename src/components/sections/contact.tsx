"use client"

import { ArrowUpRight, MapPin } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { FadeIn, MaskedLine, TraceRule } from "@/components/shared/motion"
import { ScrollEmergence } from "@/components/shared/parallax"
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
      <div className="content-grid gap-y-14">
        <ScrollEmergence className="col-span-12 md:col-span-9">
          <MaskedLine display>
            <h2 className="editorial-display max-w-[11ch] text-[clamp(3.8rem,8vw,8rem)] leading-[0.86] font-medium">
              {section.title}
              <span className="text-primary">.</span>
            </h2>
          </MaskedLine>
          <FadeIn delay={0.1}>
            <p className="mt-6 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
              {section.description}
            </p>
          </FadeIn>
        </ScrollEmergence>

        <ScrollEmergence className="col-span-12 mt-4 md:col-span-5">
          <TraceRule className="mb-6 bg-border" />
          <a
            href={`mailto:${contact.email}`}
            className="group inline-flex max-w-full items-center gap-2 border-b border-primary pb-2 text-xl font-extrabold tracking-[-0.035em] text-primary transition-colors hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:text-2xl"
          >
            <span className="truncate">{contact.email}</span>
            <ArrowUpRight
              className="size-5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </a>
          <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4 text-primary" aria-hidden="true" />
            {contact.location}
          </p>
          <SocialLinks links={socialLinks} className="mt-6" />
        </ScrollEmergence>

        <ScrollEmergence className="col-span-12 md:col-span-6 md:col-start-7">
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-7"
          aria-label="Contact form"
          noValidate
        >
          {fields.map((field) => {
            const error = errors[field.name]
            const isTextarea = field.name === "message"
            const errorId = `${field.name}-error`

            return (
              <div key={field.name}>
                <Label
                  htmlFor={field.name}
                  className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
                >
                  {field.label}
                </Label>
                {isTextarea ? (
                  <Textarea
                    id={field.name}
                    rows={4}
                    placeholder={field.placeholder}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? errorId : undefined}
                    className="mt-2 min-h-32 resize-y rounded-none border-0 border-b border-input bg-transparent px-0 py-3 text-base shadow-none focus-visible:border-primary focus-visible:ring-0"
                    {...register(field.name)}
                  />
                ) : (
                  <Input
                    id={field.name}
                    type={field.name === "email" ? "email" : "text"}
                    placeholder={field.placeholder}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? errorId : undefined}
                    className="mt-2 h-12 rounded-none border-0 border-b border-input bg-transparent px-0 text-base shadow-none focus-visible:border-primary focus-visible:ring-0"
                    {...register(field.name)}
                  />
                )}
                {error ? (
                  <p
                    id={errorId}
                    className="mt-2 text-sm text-destructive"
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
            className="h-12 rounded-full px-7 text-sm font-bold"
          >
            {isSubmitting ? submittingLabel : submitLabel}
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Button>
          <p
            role="status"
            aria-live="polite"
            className={
              status === "error"
                ? "text-sm text-destructive"
                : "text-sm text-success"
            }
          >
            {status === "idle" ? "" : statusMessage}
          </p>
        </form>
        </ScrollEmergence>
      </div>
    </SectionWrapper>
  )
}
