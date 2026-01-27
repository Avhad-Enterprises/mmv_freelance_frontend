export interface Career {
    job_id: number;
    title: string;
    short_description: string;
    office_location: string;
    detail_description: string;
    job_details: string;
    apply_link: string;
    company_logo?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CareersResponse {
    success: boolean;
    data: Career[];
    message?: string;
}
