export interface IProductProps {
  _id: string;
  category: ICategoryProps;
  creationAt: string;
  description: string;
  images: string[];
  price: number;
  title: string;
  updatedAt: string;
}

export interface ICategoryProps {
  _id: string;
  name: string;
}
