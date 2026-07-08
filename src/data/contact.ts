import type { ContactContent } from "@/types"

export const contactContent: ContactContent = {
  section: {
    title: "Contact",
    description: "Open to frontend engineering opportunities — let's connect.",
  },
  fields: [
    {
      name: "name",
      label: "Name",
      placeholder: "Your name",
    },
    {
      name: "email",
      label: "Email",
      placeholder: "you@example.com",
    },
    {
      name: "message",
      label: "Message",
      placeholder: "Tell me about the role or project...",
    },
  ],
  submitLabel: "Send Message",
  submittingLabel: "Sending...",
  successMessage: "Message sent successfully. I'll get back to you soon.",
  errorMessage: "Something went wrong. Please try again or email me directly.",
  missingKeyMessage:
    "Contact form is not configured yet. Please set NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY.",
}
