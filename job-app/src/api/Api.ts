import { LoginForm, LoginResponse } from "../Interface/Loginform";
import axios, { Axios } from "axios";
import Sheet from "../Interface/Sheets";

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
      sheetId: sheet.sheet_id || '',
      spreadsheetName: sheet.spreadsheet_name || '',
      numberOfEntries: sheet.number_of_entries || 0,
      dateCreated: sheet.date_created,
      dateUpdated: sheet.date_updated
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
