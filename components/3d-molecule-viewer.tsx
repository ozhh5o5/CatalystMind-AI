"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MoleculeViewerProps {
  smiles?: string | null
  formula: string
  name: string
}

export function MoleculeViewer({ smiles, formula, name }: MoleculeViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 3dmol.js needs to be loaded globally or imported. 
    // Since we have the package, we dynamically import it on the client
    let viewer: any = null

    const initViewer = async () => {
      if (!viewerRef.current) return
      
      try {
        const $3Dmol = (await import("3dmol")).default || await import("3dmol")
        
        // Clear previous
        viewerRef.current.innerHTML = ""
        
        viewer = $3Dmol.createViewer(viewerRef.current, {
          backgroundColor: "transparent",
        })

        // Simple default molecule if smiles isn't provided (e.g. mock caffeine)
        const mockMolData = `
          O=C1C2=C(N=CN2C)N(C(=O)N1C)C
        `
        const molData = smiles || mockMolData
        
        // If it's smiles we use smiles, otherwise if it's a structural formula we might need SDF.
        // We will just assume smiles is available or fallback to a default mock string.
        viewer.addModel(molData, "smi")
        viewer.setStyle({}, { stick: { colorscheme: "Jmol" } })
        viewer.zoomTo()
        viewer.render()
      } catch (err) {
        console.error("Failed to load 3Dmol viewer", err)
      }
    }

    initViewer()

    return () => {
      if (viewerRef.current) {
        viewerRef.current.innerHTML = ""
      }
    }
  }, [smiles])

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50 pb-4">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Interactive 3D Viewer</span>
          <span className="text-sm font-mono text-muted-foreground">{formula}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative h-[300px] w-full bg-slate-900 dark:bg-slate-950">
          <div ref={viewerRef} className="absolute inset-0" />
          <div className="absolute bottom-2 right-2 text-xs text-white/50 pointer-events-none">
            Powered by 3Dmol.js
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
