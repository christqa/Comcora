import { InvoicePayment } from "@/features/invoices/components/InvoicePayment";

import { BackNavigationControl } from "@/components/ui/BackNavigationControl";

const InvoicePaymentPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <BackNavigationControl />
      <h4 className="mb-10 text-32-medium text-typography-primary">
        Оплатить электронный счет
      </h4>
      <InvoicePayment />
    </div>
  );
};

export default InvoicePaymentPage;
