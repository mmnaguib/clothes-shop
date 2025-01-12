export interface IProductProps {
  id: number;
  category: ICategoryProps;
  creationAt: string;
  description: string;
  images: string[];
  price: number;
  title: string;
  updatedAt: string;
}

export interface ICategoryProps {
  id: number;
  name: string;
  image: string;
  creationAt: string;
  updatedAt: string;
}
