// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.


export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type ClasseField = {
  id: number;
  nom_de_la_classe: string;
  date_et_heure: string;
  type_id: number;
  nombre_de_places_disponibles: number;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type Classes = {
  id: number;
  nom_de_la_classe: string;
  type_id: number;
  type: string;
  date_et_heure: string;
  nombre_de_places_disponibles: number;
};



export type ClasseTypeField = {
  id: number;
  type_name: string;
};

export type AttendeesTable = {
  id: number;
  classe_id: number;
  classe_name: string;
  classe_date: string;
  classe_type: string;
  booking_date: string;
  user_id: string;
  user_name: string;
  product: string;
};