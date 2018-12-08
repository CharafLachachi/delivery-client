export interface DeliveryMan {
    id: number,
      firstname: string,
      lastname: string,
      phoneNumber: string,
      email: string,
      deliveryManAddress?: number,
      passwordHash?: number,
      passwordSalt?: number,
      deliveryManAddressNavigation?: any,
      delivery?: any[]
}