"use client";

import { AppDownload } from "@/features/login/components/AppDownload";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Addresses from "@/components/ui/MapAddresses";

interface AddressFormProps {
  nextStep: () => void;
}

const formSchema = z.object({
  address: z.string().min(1),
  apartment: z.string().min(1),
});

export function AddressForm({ nextStep }: AddressFormProps) {
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = () => {
    nextStep();
  };

  return (
    <div className={"flex h-full max-w-[400px] flex-col justify-between"}>
      <div className={"flex flex-1 flex-col items-center justify-center"}>
        <div className={"flex flex-col items-center gap-10"}>
          <h2 className="text-center text-32-medium text-typography-primary">
            {t("auth.registration.residentialAddress")}
          </h2>
          <Form {...form}>
            <form
              className={"flex w-full flex-col gap-y-6"}
              onSubmit={form.handleSubmit(onSubmit)}
              action=""
            >
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Addresses
                          isPlaceholderNotTransformed={true}
                          loading={false}
                          handleAddressChange={(
                            v: google.maps.places.PlaceResult | null
                          ) => {
                            field.onChange(v?.formatted_address);
                          }}
                          clearable
                          onClear={() => {
                            form.setValue("address", "");
                            void form.trigger("address");
                          }}
                          placeholder={t("auth.registration.streetHouse")}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apartment"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          isPlaceholderNotTransformed={true}
                          placeholder={t("auth.registration.apartment")}
                          clearable
                          onClear={() => {
                            form.setValue("apartment", "");
                            void form.trigger("apartment");
                          }}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <p className="text-center text-12-medium text-typography-disabled">
                {t("auth.registration.confirmPersonalData", {
                  button: t("common.buttonText.continue"),
                })}
              </p>

              <Button
                className={"flex-1 px-0"}
                variant="accent"
                size="L"
                type="submit"
                disabled={
                  form.formState.isSubmitting || !form.formState.isValid
                }
              >
                {t("common.buttonText.continue")}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      <AppDownload />
    </div>
  );
}
