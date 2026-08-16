import type { Project } from "@/types"

export const projects: Project[] = [
  {
    id: "sameward",
    title: "Sameward",
    featured: true,
    subtitle: "One workspace for teams to talk, plan, and get AI help",
    description:
      "End-to-end product: channels, realtime messaging, profiles, auth, file uploads, email, and Channel AI — shipped as a calm Ocean Blue workspace at sameward.com. Not a Slack/Notion clone; borrows the problems, owns the craft.",
    problem:
      "Chat, docs, and AI help are fragmented across tools. Teams lose context switching between channels, planning surfaces, and assistants that do not share workspace state.",
    liveUrl: "https://sameward.com/",
    decisions: [
      "Separate Socket.IO service with handshake auth and channel rooms instead of forcing realtime into the Next process",
      "Channel AI grounded in workspace context, including link-aware help on public URLs",
      "Rebrand TeamHub → Sameward in UI/copy/logo while intentionally keeping Mongo dbName, S3 buckets, and secrets stable",
    ],
    buildList: [
      "Next.js App Router, TypeScript, RTK Query, shadcn/Base UI design system",
      "Session cookies, Google OAuth, email verification, password reset, logout-all",
      "MongoDB/Mongoose multi-tenant workspaces, members, and roles",
      "Socket.IO realtime — typing, presence, channel rooms",
      "AWS S3 presigned uploads for avatars and attachments",
      "Resend on verified sameward.com domain",
      "Channel AI: summarize, catch-up, ask, draft",
      "Railway deploy for Next web + realtime; APP_URL=https://sameward.com",
    ],
  },
]
