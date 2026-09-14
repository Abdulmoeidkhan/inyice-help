import type { Article } from './content.ts';

export const taxGuides: Article[] = [
  {
    slug: 'company-tax', category: 'company', title: 'Set up company invoice tax',
    description: 'Choose whether inYice calculates tax, set a fixed rate, and select taxable services.',
    path: 'Profiles → Company Profile → Invoice tax',
    steps: [
      'Open Company Profile as the company owner and find Invoice tax. Calculation is off by default; leave it off when you handle tax outside inYice.',
      'Enable invoice tax when you want it calculated automatically on new invoices. Enter Tax label, an optional Tax registration number, and Fixed rate (%). The rate can be 0–100 with up to four decimal places.',
      'Under Service prices, choose Exclude tax (add on top) when entered prices do not contain tax, or Include tax (extract tax) when they already do. At an illustrative 10% rate, an exclusive price of 1,000 becomes 1,100; an inclusive price of 1,100 contains 100 tax.',
      'Select at least one Taxable category: Flights, Hotels, Transfers, City Tours / Ziarat, Visa, or Other Services. Only selected categories contribute tax, using the fixed rate in every invoice currency.',
      'Choose Save Profile. Check the saved settings before creating the next invoice, then review its tax breakdown.',
      'To stop automatic tax on future invoices, switch calculation off and save. Existing invoices keep their saved settings and amounts.',
    ],
    note: 'Only the company owner can change these settings; invoice users cannot override the fixed rate. Currency does not select a tax rate. Selecting a category is a company configuration choice, not an automatic determination of its legal tax treatment.',
    related: ['company-profile', 'invoice-tax', 'tax-report', 'vat-calculator'],
  },
  {
    slug: 'invoice-tax', category: 'invoices', title: 'Read invoice tax, discounts, and refunds',
    description: 'Understand saved tax amounts and how discounts, refunds, and payments affect them.',
    path: 'Finance → Invoices → Invoice',
    steps: [
      'Open the invoice and check its currency, services, saved tax label, rate, registration number where provided, and whether tax is included in prices or added on top. Shared and printed/PDF invoices use the same saved tax details.',
      'Compare selected taxable services with the company configuration used when the invoice was issued. Unselected services do not contribute tax. An older invoice keeps its original treatment even after the company rate or categories change.',
      'After an authorized invoice discount, review the recalculated tax, total, and outstanding balance. Invoice-wide discounts reduce taxable and non-taxable services proportionally, using the invoice’s original rate.',
      'For a refund, start from the original invoice or order. For a partial refund, enter negative service amounts before the original proportional discount; inYice calculates the discount and tax reversals. For example, returning 500 of a service originally discounted by 10%, with 10% exclusive tax, gives a refund balance of 495.',
      'Keep the original customer and currency on a linked refund. A refund cannot exceed the original category amounts or be reduced below already allocated customer refunds. Original invoice discounts cannot change while its refund request exists.',
      'Use the final invoice or refund balance when allocating receipts, advances, payments, or refund adjustments. These settlements do not calculate tax again. Review Customer Statement for balances and Tax Report for saved tax activity.',
    ],
    note: 'Turning company tax off does not remove tax from earlier invoices. The standalone VAT Calculator rounds each item separately; invoice tax is rounded on the combined taxable amount after proportional discounts, so comparisons can differ slightly.',
    related: ['company-tax', 'invoice-detail', 'refunds', 'refund-allocation', 'tax-report'],
  },
  {
    slug: 'tax-report', category: 'reports', title: 'Tax Report: review charged and reversed tax',
    description: 'Review saved invoice tax and confirmed refunds, with separate totals for each currency.',
    path: 'Reports → Tax Report',
    steps: [
      'Open Tax Report as an owner, admin, or accounts user. Set From and To for the required date range.',
      'Optionally enter a Currency code, choose Invoices or Refunds under Type, and select Inclusive or Exclusive under Pricing. Search by invoice, order, customer, tax label, or registration number.',
      'Select Run report to apply the filters. Review invoice and refund counts, then the Tax charged, Tax reversed, Net tax, and Net taxable amount for each currency. Compare currencies separately.',
      'Inspect Tax records for the saved label, registration number, rate, pricing mode, Taxable amount (net), Tax amount, Sales excluding tax, and Total including tax. Taxable amount is after discounts and excludes tax; it can be smaller than total sales when only some categories are taxable.',
      'Use View to open the source invoice or confirmed refund. Refund row amounts are negative, while the Tax reversed summary shows the positive amount reversed. Net tax is charged tax less reversed tax.',
      'Use the table download menu for available CSV/PDF exports, subject to your company’s export access. Rerun the report after changing filters or updating a source record.',
    ],
    note: 'This report follows invoice dates, not payment dates. Confirmed refunds without an active invoice use their creation date; once invoiced, they are counted only through that invoice. Draft, cancelled, void, unconfirmed refund requests, and invoices without saved tax settings are excluded. Tax-enabled zero-tax invoices remain visible. Discounts update saved totals in the original invoice-date period; company setting changes do not recalculate the report.',
    related: ['company-tax', 'invoice-tax', 'discount-report', 'customer-statement', 'profit-report'],
  },
  {
    slug: 'vat-calculator', category: 'invoices', title: 'VAT Calculator: calculate tax separately',
    description: 'Add VAT or extract included VAT without changing invoices or company settings.',
    path: 'Finance → VAT Calculator',
    steps: [
      'Open VAT Calculator and choose Calculation mode: Add VAT to net amounts or Extract VAT from gross amounts.',
      'Check Currency and Decimal places. The calculator starts with your company currency when available; you can change the label and choose zero to four decimal places. Changing currency does not convert amounts.',
      'Enter each item’s amount and VAT rate (%), with an optional description. Use Add item for more rows; each row can have its own rate. Enter 0 when you need a zero-rate calculation.',
      'Resolve any invalid or missing amounts and rates to see the totals. Review each item’s Net, VAT, and Gross amounts, the combined totals, and Breakdown by VAT rate.',
      'Use Reset calculation to clear the items and return to adding VAT. Use Company Profile → Invoice tax if you want automatic tax on actual invoices instead.',
    ],
    note: 'This calculator works independently of company invoice tax, including when automatic tax is off. It does not save an invoice, change company tax settings, or create Tax Report records. It rounds amounts and VAT per item, half up, to the selected decimal places.',
    related: ['company-tax', 'invoice-tax', 'tax-report'],
  },
];
