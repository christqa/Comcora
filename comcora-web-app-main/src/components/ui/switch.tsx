import * as Switcher from "@radix-ui/react-switch";

interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof Switcher.Root> {
  label?: string;
  id: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = ({
  label,
  id,
  checked,
  onCheckedChange,
  ...props
}: SwitchProps) => {
  return (
    <div className="flex items-center gap-[16px]">
      <Switcher.Root
        className="relative h-[32px] w-[56px] cursor-default rounded-full bg-fill-disabled outline-none data-[state=checked]:bg-typography-success"
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        {...props}
      >
        <Switcher.Thumb className="block size-[24px] translate-x-1 rounded-full bg-white transition-transform duration-200 will-change-transform data-[state=checked]:translate-x-[27px]" />
      </Switcher.Root>
      <label className="text-16-medium text-typography-primary" htmlFor={id}>
        {label}
      </label>
    </div>
  );
};

export { Switch };
