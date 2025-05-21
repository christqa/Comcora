import { type PropsWithChildren } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Slider } from "@/components/ui/slider";

type ScaleControlProps = {
  zoom?: number;
  onChange: (value: number) => void;
  className?: string;
};

export function ScaleControl(props: PropsWithChildren<ScaleControlProps>) {
  const { zoom = 0, onChange, className } = props;

  const handleValueChange = (value: number[]) => {
    const newValue = value[0];

    if (newValue) {
      const newZoom = newValue / 100;

      if (newZoom !== zoom) {
        onChange(newZoom);
      }
    }
  };

  return (
    <div className={cn("flex items-center gap-x-1", className)}>
      <Button
        variant={"ghost"}
        size={"icon"}
        onClick={() => onChange(Math.max(zoom - 0.05, 0))}
      >
        <Icon name={"24/Primary/Minus"} className="size-6" />
      </Button>
      <Slider value={[zoom * 100]} onValueChange={handleValueChange} />
      <Button
        variant={"ghost"}
        size={"icon"}
        onClick={() => onChange(Math.min(zoom + 0.05, 1))}
      >
        <Icon name={"24/Primary/Plus"} className="size-6" />
      </Button>
    </div>
  );
}
