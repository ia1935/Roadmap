import { LoginForm, LoginResponse } from "../Interface/Loginform";
import axios, { Axios } from "axios";
import { JobApplication, Sheet } from "../Interface/Sheets";
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
    const response = await axios.post(`${api_url}spreadsheets/`, { user_id: userId });
    
    return Array.isArray(response.data) ? response.data.map(sheet => ({
      sheet_id: sheet.sheet_id || '',
      spreadsheet_name: sheet.spreadsheet_name || '',
      number_of_entries: sheet.number_of_entries || 0,
      date_created: sheet.date_created,
      date_updated: sheet.date_updated,
      job_applications: sheet.job_applications || []
    })) : [];
    
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
    return data;
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