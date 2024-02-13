export interface IStoreModel {
    storeName: string;
    storeId: string;
    evaStoreId: string;
    storeType: number;
    region: string;
    paidStatus: number;
    pricingStatus: number;
    paidDate: Date;
    reimbursementPackageTrialEndDate: Date;
    linkedDate: Date; 
    marketplaceName: string;
    marketplaceCode: string;
    enableRepricing: boolean;
}