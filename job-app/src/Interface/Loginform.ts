export interface LoginForm {
  email: string;
  password: string;
}

export interface TokenInfo {
  access: string;
  refresh: string;
}

export interface Spreadsheet {
  sheet_id: string;
  spreadsheet_name: string;
  number_of_entries: number;
  date_created: string;
  date_updated: string;
}

export interface UserData {
  token: TokenInfo;
  user: string;
  spreadsheets: Spreadsheet[];
}

export interface LoginResponse {
  tokens: TokenInfo;
  user: string;
  email: string;
  spreadsheets: Spreadsheet[];
}