export interface UserWithBusinessesResponse {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  businessesWithRole: Array<{
    businessId: number;
    businessType: string;
    location: string;
    bankId: number;
    roleId: number;
    role: string;
  }>;
}
