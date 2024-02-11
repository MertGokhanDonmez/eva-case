export interface IStoreModel {
    storeName: string;
    storeId: string;
    evaStoreId: string;
    storeType: number;
    region: string;
    paidStatus: number;
    pricingStatus: number;
    paidDate: Date; // $date-time formatına uyacak şekilde güncellenmelidir
    reimbursementPackageTrialEndDate: Date; // $date-time formatına uyacak şekilde güncellenmelidir
    linkedDate: Date; // $date-time formatına uyacak şekilde güncellenmelidir
    marketplaceName: string;
    marketplaceCode: string;
    enableRepricing: boolean;
}