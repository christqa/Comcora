type TransformedCards = {
  label: string;
  value: string;
};

export type TransformedAccount = {
  label: string;
  value: string;
  subItems?: TransformedCards[];
};

type SubItems = {
  label: string;
  value: string;
};

export type MenuItem = {
  label: string;
  value: string;
  subItems?: SubItems[];
};
