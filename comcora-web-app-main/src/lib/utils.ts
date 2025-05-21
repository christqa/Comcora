// eslint-disable-next-line import/no-restricted-paths
import { type Transaction } from "@/features/transactions/lib/transaction";
import {
  type MenuItem,
  type TransformedAccount,
} from "@/types/business-service.types";
import { type AccountCurrencyCode } from "@/types/local.types";
import { type AccountSummaryDTO } from "@xdatagroup/tbb-sdk/dist/api/services/business/models";
import { clsx, type ClassValue } from "clsx";
import { format, isToday, isValid, isYesterday, parseISO } from "date-fns";
import { enGB, et, ru } from "date-fns/locale";
import { type TFunction } from "i18next";
import moment from "moment";
import { extendTailwindMerge } from "tailwind-merge";

import { type ListItemVariant } from "@/lib/types";

import { mockRequstMoneyLink } from "./mock-data";

const twMerge = extendTailwindMerge({
  override: {
    classGroups: {
      "font-size": [
        "12-medium",
        "14-medium",
        "16-medium",
        "32-medium",
        "40-medium",
      ],
      "text-color": [
        "typography-primary",
        "typography-primary-inverse",
        "typography-secondary",
        "typography-disabled",
        "typography-surface",
        "typography-surface-inverse",
        "typography-success",
        "typography-caution",
        "typography-critical",
        "fill-background-main",
        "fill-primary",
        "fill-primary-light",
        "fill-primary-active",
        "fill-primary-inverse",
        "fill-primary-inverse_active",
        "fill-secondary",
        "fill-secondary-active",
        "fill-disabled",
        "fill-surface",
        "fill-surface-inverse",
        "fill-accent",
        "fill-accent-active",
        "fill-primary-success",
        "fill-secondary-success",
        "fill-primary-caution",
        "fill-secondary-caution",
        "fill-primary-critical",
        "fill-secondary-critical",
        "stroke-primary",
        "stroke-primary-light",
        "stroke-secondary",
        "stroke-secondary-active",
        "stroke-accent",
        "stroke-primary-success",
        "icon-primary",
        "icon-primary-inverse",
        "icon-primary-light",
        "icon-secondary",
        "icon-disabled",
        "icon-surface",
        "icon-surface-inverse",
        "icon-accent",
        "icon-success",
        "icon-caution",
        "icon-critical",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const resolveListItemVariant = (
  index: number,
  total: number
): ListItemVariant => {
  const isFirst = index === 0;
  const isLast = index === total - 1;
  if (isFirst) {
    return isLast ? "default" : "split-up";
  }

  if (isLast) {
    return "split-down";
  }

  return "split-half";
};

export const CURRENCY_SIGNS: Record<AccountCurrencyCode, string> = {
  USD: "$",
  EUR: "€",
  CHF: "₣",
  DKK: "kr.",
  SEK: "kr",
  RUB: "₽",
  GBP: "£",
  JPY: "¥",
  INR: "₹",
  KRW: "₩",
  AUD: "A$",
  CAD: "C$",
  CNY: "¥",
  NZD: "NZ$",
  SGD: "S$",
  HKD: "HK$",
  ZAR: "R",
  BRL: "R$",
  TRY: "₺",
  MXN: "Mex$",
  NOK: "kr",
  PLN: "zł",
};

export const resolveCurrencySign = (code: AccountCurrencyCode) => {
  return CURRENCY_SIGNS[code] ?? code;
};

export const formatAsCurrencyValue = (value: string | undefined) => {
  return String(value).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
};

export const convertToCurrencyObject = (
  value?: number | string,
  currency?: AccountCurrencyCode,
  basePadStart = 0
) => {
  const numericValue = Number(value) || 0;
  const formattedValue = numericValue.toFixed(2);
  const [basePart, decimalPart] = formattedValue.split(".");

  return {
    base: String(formatAsCurrencyValue(basePart)).padStart(basePadStart, "0"),
    decimals: decimalPart,
    currencySign: resolveCurrencySign(currency ?? "EUR"),
  };
};

export const formatDate = (date: Date | number) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;

  return d.toLocaleDateString("et-EE", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};

export const formatIssuedAtDate = (issuedAt: string) => {
  const epochTime = Number(issuedAt);
  const date = isNaN(epochTime)
    ? moment(issuedAt).toDate()
    : new Date(epochTime * 1000);

  return moment(date).isValid() ? moment(date).format("DD.MM.YYYY") : null;
};

export const formatLastSeen = (issuedAt: string, t: TFunction) => {
  const epochTime = Number(issuedAt);
  const now = new Date();
  const date = new Date(epochTime * 1000);
  const delta = now.getTime() - date.getTime();

  if (delta < 1000 * 60 * 10) {
    return t("profile.settings.deviceView.online");
  }

  return `${t("profile.settings.deviceView.lastLogin")} ${formatIssuedAtDate(issuedAt)}`;
};
export const formatIban = (value = "") => {
  const cleanNumber = value.replace(/\s/g, "").substring(0, 20);
  if (!cleanNumber.length) {
    return value;
  }
  const fullRegexp = /(\w{0,2}\d{0,2})(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})/;
  if (fullRegexp.test(cleanNumber)) {
    const result = fullRegexp.exec(cleanNumber);
    if (result) {
      const [_, p1, p2, p3, p4, p5] = result;
      return [p1, p2, p3, p4, p5].filter(Boolean).join(" ");
    }
  }
  return cleanNumber;
};

export const maskAccountNumber = (accountNumber = ""): string => {
  return [
    accountNumber.slice(0, 2),
    "****",
    accountNumber.slice(accountNumber.length - 4, accountNumber.length),
  ].join(" ");
};

export const convertValueIntoDots = (value: string) => {
  return "•".repeat(value.length);
};

export function groupTransactionsByDate(
  transactions: Transaction[] | undefined
): Record<string, Transaction[]> | undefined {
  return transactions?.reduce(
    (acc, transaction) => {
      const date = format(new Date(transaction.date), "yyyy-MM-dd");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date]?.push(transaction);
      return acc;
    },
    {} as Record<string, Transaction[]>
  );
}

export function formatDateToText(
  dateString: string,
  locale: string | string[] | undefined,
  t: TFunction
) {
  const date = parseISO(dateString);
  const localeLanguage = locale === "et" ? et : locale === "ru" ? ru : enGB;

  if (!isValid(date)) return "";

  if (isYesterday(date)) {
    return `${t("dates.yesterday")}, ${format(date, "d MMMM, EE", { locale: localeLanguage })}`;
  }

  if (isToday(date)) {
    return `${t("dates.today")}, ${format(date, "d MMMM, EE", { locale: localeLanguage })}`;
  }

  const currentYear = new Date().getFullYear();
  const dateYear = date.getFullYear();

  const formatString =
    dateYear === currentYear ? "d MMMM, EE" : "d MMMM, yyyy, EE";

  return format(date, formatString, { locale: localeLanguage });
}

export const getInitials = (name: string): string => {
  if (!name) return "";
  const words = name.split(" ");
  if (words.length === 0) return "";

  const firstWord = words[0] ?? "";
  const lastWord = words[words.length - 1] ?? "";

  const firstInitial = firstWord.charAt(0).toUpperCase();
  const lastInitial = lastWord.charAt(0).toUpperCase();

  return firstInitial + lastInitial;
};

export const formatDateTime = (
  dateString: string,
  locale: string | string[] | undefined
) => {
  if (!dateString) {
    return null;
  }

  const date = parseISO(dateString);

  if (isValid(date)) {
    const localeString = Array.isArray(locale) ? locale[0] : locale;
    const localeLanguage =
      localeString === "et" ? et : localeString === "ru" ? ru : enGB;

    return format(date, "d MMMM yyyy, HH:mm", { locale: localeLanguage });
  }
};

export const convertAccountCardsData = (
  data: AccountSummaryDTO[]
): TransformedAccount[] => {
  console.log(data);
  return data.map((account) => {
    const accountItem: TransformedAccount = {
      label: account.number ?? "",
      value: account.id ?? "",
    };

    if (account.cards.length > 0) {
      console.log(account.cards);
      accountItem.subItems = account.cards.map((card) => ({
        label: `${card.alias ?? ""} **${card.number.slice(-4)}`,
        value: card.id,
      }));
    }

    return accountItem;
  });
};

export const multipleChoiceDataConversion = (
  value: string,
  checked: boolean | "indeterminate",
  setChecked: (v: Record<string, boolean | "indeterminate">) => void,
  checkedItems: Record<string, boolean | "indeterminate">,
  items: TransformedAccount[]
) => {
  const updatedCheckedItems = { ...checkedItems, [value]: checked };

  const updateSubItems = (subItems?: MenuItem[]) => {
    if (subItems) {
      subItems.forEach((subItem) => {
        updatedCheckedItems[subItem.value] = checked;
        updateSubItems(subItem.subItems);
      });
    }
  };

  const updateParentItems = (
    items: MenuItem[],
    parentChecked: boolean | string
  ) => {
    items.forEach((item) => {
      if (item.subItems) {
        const allSubItemsChecked = item.subItems.every(
          (subItem) => updatedCheckedItems[subItem.value]
        );
        updatedCheckedItems[item.value] = allSubItemsChecked;
        updateParentItems(item.subItems, allSubItemsChecked);
      }
    });
  };

  items.forEach((item) => {
    if (item.value === value) {
      updateSubItems(item.subItems);
    }
  });

  updateParentItems(items, checked);

  setChecked(updatedCheckedItems);
};

type AnyFunction<T extends unknown[]> = (...args: T) => void;

export const debounce = <T extends unknown[]>(
  func: AnyFunction<T>,
  delay: number
): AnyFunction<T> => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: T) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

type AddressDetails = {
  country: string;
  state: string;
  city: string;
  streetAddressAndApartment: string;
  postalCode: string;
};

export const extractAddressData = (
  components: AddressComponent[]
): AddressDetails => {
  let subpremise = "";
  let streetNumber = "";
  let route = "";

  const addressDetails = components.reduce<AddressDetails>(
    (details, component) => {
      const { long_name, types } = component;

      if (types.includes("country")) {
        details.country = long_name;
      } else if (types.includes("administrative_area_level_1")) {
        details.state = long_name;
      } else if (
        types.includes("locality") ||
        types.includes("administrative_area_level_2")
      ) {
        details.city = long_name;
      } else if (types.includes("postal_code")) {
        details.postalCode = long_name;
      } else if (types.includes("subpremise")) {
        subpremise = long_name;
      } else if (types.includes("street_number")) {
        streetNumber = long_name;
      } else if (types.includes("route")) {
        route = long_name;
      }

      return details;
    },
    {
      country: "",
      state: "",
      city: "",
      streetAddressAndApartment: "",
      postalCode: "",
    }
  );

  const streetAddressParts = [];
  if (subpremise) streetAddressParts.push(`${subpremise},`);
  if (streetNumber) streetAddressParts.push(streetNumber);
  if (route) streetAddressParts.push(route);

  addressDetails.streetAddressAndApartment = streetAddressParts.join(" ");

  return addressDetails;
};

export const formattedLink =
  mockRequstMoneyLink.length > 48
    ? `${mockRequstMoneyLink.slice(0, 48)}...`
    : mockRequstMoneyLink;

export const IBANRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,32}$/;
export const validateIBAN = (value: string) => {
  return IBANRegex.test(value);
};

export const delay = (timeout: number): Promise<void> =>
  new Promise((r) => {
    setTimeout(r, timeout);
  });

export const buildNameAcronym = (name?: string) => {
  if (!name) {
    return "";
  }
  const parts = name.split(" ");

  return parts.length === 1
    ? parts[0]?.[0]
    : [parts[0]?.[0], parts[parts.length - 1]?.[0]].join("");
};
