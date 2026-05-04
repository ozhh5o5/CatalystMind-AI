import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Database, FlaskConical, Link2 } from "lucide-react"

interface SynthesizabilityGraphProps {
  score: number | null
  candidateName: string
}

export function SynthesizabilityGraph({ score, candidateName }: SynthesizabilityGraphProps) {
  // Mock synthesis steps based on score
  const isHigh = (score || 0) > 0.6
  const steps = isHigh ? 2 : 4
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-violet-500" />
          Retrosynthetic Analysis
        </CardTitle>
        <CardDescription>
          Predicted synthesis pathways and precursor availability from commercial databases.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            {/* Step 1: Target */}
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300 font-bold">
                T
              </div>
              <div className="flex-1 rounded-lg border p-3">
                <p className="text-sm font-medium">{candidateName}</p>
                <p className="text-xs text-muted-foreground">Target Molecule</p>
              </div>
            </div>

            <div className="flex justify-center -my-2">
              <ArrowRight className="h-5 w-5 rotate-90 text-muted-foreground" />
            </div>

            {/* Intermediate Steps */}
            {Array.from({ length: steps - 1 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-bold">
                  S{i + 1}
                </div>
                <div className="flex-1 rounded-lg border border-dashed p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Intermediate {String.fromCharCode(65 + i)}</p>
                      <p className="text-xs text-muted-foreground">Predicted cross-coupling reaction</p>
                    </div>
                    <Badge variant="outline">Yield ~{Math.floor(Math.random() * 20 + 70)}%</Badge>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-center -my-2">
              <ArrowRight className="h-5 w-5 rotate-90 text-muted-foreground" />
            </div>

            {/* Precursors */}
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                <Database className="h-5 w-5" />
              </div>
              <div className="flex-1 rounded-lg border border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-900/10 p-3">
                <p className="text-sm font-medium text-green-900 dark:text-green-300">Commercially Available Precursors</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-green-600">Sigma-Aldrich</Badge>
                  <Badge className="bg-green-600">Enamine</Badge>
                  <Link2 className="h-3 w-3 text-green-600 ml-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
