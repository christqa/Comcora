import Link from "next/link";

import { Avatar } from "@/components/ui/Avatar";

import { useContacts } from "../../hooks/ContactsProvider";
import { EditAccountControl } from "./EditContact";

export const ContactCover = () => {
  const { contact } = useContacts();

  const { name, email, profilePicture } = contact ?? {};

  const [firstName, ...restName] = name?.split(" ") ?? [];
  const lastName = restName.join(" ");

  return (
    <div
      className={`relative flex h-[289px] items-center justify-center overflow-hidden rounded-[40px] bg-fill-primary bg-cover bg-center p-4 shadow-m`}
      style={
        profilePicture ? { backgroundImage: `url(${profilePicture})` } : {}
      }
    >
      <div className="z-20 flex h-full flex-col items-center justify-center gap-5">
        <Avatar
          size="XL"
          src={profilePicture}
          alt={name}
          textClassName="text-20-medium"
          className="bg-fill-secondary"
          showBadge={contact?.isCustomer}
        />
        <div className="flex flex-col gap-2">
          <h1
            className={`relative text-center text-32-medium font-semibold leading-10 ${
              profilePicture
                ? "text-typography-primary-inverse"
                : "text-typography-primary"
            }`}
          >
            {firstName} {lastName}
          </h1>
          {email && (
            <Link
              href={`mailto:${email}`}
              className={`relative text-center text-12-medium text-typography-primary ${
                profilePicture
                  ? "text-typography-secondary"
                  : "text-typography-primary"
              }`}
            >
              {email}
            </Link>
          )}
        </div>
        <EditAccountControl contact={contact!} />
      </div>
      {profilePicture && (
        <div className="absolute inset-0 z-10 bg-fill-black-a3 backdrop-blur-xl" />
      )}
    </div>
  );
};
