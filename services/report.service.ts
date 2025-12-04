import api from '@/lib/api';
import { IReport } from '@/types/report.interface';

export const submitReport = async (reportData: Partial<IReport>): Promise<IReport> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
        _id: "mock-report-id",
        ...reportData,
        status: "Pending",
        createdAt: new Date(),
        updatedAt: new Date()
    } as IReport;
};
