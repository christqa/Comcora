"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppDownload } from "@/features/login/components/AppDownload";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { ListOption } from "@/components/ui/list-option";
import { Thumbnail } from "@/components/ui/thumbnail";

interface UsernameFormProps {
  nextStep: () => void;
}

const usernameOptions = [
  "romaneloshviliroman",
  "eloshviliroman",
  "elo.roman",
  "e.loshviliroman",
];

export function UsernameForm({ nextStep }: UsernameFormProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  const formSchema = z.object({
    login: z
      .string()
      .regex(/^[a-zA-Z0-9]+$/, t("auth.registration.lettersAndNumbers"))
      .min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
  });

  const login = form.watch("login");

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setSuccess(true);
  };

  const onSelect = (e: React.MouseEvent, username: string) => {
    e.preventDefault();

    const isSelected = login === username;

    if (isSelected) {
      form.setValue("login", "");
    } else {
      form.setValue("login", username);
    }
  };

  return (
    <div className={"flex h-full max-w-[400px] flex-col justify-between"}>
      <div className="flex h-full flex-col items-center justify-center">
        <div className={"flex  flex-col items-center gap-10"}>
          <h2 className="text-center text-32-medium text-typography-primary">
            {t("auth.registration.createLogin")}
          </h2>
          <Form {...form}>
            <form
              className={"flex w-full flex-col gap-y-6"}
              onSubmit={form.handleSubmit(onSubmit)}
              action=""
            >
              <FormField
                control={form.control}
                name="login"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        isPlaceholderNotTransformed={true}
                        onClear={() => form.setValue("login", "")}
                        clearable
                        placeholder={t("auth.credentials.login")}
                        errorMessage={form.formState.errors.login?.message}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <ListOption containerClassName="rounded-[20px]">
                <Thumbnail variant={"secondary-success"}>
                  <Icon
                    name={"24/Primary/Info"}
                    className="text-typography-success"
                  />
                </Thumbnail>
                <p className="flex grow self-center text-12-medium text-typography-secondary">
                  {t("auth.registration.createOrUseSuggestedLogin")}
                </p>
              </ListOption>

              <div className="flex flex-wrap gap-2">
                {usernameOptions.map((username) => {
                  const isSelected = login === username;

                  return (
                    <Button
                      key={username}
                      variant={"primary"}
                      size={"S"}
                      className={`rounded-xl  text-14-medium ${isSelected ? "pl-4 text-typography-success" : "px-4"}`}
                      onClick={(e) => onSelect(e, username)}
                    >
                      {username}
                      {isSelected && (
                        <Icon
                          name={"16/Primary/Cross"}
                          color={"success"}
                          className="size-[16px]"
                        />
                      )}
                    </Button>
                  );
                })}
              </div>

              <Button
                className={"flex-1 px-0"}
                variant="accent"
                size="L"
                type="submit"
                disabled={!form.formState.isValid && !login}
              >
                {t("common.buttonText.continue")}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      <AppDownload />

      <Dialog open={success} onOpenChange={(open) => setSuccess(open)}>
        <DialogContent>
          <DialogHeader>
            <Icon
              className={"size-10 text-icon-critical"}
              name={"40/Success/Check"}
            />
            <DialogTitle>{t("auth.registration.loginCreated")}</DialogTitle>
            <DialogDescription className="mx-auto w-4/5">
              {t("auth.registration.yourLogin")} {login}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row">
            <Button
              variant={"accent"}
              size={"L"}
              className="w-1/2 capitalize"
              onClick={nextStep}
            >
              {t("common.buttonText.continue")}
            </Button>
            <Button
              variant={"secondary-success"}
              size={"L"}
              className="w-1/2 capitalize"
              onClick={() => setSuccess(false)}
            >
              {t("common.buttonText.change")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
