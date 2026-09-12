import { Camera } from 'lucide-react'

import { ActionButton } from '@/components/common/ActionButton'

const presets = ['Overview', 'North', 'South', 'East', 'West']

export function CameraPresetBar() {
  return (
    <div className="rounded-md border border-border/80 bg-background/45 p-2">
      <div className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        <Camera className="size-3" />
        Camera Presets
      </div>
      <div className="grid grid-cols-5 gap-1">
        {presets.map((preset, index) => (
          <ActionButton key={preset} isActive={index === 0} className="justify-center text-[10px]">
            {preset}
          </ActionButton>
        ))}
      </div>
    </div>
  )
}
