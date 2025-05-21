import { useTranslation } from "react-i18next";

export default function useAddresses() {
  const { t } = useTranslation();

  const addresses = [
    {
      id: 1,
      title: t("contacts.headOfficeComcora"),
      location: "Tedre 55, 13425 Tallinn",
      timeClosed: "19:00",
      distance: "270",
      unit: "м",
      startWeekDay: t("dates.weekday.short.1"),
      endWeekDay: t("dates.weekday.short.5"),
      startHour: "12.00",
      endHour: "19.00",
      telephone: "+372 668 8067",
      website: "helpdesk@comcora.com",
      position: {
        lat: 59.4189975339209,
        lng: 24.713067211091417,
      },
    },
    {
      id: 2,
      title: t("contacts.serviceCenter"),
      location: "Kure 16, 13424 Tallinn",
      timeClosed: "19:00",
      distance: "270",
      unit: "м",
      startWeekDay: t("dates.weekday.short.1"),
      endWeekDay: t("dates.weekday.short.5"),
      startHour: "12.00",
      endHour: "19.00",
      telephone: "+372 668 8067",
      website: "helpdesk@comcora.com",
      position: {
        lat: 59.4155304478921,
        lng: 24.703402426434486,
      },
    },
    {
      id: 3,
      title: t("contacts.serviceCenter"),
      location: "Paul Kerese 4, 20606 Narva",
      timeClosed: "19:00",
      distance: "270",
      unit: "м",
      startWeekDay: t("dates.weekday.short.1"),
      endWeekDay: t("dates.weekday.short.5"),
      startHour: "12.00",
      endHour: "19.00",
      telephone: "+372 668 8067",
      website: "helpdesk@comcora.com",
      position: {
        lat: 59.37615619247654,
        lng: 28.1901521839748,
      },
    },
  ];

  return { addresses };
}
