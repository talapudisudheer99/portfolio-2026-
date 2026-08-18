import { About } from "@/components/sections/about"
import { Contact } from "@/components/sections/contact"
import { Experience } from "@/components/sections/experience"
import { Hero } from "@/components/sections/hero"
import { Projects } from "@/components/sections/projects"
import { Skills } from "@/components/sections/skills"
import { ScrollDrawerStack } from "@/components/shared/scroll-drawer"

export default function Page() {
  return (
    <ScrollDrawerStack>
      <Hero />
      <Projects />
      <Skills />
      <Experience />
      <About />
      <Contact />
    </ScrollDrawerStack>
  )
}
