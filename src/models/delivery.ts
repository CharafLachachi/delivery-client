export interface Delivery {
    id: number;
    createdAt: string;
    modifiedAt: string;
    state: number;
    deliveryManId: number;
    orderId: number;
    deliveryMan ?: any;
    order ?: any ;
  }

