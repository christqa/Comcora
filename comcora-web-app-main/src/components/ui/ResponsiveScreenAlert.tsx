import { Icon } from "@/components/ui/icon";
import { Thumbnail } from "@/components/ui/thumbnail";

export default function ResponsiveScreenAlert() {
  return (
    <div
      className={
        "fixed left-0 top-0 flex h-screen w-screen justify-center bg-fill-background-main lg:hidden"
      }
    >
      <div className="mt-[188px] flex max-w-80 flex-col items-center gap-4">
        <Thumbnail variant={"secondary-success"}>
          <Icon
            name={"24/Primary/Info"}
            className="mx-auto size-6 self-center text-typography-success"
          />
        </Thumbnail>
        <div
          className={
            "text-center text-20-medium leading-6 text-typography-primary"
          }
        >
          Версия для мобильных устройств находится в разработке
        </div>
        <div className={"text-center text-12-medium text-typography-secondary"}>
          Comcora Online пока не поддерживает
          <br />
          мобильные устройства. Попробуйте
          <br />
          наше приложение
        </div>
        <div className="mt-4 flex justify-center gap-4">
          <Thumbnail>
            <Icon name={"24/Logos/Apple"} className="size-6" />
          </Thumbnail>
          <Thumbnail>
            <Icon
              name={"24/Logos/GooglePlay"}
              className="size-6 text-typography-primary"
            />
          </Thumbnail>
        </div>
      </div>
    </div>
  );
}
