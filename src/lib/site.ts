export const site = {
  url: 'https://help.inyice.com',
  name: 'inYice Help Center',
  title: 'inYice Help Center: Travel Agency Workspace Guides',
  description: 'Learn how to use the inYice travel agency workspace: create orders and vouchers, manage invoices, record receipts and payments, and review reports.',
  image: '/social-image',
};

export const absoluteUrl = (path: string) => new URL(path, site.url).href;
