export interface LoginForm {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: string;  // If this is a user ID string
  email: string;
  spreadsheets: any[];  // Consider creating a proper interface for spreadsheets
}