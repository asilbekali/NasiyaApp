export interface LateProduct {
  borrowedProduct: number;
  productName: string;
  term: Date;
  monthPayment: number;
}

export interface LateDebtor {
  debtorId: number;
  debtorName: string;
  phoneNumbers: string[];
  lateProducts: LateProduct[];
}
