export interface IProductProps {
  _id: string;
  creationAt: string;
  image: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  colorId: number[];
  sizeId: number[];
  categoryId: ICategoryProps;
  updatedAt: string;
}

export interface ICategoryProps {
  _id: string;
  name: string;
}

export interface IUserLogin {
  _id: string;
  userName: string;
  password: string;
  isAdmin: boolean;
}

export interface IConfig {
  companyName: string;
  phoneNumber: string;
  address: string;
  image: string;
}

export interface IInvoice {
  _id: string;
  customerName: string;
  products: IInvoiceProducts[];
  totalAmount: number;
  createdAt: string;
}

export interface IInvoiceProducts {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  total: number;
  _id: string;
}
