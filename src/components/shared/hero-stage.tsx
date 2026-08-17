// const COLUMNS = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]

/** Always-on grid with one traveling capsule. Column index parked. */
export function HeroStage() {
  return (
    <div
      className="hero-stage pointer-events-none absolute inset-0 select-none"
      aria-hidden="true"
    >
      <div className="hero-stage-grid" />
      <div className="hero-stage-probe">
        <span className="hero-stage-probe-glow" />
        <span className="hero-stage-probe-body" />
      </div>
      {/* Column index — restore when the board needs the 01–12 ruler.
      <ol className="hero-stage-cols">
        {COLUMNS.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ol>
      */}
    </div>
  )
}
