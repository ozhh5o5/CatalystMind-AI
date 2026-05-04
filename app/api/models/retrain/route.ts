import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST() {
  const count = await prisma.experiment.count()
  
  const last = await prisma.modelVersion.findFirst({ orderBy: { trainedAt: "desc" } })
  const nextTag = bumpVersion(last?.versionTag ?? "v0.9")
  const baseAcc = last?.accuracyMetric ?? 0.78
  const bump = Math.min(0.05, 0.01 + count * 0.001)
  const accuracy = Math.min(0.95, baseAcc + bump)

  let mv: any = null
  try {
    await prisma.modelVersion.updateMany({ data: { active: false } })
    mv = await prisma.modelVersion.create({
      data: {
        versionTag: nextTag,
        experimentsUsed: count,
        accuracyMetric: accuracy,
        notes: `Mock retrain on ${count} experiments (deterministic demo).`,
        active: true,
      },
    })
  } catch (err: any) {
    if (err?.message?.includes("read-only") || err?.code === "P2020" || err?.message?.includes("EROFS")) {
      mv = {
        id: "mock-mv-" + Date.now(),
        versionTag: nextTag,
        experimentsUsed: count,
        accuracyMetric: accuracy,
        notes: `Mock retrain on ${count} experiments (deterministic demo).`,
        active: true,
      }
    } else {
      return NextResponse.json({ error: "Failed to retrain model" }, { status: 500 })
    }
  }

  return NextResponse.json({
    version: mv,
    message: `Retrained on ${count} experiments · new accuracy ${accuracy.toFixed(2)} · ${nextTag}`,
  })
}

function bumpVersion(tag: string): string {
  const m = /^v(\d+)\.(\d+)$/.exec(tag)
  if (!m) return "v1.0"
  const major = Number(m[1])
  const minor = Number(m[2]) + 1
  return `v${major}.${minor}`
}
