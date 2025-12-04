export enum ReportTargetType {
    PRODUCT = 'Product',
    CREATOR = 'Creator',
}

export enum ProductReportReason {
    FAKE_MISLEADING = 'Fake / misleading content',
    WRONG_FILE = 'Wrong file',
    SCAM_NON_DELIVERY = 'Scam / non-delivery',
    COPYRIGHT_DMCA = 'Copyright / DMCA',
    INAPPROPRIATE_HARMFUL = 'Inappropriate / harmful content',
    PAYMENT_MANIPULATION = 'Payment manipulation',
}

export enum CreatorReportReason {
    ABUSIVE_BEHAVIOR = 'Abusive behavior',
    FRAUD = 'Fraud',
    REPEATED_VIOLATIONS = 'Repeated policy violations',
    IDENTITY_FRAUD = 'Identity fraud',
    SPAMMING = 'Spamming buyers',
}

export enum ReportStatus {
    PENDING = 'Pending',
    REVIEWED = 'Reviewed',
    RESOLVED = 'Resolved',
    DISMISSED = 'Dismissed',
}

export interface IReport {
    _id?: string;
    reporterId: string;
    targetType: ReportTargetType;
    targetId: string;
    reason: ProductReportReason | CreatorReportReason;
    description?: string;
    status: ReportStatus;
    createdAt?: Date;
    updatedAt?: Date;
}
