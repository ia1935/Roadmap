// Define a status update type to track each stage of the application


export interface StatusUpdate {
    statusType: string;
    date: string;
    comments: string;
    date_created:string;

}
export interface JobApplication {
    job_id: string;
    position: string;
    company: string;
    location: string;
    status: StatusUpdate[]; 
    date_applied: string;
    date_updated: string;
}
export interface Sheet {
    sheet_id: string;
    spreadsheet_name: string;
    number_of_entries: number;
    date_created: string;
    date_updated: string;
    job_applications: JobApplication[];
}







