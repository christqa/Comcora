import { type PropsWithChildren, type ReactNode } from "react";

type ListOptionContentProps = {
  title: string | ReactNode;
  subtitle?: string;
  label?: string;
  description?: string | ReactNode;
  titleSuffix?: ReactNode;
};

export const ListOptionContent = ({
  children,
  title,
}: PropsWithChildren<ListOptionContentProps>) => {
  return (
    <div className={"flex min-h-10 grow flex-col justify-center"}>
      {title && (
        <span className="text-14-medium text-typography-primary">{title}</span>
      )}
      {children}
    </div>
  );
};
