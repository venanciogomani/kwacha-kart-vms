export interface StorePermissionsModel {
    id: string;
    name: string;
    description?: string;
    status: boolean;
    createdAt: string;
    updatedAt?: string;
}

export interface StoreRoleModel {
    id: string;
    name: string;
    description?: string;
    status: boolean;
    permissionsId: string[];
    createdAt: string;
    updatedAt?: string;
}

export interface StorePlansModel {
    id: string;
    name: string;
    description?: string;
    price: number;
    billingCycle: string;
    status: boolean;
    createdAt: string;
    updatedAt?: string;
}

export interface StoresModel {
    id: string;
    name: string;
    description?: string;
    address?: string;
    city?: string;
    province?: string;
    country?: string;
    phone?: string;
    email?: string;
    website?: string;
    status: boolean;
    vendorId: string;
    planId: string;
    roleId?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface StorePaymentDetailsModel {
    id: string;
    storeId: string;
    paymentMethodId: string;
    accountNumber: string;
    accountName: string;
    accountType: string;
    isPrimary: boolean;
    createdAt: string;
    updatedAt?: string;
}

export interface PaymentAccountTypeModel {
    id: string;
    name: string;
    status: boolean;
    createdAt: string;
    updatedAt?: string;
}

export interface PaymentMethodModel {
    id: string;
    name: string;
    description?: string;
    fee: number;
    img?: string;
    status: boolean;
    accountTypeId: string;
    createdAt: string;
    updatedAt?: string;
}

export interface MarketingModel {
    id: string;
    name: string;
    description?: string;
    img?: string;
    status: boolean;
    vendorId: string;
    targetReach: number;
    currentReach: number;
    createdAt: string;
    updatedAt?: string;
}

export interface VendorModel {
    id: string;
    name: string;
    address: string;
    city: string;
    province: string;
    country: string;
    phone: string;
    email: string;
    status: boolean;
    isVerified: boolean;
    storeId: string;
    userId: string;
    roleId: string;
    createdAt: string;
    updatedAt?: string;
}

export interface VendorOrderModel {
    id: string;
    orderNo: string;
    orderDate: string;
    orderStatus: string;
    orderTotal: number;
    orderProductId?: string[];
    vendorId: string;
    userId: string;
    deliveryMethodId: string;
    paymentMethodId: string;
    createdAt: string;
    updatedAt?: string;
}

export interface VendorChatModel {
    id: string;
    userId: string;
    vendorId: string;
    message: string;
    status: boolean;
    createdAt: string;
    updatedAt?: string;
}

export interface VendorPromotionModel {
    id: string;
    name: string;
    description?: string;
    startDate: string;
    endDate?: string;
    img?: string;
    productId: string[];
    status: boolean;
    vendorId: string;
    createdAt: string;
    updatedAt?: string;
}

export interface VendorRevenueModel {
    id: string;
    name?: string;
    description?: string;
    status: boolean;
    vendorId: string;
    grossRevenue: number;
    netRevenue: number;
    deductionId: string[];
    createdAt: string;
    updatedAt?: string;
}

export interface VendorDeductionModel {
    id: string;
    name: string; // i.e. Tax, Delivery, Withdrawals, Service Fee, Payment Gateway Fee, etc.
    description?: string;
    status: boolean;
    vendorId: string;
    deductionAmount: number;
    createdAt: string;
    updatedAt?: string;
}

export interface ProductModel {
    id: string;
    title: string;
    description?: string;
    detailedDescription?: string;
    image?: string[];
    price: number;
    salePrice: number;
    quantity: number;
    warranty?: string;
    dateCreated: string;
    locationId?: string[];
    tagId?: string[];
    categoryId: string;
    brandId: string;
    colors?: string[];
    promotionId?: string[];
    vendorId: string;
    sku?: string;
    status: boolean;
}

export interface ProductCategoryModel {
    id: string;
    name: string;
    description?: string;
    status: boolean;
    img?: string;
    parentId?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface ProductTagModel {
    id: string;
    name: string;
    description?: string;
    status: boolean;
    createdAt: string;
    updatedAt?: string;
}

export interface ProductBrandModel {
    id: string;
    name: string;
    description?: string;
    status: boolean;
    img?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface ProductReviewModel {
    id: string;
    rating: number;
    comment: string;
    productId: string;
    authorId: string;
    dateCreated: string;
}

export interface UserModel {
    id: string;
    name: string;
    address: string;
    city: string;
    province: string;
    country: string;
    phone: string;
    email: string;
    profileImg?: string;
    status: boolean;
    isVerified: boolean;
    roleId: string;
    storeId?: string;
    createdAt: string;
    updatedAt?: string;
}