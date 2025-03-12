// Define a status update type to track each stage of the application


export interface StatusUpdate {
    status_id?:string;
    status_type: string;
    date?: string;
    comments: string;
}
export interface JobApplication {
    job_id?: string;
    position: string;
    company: string;
    location: string;
    status: StatusUpdate[]; 
    date_applied?: any;
    date_updated?: string;
}
export interface Sheet {
    sheet_id: string;
    spreadsheet_name: string;
    number_of_entries: number;
    date_created: string;
    date_updated: string;
    job_applications: JobApplication[];
}







