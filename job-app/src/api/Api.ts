import { LoginForm, LoginResponse } from "../Interface/Loginform";
import axios, { Axios } from "axios";
import { JobApplication, Sheet, StatusUpdate } from "../Interface/Sheets";
const api_url = 'http://127.0.0.1:8000/'

export const loginUser = async (formData: LoginForm): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${api_url}login/`, formData);
    const data = response.data;
    const loginResponse: LoginResponse = {
      token: data.token || '',
      user: data.user_id || data.user || '',
      email: data.email || formData.email,
      spreadsheets: Array.isArray(data.spreadsheets) ? data.spreadsheets : []
    };
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


export async function getJobApplications(user_id:string,sheet_id:string): Promise<JobApplication[]>{
  try{
    const response = await axios.post(`${api_url}/job_applications/`,{user_id,sheet_id});
    const data = response.data;
    // console.log("DATA: ",data)
    const value = Array.isArray(data.job_applications) ? data.job_applications.map((job:JobApplication) => ({
      job_id:job.job_id,
      position:job.position,
      company:job.company,
      location:job.location,
      status: Array.isArray(job.status) ? job.status.map((status:any) => ({
        status_type:status.status_type,
        date:status.date_status,
        comments:status.comments,
      })) : [],
      date_applied:job.date_applied,
      date_updated:job.date_updated
    })) : [];
    // console.log("VALUE: ",value)
    return value;
  }catch(error){
    if(axios.isAxiosError(error)){
      console.error("API error:",{
        message:error.message,
        response:error.response?.data,
        status:error.response?.status
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