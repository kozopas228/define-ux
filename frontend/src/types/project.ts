export interface Project {
    PK: string;
    SK: string;
    CREATED_AT: number;
    UPDATED_AT: number;
    name: string;
    description?: string;
    competitorAnalysisThumbnailPath?: string;
    empathyMapThumbnailPath?: string;
    uxPersonaThumbnailPath?: string;
}
