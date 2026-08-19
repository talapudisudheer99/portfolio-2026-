import { CapabilitiesWorkspace } from "@/components/shared/capabilities-workspace"
import { ContentRail, SectionShell } from "@/components/shared/section-wrapper"

export function Skills() {
  return (
    <SectionShell id="skills" className="capabilities-section section-rule">
      <ContentRail className="section-space capabilities-rail">
        <CapabilitiesWorkspace />
      </ContentRail>
    </SectionShell>
  )
}
