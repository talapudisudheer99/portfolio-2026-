import { About } from "@/components/sections/about"
import { Contact } from "@/components/sections/contact"
import { Experience } from "@/components/sections/experience"
import { Hero } from "@/components/sections/hero"
import { Projects } from "@/components/sections/projects"
import { SelectedWork } from "@/components/sections/selected-work"
import { Skills } from "@/components/sections/skills"

export default function Page() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <Projects />
      <Skills />
      <Experience />
      <About />
      <Contact />
    </>
  )
}
