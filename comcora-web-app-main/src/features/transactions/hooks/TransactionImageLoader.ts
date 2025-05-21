import { type Transaction } from "@/features/transactions/lib/transaction";
import axios from "axios";
import Comcora from "public/Logos/Comcora.png";
import LHV from "public/Logos/LHV.png";
import SEB from "public/Logos/SEB.png";
import Swedbank from "public/Logos/Swedbank.png";
import Wise from "public/Logos/WISE.png";

const predefinedUris: Record<string, string> = {
  "swedbank as": Swedbank.src,
  "wise europe s.a": Wise.src,
  "as comcora pank": Comcora.src,
  "as lhv pank": LHV.src,
  "as seb pank": SEB.src,
};

class TransactionImageLoader {
  loaded = false;
  memoryCache: Record<string, string> = {};

  async init() {
    this.memoryCache = { ...predefinedUris };
    this.loaded = true;
  }

  async getImageUri(name: string) {
    const key = name.trim().toLowerCase();
    if (!this.loaded) {
      await this.init();
    }
    if (!key) {
      return "";
    }

    if (["string", "number"].includes(typeof this.memoryCache[key])) {
      return this.memoryCache[key] ?? undefined;
    }

    this.memoryCache[key] = (await this.fetchBrandLogo(name)) || "";

    return this.memoryCache[key] ?? undefined;
  }

  async fetchBrandLogo(brandName: string) {
    const searchUrl = `https://api.brandfetch.io/v2/search/${encodeURIComponent(
      brandName
    )}`;

    const response = await axios.get(searchUrl, {});

    const foundEntry = response.data[0];

    if (!foundEntry) {
      return "";
    }

    return foundEntry.icon as string;
  }
}

export const transactionImageLoader = new TransactionImageLoader();

export const populateTransactionImageUri = async (
  transactions: Array<Transaction>
): Promise<Transaction[]> => {
  const comocoraLogo =
    await transactionImageLoader.getImageUri("AS Comcora pank");
  const swedbankLogo = await transactionImageLoader.getImageUri("Swedbank AS");
  const wiseLogo = await transactionImageLoader.getImageUri("WISE EUROPE S.A");
  const lhvLogo = await transactionImageLoader.getImageUri("AS LHV PANK");
  const sebLogo = await transactionImageLoader.getImageUri("AS SEB PANK");

  transactions.forEach((t) => {
    // if (t.type === "TT" || t.type === "FX-IN" || t.type === "FX-OUT") {
    //   t.counterPartyImageUri = tbbLogo;
    // } else if (t.counterPartyType === "person") {
    //   if (t.type === "LOCAL-IN" || t.type === "LOCAL-OUT") {
    //     t.counterPartyImageUri = tbbLogo;
    //   } else
    if (t.type) {
      const paymentRequisites = t.isOutgoingOperation
        ? t.beneficiary.paymentRequisites
        : t.originator.paymentRequisites;

      if (paymentRequisites) {
        switch (paymentRequisites[0]?.institution) {
          case "SWEDBANK AS":
            t.counterPartyImageUri = swedbankLogo;
            break;
          case "WISE EUROPE S.A":
            t.counterPartyImageUri = wiseLogo;
            break;
          case "AS LHV PANK":
            t.counterPartyImageUri = lhvLogo;
            break;
          case "AS COMCORA PANK":
            t.counterPartyImageUri = comocoraLogo;
            break;
          case "AS SEB PANK":
            t.counterPartyImageUri = sebLogo;
            break;
          default:
            t.counterPartyImageUri = t.icon;
            break;
        }
      }
    }
    // }
  });

  const targetsToLoadUri = transactions.filter((t) => {
    const isBetweenOwnAccounts = t.isWithinOwnAccounts; // TODO: connect
    const hasLogo = !!t.icon;
    return (
      !hasLogo &&
      !isBetweenOwnAccounts &&
      t.type !== "AtmWithdrawal" &&
      t.counterPartyType === "company"
    );
  });

  const uniqueRecords = targetsToLoadUri.filter((a, index, list) => {
    return (
      index === list.findIndex((b) => b.counterPartyName === a.counterPartyName)
    );
  });

  const fetchedLogos = await Promise.all(
    uniqueRecords.map((r) =>
      transactionImageLoader.getImageUri(r.counterPartyName).then((src) => ({
        name: r.counterPartyName,
        src: src,
      }))
    )
  );

  fetchedLogos.forEach(({ name, src }) => {
    if (src) {
      targetsToLoadUri.forEach((r) => {
        if (r.counterPartyName === name) {
          r.counterPartyImageUri = src;
        }
      });
    }
  });

  return transactions;
};
