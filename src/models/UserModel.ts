export interface IUserStore {
    storeName: string;
    storeId: string;
    evaStoreId: string;
    storeType: number;
    region: string;
    paidStatus: number;
    pricingStatus: number;
    paidDate: Date; // İsterseniz bu kısımları date tipine çevirebilirsiniz
    reimbursementPackageTrialEndDate: Date; // Aynı şekilde date tipine çevrilebilir
    linkedDate: Date; // Aynı şekilde date tipine çevrilebilir
    marketplaceName: string;
    marketplaceCode: string;
    enableRepricing: boolean;
}

export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    countryCode: string;
    callingCode: string;
    telephoneNumber: string;
    isAdmin: string;
    store: IUserStore[];
}