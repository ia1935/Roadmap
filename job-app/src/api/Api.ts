import { LoginForm, LoginResponse, TokenInfo } from "../Interface/Loginform";
import axios, { Axios } from "axios";
import { JobApplication, Sheet, StatusUpdate } from "../Interface/Sheets";
const api_url = 'http://127.0.0.1:8000/'

export const loginUser = async (formData: LoginForm): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${api_url}login/`, formData);
    const data = response.data;
    const loginResponse: LoginResponse = {
      tokens: data.tokens || '',
      user: data.user_id || data.user || '',
      email: data.email || formData.email,
      spreadsheets: data.user?.spreadsheets ||[]
    };
    console.log("api.ts sheets",loginResponse.spreadsheets);
    return loginResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    }
    throw error;
  }
};

export const getSheets = async (userId: string): Promise<Sheet[]> => {
  try {
    // console.log("inside getSheets")
    const response = await axios.post(`${api_url}spreadsheets/`, { user_id: userId });
    
    const sheetsArray = response.data.spreadsheets||[];
    // console.log("sheetsArray",sheetsArray)
    const value =  Array.isArray(sheetsArray) ? sheetsArray.map(sheet => ({
      sheet_id: sheet.sheet_id || '',
      spreadsheet_name: sheet.spreadsheet_name || '',
      number_of_entries: sheet.number_of_entries || 0,
      date_created: sheet.date_created.split('T')[0],
      date_updated: sheet.date_updated.split('T')[0],
      job_applications: sheet.job_applications || []
    })) : [];
    // console.log("return api",value)
    return value
    
  } catch (error) {
    // Error handling remains the same
    if (axios.isAxiosError(error)) {
      console.error("API error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    }
    throw error;
  }
};


export async function addNewSheet(userId: string, sheetName: string): Promise<Sheet> {
  try{
    const response = await axios.post(`${api_url}new_spreadsheet/`,{user_id:userId,spreadsheet_name:sheetName})
    //only returning a single sheet object
    const data = response.data;
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    }
    throw error;
  }
}


export async function getJobApplications(user_id: string, sheet_id: string): Promise<{ 
  jobApplications: JobApplication[], 
  spreadsheetName: string 
}> {
  try {
    const response = await axios.post(`${api_url}/job_applications/`, { user_id, sheet_id });
    const data = response.data;
    
    // Extract job applications
    const jobApplications = Array.isArray(data.job_applications) ? data.job_applications.map((job: JobApplication) => ({
      job_id: job.job_id,
      position: job.position,
      company: job.company,
      location: job.location,
      status: Array.isArray(job.status) ? job.status.map((status: any) => ({
        status_id:status.status_id,
        status_type: status.status_type,
        date: status.date_status,
        comments: status.comments,
      })) : [],
      date_applied: job.date_applied,
      date_updated: job.date_updated
    })) : [];
    
    const spreadsheetName = data.spreadsheet_name;
    // console.log(jobApplications)
    
    // Return both the job applications array and the spreadsheet name
    return {
      jobApplications,
      spreadsheetName
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    }
    throw error;
  }
}


export async function addNewStatus(
  user_id: string,
  sheet_id: string,
  job_id: string,
  status_info: StatusUpdate
): Promise<StatusUpdate> {
  try {
    // Extract the status values directly instead of nesting them
    const { status_type, comments } = status_info;
    
    // console.log("Sending status update:", {
    //   user_id,
    //   sheet_id,
    //   job_id,
    //   status_type,
    //   comments
    // });
    
    // Send the status properties directly in the request body
    // console.log(user_id,sheet_id,job_id,status_type,comments)
    const response = await axios.post(`${api_url}/new_job_application_status/`, {
      user_id,
      sheet_id,
      job_id,
      status_type,
      comments
    });
    
    const data = response.data;
    // console.log("Status update response:", data);
    
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    }
    throw error;
  }
}

export async function createNewJob(user_id: string,sheet_id: string, job_application_data: JobApplication): Promise<JobApplication> {
  try {
    // Extract the required fields
    // console.log("userid",user_id)
    // console.log("sheetid",sheet_id)
    const { position, company, location, date_applied } = job_application_data;
    
    // Create the request payload, conditionally including date_applied only if it has a value
    const requestPayload: any = {
      user_id,
      sheet_id,
      position,
      company,
      location
    };
    
    // Only include date_applied if it exists and isn't empty
    if (date_applied && date_applied !== '') {
      requestPayload.date_applied = date_applied;
    }
    
    // console.log("Sending job data:", requestPayload);
    
    const response = await axios.post(`${api_url}/new_job_application/`, requestPayload);
    const data = response.data;
    // console.log("DATA: ", data);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    }
    throw error;
  }
}

