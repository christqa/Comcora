import { getInitials } from "@/lib/utils";
import { ListOption } from "@/components/ui/list-option";
import { Thumbnail } from "@/components/ui/thumbnail";

type PageProps = {
  key?: number;
  name: string;
  avatar?: string;
  status?: string;
};

export default function PaymentOption(props: PageProps) {
  const { name, avatar, status } = props;

  return (
    <ListOption
      className="items-center px-0 hover:bg-fill-primary-light"
      containerClassName="rounded-3xl p-4"
    >
      <div className="relative">
        <Thumbnail variant={"light"}>
          {avatar ? (
            <img
              src={avatar}
              alt="name"
              className="mx-auto size-10 self-center rounded-xl"
            />
          ) : (
            <p className="text-16-medium">{getInitials(name)}</p>
          )}
        </Thumbnail>
        {status === "online" ? (
          <div className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-fill-primary bg-fill-accent" />
        ) : null}
      </div>
      <div className="flex grow flex-col">
        <p className="text-16-medium text-typography-primary">{name}</p>
      </div>
    </ListOption>
  );
}
