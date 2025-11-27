import { useState, useEffect } from 'react';
import ModuleService from '@/services/moduleService';
import { useAuth } from '@/hooks/useAuth';



interface AnalysisData {
    reportId?: string;
    fileName: string;
    fileSize: number;
    analysisData: any;
    createdAt?: string;
    updatedAt?: string;
}

interface UseAnalysisManagerReturn {
    saveAnalysis: (fileName: string, fileSize: number, analysisData: any) => Promise<boolean>;
    loadLatestAnalysis: () => Promise<any>;
    hasExistingAnalysis: boolean;
    isLoading: boolean;
}

export const useAnalysisManager = (): UseAnalysisManagerReturn => {
    const { userDetail } = useAuth();
    const [hasExistingAnalysis, setHasExistingAnalysis] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkExistingAnalysis();
    }, []);

    const checkExistingAnalysis = async () => {
        if (!userDetail?.id) {
            setIsLoading(false);
            return;
        }
        
        try {
            const response = await ModuleService.analysis.getLatest();
            setHasExistingAnalysis(!!response.data);
        } catch (error) {
            setHasExistingAnalysis(false);
        } finally {
            setIsLoading(false);
        }
    };

    const saveAnalysis = async (fileName: string, fileSize: number, analysisData: any): Promise<boolean> => {
        if (!userDetail?.id) return false;

        try {
            setIsLoading(true);
            const data: AnalysisData = {
                fileName,
                fileSize,
                analysisData
            };

            await ModuleService.analysis.create(data);
            setHasExistingAnalysis(true);
            return true;
        } catch (error) {
            console.error('Error saving analysis:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const loadLatestAnalysis = async () => {
        if (!userDetail?.id) return null;

        try {
            setIsLoading(true);
            const response = await ModuleService.analysis.getLatest();
            return response.data?.analysisData || null;
        } catch (error) {
            console.error('Error loading analysis:', error);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        saveAnalysis,
        loadLatestAnalysis,
        hasExistingAnalysis,
        isLoading
    };
};