interface JobApplication {
    jobId: string;
    position: string;
    company: string;
    status: string;
    dateApplied: string;
}

interface Sheet {
    sheetId: string;
    spreadsheetName: string;
    numberOfEntries: number;
    dateCreated: string;
    dateUpdated: string;
    jobApplications: JobApplication[];
}

export default Sheet;