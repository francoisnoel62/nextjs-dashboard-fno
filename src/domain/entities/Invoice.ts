export type Invoice = {
    id: string;
    name: string;
    email: string;
    image_url: string;
    customer_id: string;
    amount: number;
    date: string;
    status: 'pending' | 'paid';
  };