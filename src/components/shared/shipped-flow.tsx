"use client"

import { AnimatePresence, motion } from "framer-motion"
import {
  ChevronRight,
  Cloud,
  Code2,
  Database,
  FlaskConical,
  Rocket,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react"
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react"


import { easeOut } from "@/lib/motion"
import type {
  ShippedFlowAccent,
  ShippedFlowHub,
  ShippedFlowIcon,
  ShippedFlowNode,
} from "@/types"
import { cn } from "@/lib/utils"

const ICONS: Record<ShippedFlowIcon, LucideIcon> = {
  code: Code2,
  shield: ShieldCheck,
  database: Database,
  zap: Zap,
  cloud: Cloud,
  sparkles: Sparkles,
  test: FlaskConical,
  deploy: Rocket,
}

const GRID_POS: Record<string, { col: number; row: number }> = {
  web: { col: 0, row: 0 },
  auth: { col: 1, row: 0 },
  database: { col: 2, row: 0 },
  realtime: { col: 0, row: 1 },
  ai: { col: 2, row: 1 },
  storage: { col: 0, row: 2 },
  testing: { col: 1, row: 2 },
  deploy: { col: 2, row: 2 },
}

const SIDE_OFFSET_STEP = 16
const BUS_LANE_STEP = 20
const BUS_LEFT_OF_CENTER = 24
const BUS_RIGHT_OF_CENTER = 24
const PORT_OUTSET = 6
const PORT_DOT_RADIUS = 3.25
const PORT_RING_RADIUS = 5.25

const GRID_ORDER = [
  "web",
  "auth",
  "database",
  "realtime",
  null,
  "ai",
  "storage",
  "testing",
  "deploy",
] as const

const COMPACT_LAYOUT_QUERY = "(max-width: 1023px)"

function useCompactLayout() {
  const [compact, setCompact] = useState(false)

  useLayoutEffect(() => {
    const media = window.matchMedia(COMPACT_LAYOUT_QUERY)
    const update = () => setCompact(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  return compact
}

type NodeEmphasis = "rest" | "primary" | "connected" | "dim"
type AnchorSide = "top" | "right" | "bottom" | "left"

interface Anchor {
  x: number
  y: number
  side: AnchorSide
}

interface FlowEdge {
  id: string
  from: string
  to: string
}

interface EdgeGeometry {
  id: string
  from: string
  to: string
  d: string
  x1: number
  y1: number
  x2: number
  y2: number
  fromSide: AnchorSide
  toSide: AnchorSide
}

interface ShippedFlowProps {
  hub: ShippedFlowHub
  nodes: ShippedFlowNode[]
  className?: string
}

function buildEdges(nodes: ShippedFlowNode[]): FlowEdge[] {
  const seen = new Set<string>()
  const edges: FlowEdge[] = []

  for (const node of nodes) {
    for (const target of node.connectsTo) {
      const id = [node.id, target].sort().join("--")
      if (seen.has(id)) continue
      seen.add(id)
      const [from, to] = id.split("--") as [string, string]
      edges.push({ id, from, to })
    }
  }

  return edges
}

function buildConnectionMap(edges: FlowEdge[]) {
  const map = new Map<string, Set<string>>()

  for (const edge of edges) {
    if (!map.has(edge.from)) map.set(edge.from, new Set())
    if (!map.has(edge.to)) map.set(edge.to, new Set())
    map.get(edge.from)!.add(edge.to)
    map.get(edge.to)!.add(edge.from)
  }

  return map
}

function getNodeEmphasis(
  nodeId: string,
  focusId: string | null,
  selectedId: string | null,
  hoveredId: string | null,
  connections: Map<string, Set<string>>
): NodeEmphasis {
  if (!focusId) return "rest"
  if (nodeId === focusId) return "primary"
  if (selectedId && !hoveredId && nodeId === selectedId) return "primary"
  if (connections.get(focusId)?.has(nodeId)) return "connected"
  return "dim"
}

function orientEdge(
  edge: FlowEdge,
  focusId: string | null
): { fromId: string; toId: string } {
  if (focusId === edge.from) return { fromId: edge.from, toId: edge.to }
  if (focusId === edge.to) return { fromId: edge.to, toId: edge.from }
  return { fromId: edge.from, toId: edge.to }
}

function getAnchorSides(fromId: string, toId: string): {
  fromSide: AnchorSide
  toSide: AnchorSide
} {
  const from = GRID_POS[fromId]
  const to = GRID_POS[toId]
  if (!from || !to) return { fromSide: "right", toSide: "left" }

  const dc = to.col - from.col
  const dr = to.row - from.row

  if (dr === 0) {
    return dc > 0
      ? { fromSide: "right", toSide: "left" }
      : { fromSide: "left", toSide: "right" }
  }

  if (dc === 0) {
    return dr > 0
      ? { fromSide: "bottom", toSide: "top" }
      : { fromSide: "top", toSide: "bottom" }
  }

  if (from.col === 0) {
    return { fromSide: "right", toSide: "left" }
  }

  if (from.col === 2) {
    return { fromSide: "left", toSide: "right" }
  }

  if (to.col < from.col) {
    return { fromSide: "left", toSide: "right" }
  }

  if (to.col > from.col) {
    return { fromSide: "right", toSide: "left" }
  }

  return dr > 0
    ? { fromSide: "bottom", toSide: "top" }
    : { fromSide: "top", toSide: "bottom" }
}

interface RoutingLanes {
  from: number
  to: number
}

function sortEdgesForSide(
  group: FlowEdge[],
  side: AnchorSide,
  mode: "exit" | "entry",
  focusId: string | null
) {
  const horizontalSide = side === "right" || side === "left"

  return [...group].sort((a, b) => {
    const aOrient = orientEdge(a, focusId)
    const bOrient = orientEdge(b, focusId)
    const aNode =
      mode === "exit" ? GRID_POS[aOrient.toId] : GRID_POS[aOrient.fromId]
    const bNode =
      mode === "exit" ? GRID_POS[bOrient.toId] : GRID_POS[bOrient.fromId]
    if (!aNode || !bNode) return 0

    if (horizontalSide) {
      if (aNode.col !== bNode.col) return aNode.col - bNode.col
      return aNode.row - bNode.row
    }

    if (aNode.row !== bNode.row) return aNode.row - bNode.row
    return aNode.col - bNode.col
  })
}

function buildRoutingLanes(
  edges: FlowEdge[],
  focusId: string | null
): Map<string, RoutingLanes> {
  const exitGroups = new Map<string, FlowEdge[]>()
  const entryGroups = new Map<string, FlowEdge[]>()

  for (const edge of edges) {
    const { fromId, toId } = orientEdge(edge, focusId)
    const { fromSide, toSide } = getAnchorSides(fromId, toId)
    const exitKey = `${fromId}:${fromSide}`
    const entryKey = `${toId}:${toSide}`

    if (!exitGroups.has(exitKey)) exitGroups.set(exitKey, [])
    if (!entryGroups.has(entryKey)) entryGroups.set(entryKey, [])
    exitGroups.get(exitKey)!.push(edge)
    entryGroups.get(entryKey)!.push(edge)
  }

  const lanes = new Map<string, RoutingLanes>()

  const assignGroup = (
    groups: Map<string, FlowEdge[]>,
    mode: "exit" | "entry",
    focusId: string | null
  ) => {
    for (const [key, group] of groups) {
      const side = key.split(":")[1] as AnchorSide
      const sorted = sortEdgesForSide(group, side, mode, focusId)

      sorted.forEach((edge, index) => {
        const offset =
          sorted.length === 1
            ? 0
            : (index - (sorted.length - 1) / 2) * SIDE_OFFSET_STEP
        const current = lanes.get(edge.id) ?? { from: 0, to: 0 }

        if (mode === "exit") current.from = offset
        else current.to = offset

        lanes.set(edge.id, current)
      })
    }
  }

  assignGroup(exitGroups, "exit", focusId)
  assignGroup(entryGroups, "entry", focusId)

  return lanes
}

function sortEdgesBySourceRow(edges: FlowEdge[]) {
  return [...edges].sort((a, b) => {
    const ar = GRID_POS[a.from]?.row ?? 0
    const br = GRID_POS[b.from]?.row ?? 0
    if (ar !== br) return ar - br
    const ac = GRID_POS[a.from]?.col ?? 0
    const bc = GRID_POS[b.from]?.col ?? 0
    if (ac !== bc) return ac - bc
    return a.id.localeCompare(b.id)
  })
}

function sortEdgesByTargetRow(edges: FlowEdge[]) {
  return [...edges].sort((a, b) => {
    const ar = GRID_POS[a.to]?.row ?? 0
    const br = GRID_POS[b.to]?.row ?? 0
    if (ar !== br) return ar - br
    const ac = GRID_POS[a.to]?.col ?? 0
    const bc = GRID_POS[b.to]?.col ?? 0
    if (ac !== bc) return ac - bc
    return a.id.localeCompare(b.id)
  })
}

function assignBusLanes(
  groups: Map<string, FlowEdge[]>,
  baseX: number,
  sortFn: (edges: FlowEdge[]) => FlowEdge[],
  lanes: Map<string, number>
) {
  for (const group of groups.values()) {
    const sorted = sortFn(group)
    if (sorted.length === 1) continue

    sorted.forEach((edge, index) => {
      lanes.set(
        edge.id,
        baseX + (index - (sorted.length - 1) / 2) * BUS_LANE_STEP
      )
    })
  }
}

function buildBusLaneMap(
  edges: FlowEdge[],
  channelCenterX: number | null,
  focusId: string | null
): Map<string, number> {
  const lanes = new Map<string, number>()
  if (channelCenterX == null) return lanes

  const incomingLeft = new Map<string, FlowEdge[]>()
  const incomingRight = new Map<string, FlowEdge[]>()
  const outgoingRight = new Map<string, FlowEdge[]>()
  const outgoingLeft = new Map<string, FlowEdge[]>()

  for (const edge of edges) {
    const { fromId, toId } = orientEdge(edge, focusId)
    const { fromSide, toSide } = getAnchorSides(fromId, toId)
    const from = GRID_POS[fromId]
    const to = GRID_POS[toId]
    if (!from || !to) continue

    const needsBus = from.col !== to.col && from.row !== to.row
    if (!needsBus) continue

    if (toSide === "left") {
      const key = `${toId}:${toSide}`
      if (!incomingLeft.has(key)) incomingLeft.set(key, [])
      incomingLeft.get(key)!.push(edge)
    } else if (toSide === "right") {
      const key = `${toId}:${toSide}`
      if (!incomingRight.has(key)) incomingRight.set(key, [])
      incomingRight.get(key)!.push(edge)
    } else if (fromSide === "right") {
      const key = `${fromId}:${fromSide}`
      if (!outgoingRight.has(key)) outgoingRight.set(key, [])
      outgoingRight.get(key)!.push(edge)
    } else if (fromSide === "left") {
      const key = `${fromId}:${fromSide}`
      if (!outgoingLeft.has(key)) outgoingLeft.set(key, [])
      outgoingLeft.get(key)!.push(edge)
    }
  }

  assignBusLanes(
    incomingLeft,
    channelCenterX - BUS_LEFT_OF_CENTER,
    sortEdgesBySourceRow,
    lanes
  )
  assignBusLanes(
    incomingRight,
    channelCenterX + BUS_RIGHT_OF_CENTER,
    sortEdgesBySourceRow,
    lanes
  )
  assignBusLanes(
    outgoingRight,
    channelCenterX - BUS_LEFT_OF_CENTER + 8,
    sortEdgesByTargetRow,
    lanes
  )
  assignBusLanes(
    outgoingLeft,
    channelCenterX + BUS_RIGHT_OF_CENTER - 8,
    sortEdgesByTargetRow,
    lanes
  )

  return lanes
}

function getAnchorOnSide(
  rect: DOMRect,
  container: DOMRect,
  side: AnchorSide,
  offset = 0
): Anchor {
  const cx = rect.left + rect.width / 2 - container.left
  const cy = rect.top + rect.height / 2 - container.top
  const edgeX = rect.right - container.left
  const edgeLeft = rect.left - container.left
  const edgeTop = rect.top - container.top
  const edgeBottom = rect.bottom - container.top

  switch (side) {
    case "right":
      return { x: edgeX + PORT_OUTSET, y: cy + offset, side }
    case "left":
      return { x: edgeLeft - PORT_OUTSET, y: cy + offset, side }
    case "bottom":
      return { x: cx + offset, y: edgeBottom + PORT_OUTSET, side }
    case "top":
      return { x: cx + offset, y: edgeTop - PORT_OUTSET, side }
  }
}

interface RouteGeometry {
  d: string
  x1: number
  y1: number
  x2: number
  y2: number
}

function buildRouteGeometry(
  from: Anchor,
  to: Anchor,
  fromId: string,
  toId: string,
  busX?: number
): RouteGeometry {
  const fromGrid = GRID_POS[fromId]
  const toGrid = GRID_POS[toId]
  const { x: x1, y: y1, side: s1 } = from
  const { x: x2, y: y2, side: s2 } = to

  if (!fromGrid || !toGrid) {
    return { d: "", x1, y1, x2, y2 }
  }

  const sameRow = fromGrid.row === toGrid.row
  const sameCol = fromGrid.col === toGrid.col

  if (
    sameRow &&
    ((s1 === "right" && s2 === "left") || (s1 === "left" && s2 === "right"))
  ) {
    return {
      d: `M ${x1} ${y1} L ${x2} ${y1}`,
      x1,
      y1,
      x2,
      y2: y1,
    }
  }

  if (
    sameCol &&
    ((s1 === "bottom" && s2 === "top") || (s1 === "top" && s2 === "bottom"))
  ) {
    return {
      d: `M ${x1} ${y1} L ${x1} ${y2}`,
      x1,
      y1,
      x2: x1,
      y2,
    }
  }

  if (s1 === "right" && s2 === "left") {
    const corridor = busX ?? (x1 + x2) / 2
    return {
      d: `M ${x1} ${y1} L ${corridor} ${y1} L ${corridor} ${y2} L ${x2} ${y2}`,
      x1,
      y1,
      x2,
      y2,
    }
  }

  if (s1 === "left" && s2 === "right") {
    const corridor = busX ?? (x1 + x2) / 2
    return {
      d: `M ${x1} ${y1} L ${corridor} ${y1} L ${corridor} ${y2} L ${x2} ${y2}`,
      x1,
      y1,
      x2,
      y2,
    }
  }

  if (s1 === "bottom" && s2 === "top") {
    const midY = (y1 + y2) / 2
    return {
      d: `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`,
      x1,
      y1,
      x2,
      y2,
    }
  }

  if (s1 === "top" && s2 === "bottom") {
    const midY = (y1 + y2) / 2
    return {
      d: `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`,
      x1,
      y1,
      x2,
      y2,
    }
  }

  if (s1 === "right" || s1 === "left") {
    const corridor = busX ?? x2
    return {
      d: `M ${x1} ${y1} L ${corridor} ${y1} L ${corridor} ${y2} L ${x2} ${y2}`,
      x1,
      y1,
      x2,
      y2,
    }
  }

  return {
    d: `M ${x1} ${y1} L ${x1} ${y2} L ${x2} ${y2}`,
    x1,
    y1,
    x2,
    y2,
  }
}

function FlowPreview({ nodeId }: { nodeId: string }) {
  switch (nodeId) {
    case "realtime":
      return (
        <div className="shipped-flow-preview shipped-flow-preview--chat">
          <div className="shipped-flow-preview-sidebar">
            <span className="is-active"># general</span>
            <span># product</span>
          </div>
          <div className="shipped-flow-preview-main">
            <div className="shipped-flow-preview-msg">
              <strong>Sam</strong> · Product sync at 10
            </div>
            <div className="shipped-flow-preview-msg shipped-flow-preview-msg--alt">
              <strong>Aisha</strong> · Deploy runbook ready
            </div>
            <div className="shipped-flow-preview-typing">typing…</div>
          </div>
        </div>
      )

    case "ai":
      return (
        <div className="shipped-flow-preview shipped-flow-preview--ai">
          <div className="shipped-flow-preview-ai-header">
            <Sparkles className="size-3" strokeWidth={1.75} />
            <span>Channel AI</span>
          </div>
          <p className="shipped-flow-preview-ai-prompt">
            Summarize #product from this week
          </p>
          <div className="shipped-flow-preview-ai-actions">
            <span>Summarize</span>
            <span>Catch up</span>
            <span>Draft reply</span>
          </div>
        </div>
      )

    case "auth":
      return (
        <div className="shipped-flow-preview shipped-flow-preview--auth">
          <p className="shipped-flow-preview-auth-title">Sign in to Sameward</p>
          <div className="shipped-flow-preview-auth-oauth">Continue with Google</div>
          <div className="shipped-flow-preview-auth-field" />
          <div className="shipped-flow-preview-auth-btn">Send reset link</div>
        </div>
      )

    case "database":
      return (
        <div className="shipped-flow-preview shipped-flow-preview--table">
          <div className="shipped-flow-preview-table-head">
            <span>Workspace</span>
            <span>Members</span>
            <span>Role</span>
          </div>
          <div className="shipped-flow-preview-table-row">
            <span>Northwind</span>
            <span>12</span>
            <span>Admin</span>
          </div>
          <div className="shipped-flow-preview-table-row">
            <span>Product</span>
            <span>8</span>
            <span>Editor</span>
          </div>
        </div>
      )

    case "storage":
      return (
        <div className="shipped-flow-preview shipped-flow-preview--files">
          <div className="shipped-flow-preview-file">
            <span className="shipped-flow-preview-file-icon" />
            <span>profile-sam.png</span>
          </div>
          <div className="shipped-flow-preview-file">
            <span className="shipped-flow-preview-file-icon" />
            <span>release-notes.pdf</span>
          </div>
          <div className="shipped-flow-preview-upload">Drop files to upload</div>
        </div>
      )

    case "testing":
      return (
        <div className="shipped-flow-preview shipped-flow-preview--testing">
          <div className="shipped-flow-preview-test-pass">12 tests passing</div>
          <div className="shipped-flow-preview-test-item">sign-in flow</div>
          <div className="shipped-flow-preview-test-item">channel messaging</div>
          <div className="shipped-flow-preview-test-item">Channel AI reply</div>
        </div>
      )

    case "deploy":
      return (
        <div className="shipped-flow-preview shipped-flow-preview--deploy">
          <div className="shipped-flow-preview-deploy-row">
            <span>Web app</span>
            <span className="is-live">Live</span>
          </div>
          <div className="shipped-flow-preview-deploy-row">
            <span>Realtime</span>
            <span className="is-live">Live</span>
          </div>
          <p className="shipped-flow-preview-deploy-url">sameward.com</p>
        </div>
      )

    case "web":
    default:
      return (
        <div className="shipped-flow-preview shipped-flow-preview--app">
          <div className="shipped-flow-preview-app-chrome">
            <span />
            <span />
            <span />
          </div>
          <div className="shipped-flow-preview-app-body">
            <aside className="shipped-flow-preview-app-nav">
              <span>Chat</span>
              <span>Plan</span>
              <span>Files</span>
            </aside>
            <div className="shipped-flow-preview-app-main">
              <div className="shipped-flow-preview-app-line" />
              <div className="shipped-flow-preview-app-line shipped-flow-preview-app-line--short" />
              <div className="shipped-flow-preview-app-line shipped-flow-preview-app-line--shorter" />
            </div>
          </div>
        </div>
      )
  }
}

export function ShippedFlow({ hub, nodes, className }: ShippedFlowProps) {
  const byId = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes])
  const orderedNodes = useMemo(
    () => [...nodes].sort((a, b) => a.index - b.index),
    [nodes]
  )
  const edges = useMemo(() => buildEdges(nodes), [nodes])
  const connections = useMemo(() => buildConnectionMap(edges), [edges])
  const labelId = useId()
  const diagramRef = useRef<HTMLDivElement>(null)
  const channelRef = useRef<HTMLDivElement>(null)
  const detailRef = useRef<HTMLElement>(null)
  const nodeRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const isCompact = useCompactLayout()
  const [edgeGeometry, setEdgeGeometry] = useState<EdgeGeometry[]>([])
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>("web")

  const focusId = isCompact ? selectedId : hoveredId ?? selectedId
  const routingLanes = useMemo(
    () => buildRoutingLanes(edges, focusId),
    [edges, focusId]
  )
  const focusNode = focusId ? byId.get(focusId) : null
  const selectedNode = selectedId ? byId.get(selectedId) : null
  const interaction = selectedId ? "selected" : hoveredId ? "hover" : "rest"

  const updateGeometry = useCallback(() => {
    if (isCompact) return

    const diagram = diagramRef.current
    if (!diagram) return

    const diagramRect = diagram.getBoundingClientRect()
    const channelEl = channelRef.current
    const channelCenterX = channelEl
      ? channelEl.getBoundingClientRect().left +
        channelEl.getBoundingClientRect().width / 2 -
        diagramRect.left
      : null
    const busLanes = buildBusLaneMap(edges, channelCenterX, focusId)
    const next: EdgeGeometry[] = []

    for (const edge of edges) {
      const { fromId, toId } = orientEdge(edge, focusId)
      const fromEl = nodeRefs.current.get(fromId)
      const toEl = nodeRefs.current.get(toId)
      if (!fromEl || !toEl) continue

      const fromRect = fromEl.getBoundingClientRect()
      const toRect = toEl.getBoundingClientRect()
      const fromGrid = GRID_POS[fromId]
      const toGrid = GRID_POS[toId]
      const { fromSide, toSide } = getAnchorSides(fromId, toId)
      const lane = routingLanes.get(edge.id) ?? { from: 0, to: 0 }
      const sameRow =
        fromGrid?.row === toGrid?.row && fromGrid != null && toGrid != null
      const sameCol =
        fromGrid?.col === toGrid?.col && fromGrid != null && toGrid != null

      const fromLaneOffset = lane.from
      const toLaneOffset =
        sameRow || sameCol ? lane.from : lane.to

      const fromAnchor = getAnchorOnSide(
        fromRect,
        diagramRect,
        fromSide,
        fromLaneOffset
      )
      const toAnchor = getAnchorOnSide(
        toRect,
        diagramRect,
        toSide,
        toLaneOffset
      )
      const isDiagonal =
        fromGrid &&
        toGrid &&
        fromGrid.col !== toGrid.col &&
        fromGrid.row !== toGrid.row
      const busX = isDiagonal ? busLanes.get(edge.id) : undefined
      const route = buildRouteGeometry(
        fromAnchor,
        toAnchor,
        fromId,
        toId,
        busX
      )

      next.push({
        id: edge.id,
        from: fromId,
        to: toId,
        d: route.d,
        x1: route.x1,
        y1: route.y1,
        x2: route.x2,
        y2: route.y2,
        fromSide: fromAnchor.side,
        toSide: toAnchor.side,
      })
    }

    setEdgeGeometry((prev) => {
      if (
        prev.length === next.length &&
        prev.every(
          (line, index) =>
            line.id === next[index]?.id && line.d === next[index]?.d
        )
      ) {
        return prev
      }
      return next
    })
  }, [edges, isCompact, routingLanes, focusId])

  useEffect(() => {
    if (isCompact) return

    const frame = requestAnimationFrame(updateGeometry)
    const diagram = diagramRef.current
    if (!diagram) return () => cancelAnimationFrame(frame)

    const observer = new ResizeObserver(updateGeometry)
    observer.observe(diagram)
    window.addEventListener("resize", updateGeometry)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener("resize", updateGeometry)
    }
  }, [isCompact, updateGeometry])

  useEffect(() => {
    if (isCompact) setHoveredId(null)
  }, [isCompact])

  const registerNode = useCallback(
    (id: string, el: HTMLButtonElement | null) => {
      if (el) nodeRefs.current.set(id, el)
      else nodeRefs.current.delete(id)
      requestAnimationFrame(updateGeometry)
    },
    [updateGeometry]
  )

  const handleNodeClick = (id: string) => {
    setSelectedId(id)

    if (isCompact) {
      requestAnimationFrame(() => {
        detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      })
    }
  }

  const handleNodeHover = (id: string) => {
    if (!isCompact) setHoveredId(id)
  }

  const handleNodeLeave = () => {
    if (!isCompact) setHoveredId(null)
  }

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    id: string
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      handleNodeClick(id)
    }
  }

  const isEdgeActive = (edge: Pick<FlowEdge, "from" | "to">) =>
    focusId != null && (edge.from === focusId || edge.to === focusId)

  const getEdgeAccent = (edge: Pick<FlowEdge, "from" | "to">): ShippedFlowAccent => {
    if (!focusId) return "cyan"
    const node = byId.get(focusId)
    return node?.accent ?? "cyan"
  }

  return (
    <div
      className={cn(
        "shipped-flow",
        selectedId && "shipped-flow--selected",
        className
      )}
      data-focus={focusId ?? ""}
      data-selected={selectedId ?? ""}
      data-interaction={interaction}
      data-layout={isCompact ? "compact" : "diagram"}
      aria-labelledby={labelId}
    >
      <p id={labelId} className="sr-only">
        {isCompact
          ? `Engineering modules for ${hub.title}. Tap a module to inspect what shipped.`
          : `Interactive engineering flow for ${hub.title}. Hover a module to trace connections. Click to open details.`}
      </p>

      <div className="shipped-flow-shell">
        <div ref={diagramRef} className="shipped-flow-diagram">
          {!isCompact ? (
            <>
              <div className="shipped-flow-atmosphere" aria-hidden="true">
                <span className="shipped-flow-atmosphere__layer shipped-flow-atmosphere__layer--cyan" />
                <span className="shipped-flow-atmosphere__layer shipped-flow-atmosphere__layer--violet" />
                <span className="shipped-flow-atmosphere__layer shipped-flow-atmosphere__layer--magenta" />
              </div>

              {focusNode ? (
                <div
                  className="shipped-flow-accent-light"
                  data-accent={focusNode.accent}
                  aria-hidden="true"
                />
              ) : null}
            </>
          ) : (
            <p className="shipped-flow-mobile-hint">
              Tap a module to inspect what shipped
            </p>
          )}

          {!isCompact ? (
            <>
              <svg className="shipped-flow-lines" aria-hidden="true" focusable="false">
                {edgeGeometry.map((edge) => {
                  const active = isEdgeActive(edge)
                  if (focusId && !active) return null

                  const accent = getEdgeAccent(edge)
                  const routeState =
                    active && selectedId === focusId
                      ? "selected"
                      : active
                        ? "hover"
                        : "rest"

                  return (
                    <path
                      key={edge.id}
                      d={edge.d}
                      className={cn(
                        "shipped-flow-edge",
                        active
                          ? "shipped-flow-edge--active is-active"
                          : "shipped-flow-edge--base"
                      )}
                      data-accent={active ? accent : undefined}
                      data-state={routeState}
                    />
                  )
                })}
              </svg>

              <svg className="shipped-flow-ports" aria-hidden="true" focusable="false">
                {edgeGeometry.map((edge) => {
                  const active = isEdgeActive(edge)
                  if (focusId && !active) return null

                  const accent = getEdgeAccent(edge)
                  const routeState =
                    active && selectedId === focusId
                      ? "selected"
                      : active
                        ? "hover"
                        : "rest"

                  return (
                    <g key={`${edge.id}-ports`} className="shipped-flow-port-group">
                      <FlowPort
                        cx={edge.x1}
                        cy={edge.y1}
                        accent={accent}
                        state={routeState}
                      />
                      <FlowPort
                        cx={edge.x2}
                        cy={edge.y2}
                        accent={accent}
                        state={routeState}
                      />
                    </g>
                  )
                })}
              </svg>
            </>
          ) : null}

          <div
            className={cn(
              "shipped-flow-grid",
              isCompact && "shipped-flow-grid--compact"
            )}
          >
            {isCompact
              ? orderedNodes.map((node) => {
                  const isSelected = selectedId === node.id
                  const emphasis: NodeEmphasis = isSelected ? "primary" : "rest"

                  return (
                    <FlowNode
                      key={node.id}
                      node={node}
                      emphasis={emphasis}
                      selected={isSelected}
                      compact
                      onHover={() => handleNodeHover(node.id)}
                      onLeave={handleNodeLeave}
                      onClick={() => handleNodeClick(node.id)}
                      onKeyDown={(event) => handleKeyDown(event, node.id)}
                    />
                  )
                })
              : GRID_ORDER.map((slotId) => {
                  if (slotId === null) {
                    return (
                      <div
                        key="center"
                        ref={channelRef}
                        className="shipped-flow-channel"
                        aria-hidden="true"
                      />
                    )
                  }

                  const node = byId.get(slotId)
                  if (!node) return null

                  const emphasis = getNodeEmphasis(
                    slotId,
                    focusId,
                    selectedId,
                    hoveredId,
                    connections
                  )
                  const isSelected = selectedId === slotId

                  return (
                    <FlowNode
                      key={node.id}
                      node={node}
                      emphasis={emphasis}
                      selected={isSelected}
                      onHover={() => handleNodeHover(node.id)}
                      onLeave={handleNodeLeave}
                      onClick={() => handleNodeClick(node.id)}
                      onKeyDown={(event) => handleKeyDown(event, node.id)}
                      ref={(el) => registerNode(node.id, el)}
                    />
                  )
                })}
          </div>
        </div>

        <aside
          ref={detailRef}
          className="shipped-flow-detail"
          data-accent={selectedNode?.accent}
          data-open={selectedNode ? "true" : "false"}
          aria-live="polite"
        >
          <AnimatePresence mode="wait">
            {selectedNode ? (
              <motion.div
                key={selectedNode.id}
                initial={
                  isCompact
                    ? { opacity: 0, y: 10 }
                    : { opacity: 0, x: 14, y: 6 }
                }
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={
                  isCompact
                    ? { opacity: 0, y: -6 }
                    : { opacity: 0, x: 10, y: -4 }
                }
                transition={{
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="shipped-flow-detail-inner"
                data-accent={selectedNode.accent}
              >
                <header className="shipped-flow-detail-header">
                  <div className="shipped-flow-detail-header-row">
                    <span className="shipped-flow-detail-index">
                      {String(selectedNode.index).padStart(2, "0")}
                    </span>
                    <button
                      type="button"
                      className="shipped-flow-detail-close"
                      onClick={() => setSelectedId("web")}
                      aria-label="Close detail panel"
                    >
                      <X className="size-4" strokeWidth={1.75} />
                    </button>
                  </div>
                  <div className="shipped-flow-detail-header-main">
                    <div className="shipped-flow-detail-icon" aria-hidden="true">
                      {(() => {
                        const Icon = ICONS[selectedNode.icon]
                        return <Icon className="size-5" strokeWidth={1.75} />
                      })()}
                    </div>
                    <div className="shipped-flow-detail-heading">
                      <h4 className="shipped-flow-detail-title">
                        {selectedNode.title}
                      </h4>
                      <p className="shipped-flow-detail-tech">
                        {selectedNode.detail}
                      </p>
                    </div>
                  </div>
                </header>

                <div className="shipped-flow-detail-body">
                  <p className="shipped-flow-detail-copy">
                    {selectedNode.description}
                  </p>
                  <ul className="shipped-flow-detail-list">
                    {selectedNode.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <section className="shipped-flow-detail-block">
                  <p className="shipped-flow-detail-block-label">Live preview</p>
                  <FlowPreview nodeId={selectedNode.id} />
                </section>

                <section className="shipped-flow-detail-block">
                  <p className="shipped-flow-detail-block-label">Architecture</p>
                  <div className="shipped-flow-detail-arch-track">
                    {selectedNode.architecture.map((step, index) => (
                      <span key={step.label} className="shipped-flow-detail-arch-item">
                        <span
                          className={cn(
                            "shipped-flow-detail-arch-node",
                            step.active && "is-active"
                          )}
                        >
                          {step.label}
                        </span>
                        {index < selectedNode.architecture.length - 1 ? (
                          <span className="shipped-flow-detail-arch-arrow" aria-hidden="true">
                            →
                          </span>
                        ) : null}
                      </span>
                    ))}
                  </div>
                </section>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.45, ease: easeOut }}
                className="shipped-flow-detail-empty"
              >
                <p className="shipped-flow-detail-empty-kicker">Explore the stack</p>
                <p className="shipped-flow-detail-empty-copy">
                  Hover a module to trace how it connects. Click to inspect what
                  shipped and how it runs in the product.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </div>
    </div>
  )
}

function FlowPort({
  cx,
  cy,
  accent,
  state,
}: {
  cx: number
  cy: number
  accent: ShippedFlowAccent
  state: "rest" | "hover" | "selected"
}) {
  return (
    <g className="shipped-flow-port is-active" data-accent={accent} data-state={state}>
      <circle
        cx={cx}
        cy={cy}
        r={PORT_RING_RADIUS}
        className="shipped-flow-port-ring"
      />
      <circle
        cx={cx}
        cy={cy}
        r={PORT_DOT_RADIUS}
        className="shipped-flow-port-dot"
      />
    </g>
  )
}

interface FlowNodeProps {
  node: ShippedFlowNode
  emphasis: NodeEmphasis
  selected: boolean
  compact?: boolean
  onHover: () => void
  onLeave: () => void
  onClick: () => void
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void
  ref?: (el: HTMLButtonElement | null) => void
  style?: CSSProperties
}

function FlowNode({
  node,
  emphasis,
  selected,
  compact = false,
  onHover,
  onLeave,
  onClick,
  onKeyDown,
  ref,
  style,
}: FlowNodeProps) {
  const Icon = ICONS[node.icon]

  return (
    <button
      type="button"
      ref={ref}
      style={style}
      data-id={node.id}
      data-accent={node.accent}
      data-emphasis={emphasis}
      data-selected={selected ? "true" : "false"}
      className={cn(
        "shipped-flow-node",
        compact && "shipped-flow-node--compact",
        selected && "is-selected"
      )}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
      onClick={onClick}
      onKeyDown={onKeyDown}
      aria-pressed={selected}
    >
      {!compact ? <span className="shipped-flow-node-glow" aria-hidden="true" /> : null}
      <span className="shipped-flow-node-index">
        {String(node.index).padStart(2, "0")}
      </span>
      {compact ? (
        <>
          <span className="shipped-flow-node-icon" aria-hidden="true">
            <Icon className="size-4" strokeWidth={1.45} />
          </span>
          <span className="shipped-flow-node-copy">
            <span className="shipped-flow-node-title">{node.title}</span>
            <span className="shipped-flow-node-stack">{node.cardStack}</span>
          </span>
          <ChevronRight
            className="shipped-flow-node-chevron size-3.5 shrink-0"
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </>
      ) : (
        <>
          <span className="shipped-flow-node-body">
            <span className="shipped-flow-node-icon" aria-hidden="true">
              <Icon className="size-[1.2rem]" strokeWidth={1.45} />
            </span>
            <span className="shipped-flow-node-title">{node.title}</span>
          </span>
          <span className="shipped-flow-node-meta">
            <span className="shipped-flow-node-stack">{node.cardStack}</span>
            <span className="shipped-flow-node-features">{node.cardFeatures}</span>
          </span>
        </>
      )}
    </button>
  )
}
