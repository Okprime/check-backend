export interface CreateUser {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender?: string;
  countryCode: string;
}

export interface UserPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  isVerified?: boolean;
  deviceToken?: string;
}
