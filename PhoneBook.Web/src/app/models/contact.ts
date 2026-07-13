export interface Contact {
  id?: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  createdDate?: Date;
  isFavorite?: boolean;
  note?: string;
  birthDate?: Date;
}