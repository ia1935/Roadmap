import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser, getSheets, addNewSheet, getJobApplications, addNewStatus,
    createNewJob} from "./Api";
import { LoginForm, LoginResponse, TokenInfo } from "../Interface/Loginform";
import { Sheet, JobApplication, StatusUpdate } from "../Interface/Sheets";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: LoginForm) => loginUser(formData),
    onSuccess: (data: LoginResponse) => {
      localStorage.setItem('user', data.user);

      queryClient.setQueryData(['user'], {
        token: data.tokens,
        user: data.user,
      });
      console.log("queries.ts",data.spreadsheets)
      queryClient.setQueryData(['spreadsheets'], data.spreadsheets);
    },
  });
}

export function useFetchSheets() {
  return (userId: string) => getSheets(userId);
}

export function useAddSheet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, sheetName }: { userId: string; sheetName: string }) =>
      addNewSheet(userId, sheetName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spreadsheets'] });
    },
  });
}

export function useFetchJobApplications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ user_id, sheet_id }: { user_id: string; sheet_id: string }) =>
      getJobApplications(user_id, sheet_id),
    onSuccess: (data, variables) => {
      // Store the job applications in the cache
      queryClient.setQueryData(['job_applications', variables.sheet_id], data.jobApplications);
      
      // Also store the spreadsheet name in the cache
      queryClient.setQueryData(['spreadsheets', variables.sheet_id], data.spreadsheetName);
      
      // Invalidate the job_applications query to trigger a refetch if needed
      queryClient.invalidateQueries({ queryKey: ['job_applications'] });
    },
  });
}

export function useAddNewStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      user_id,
      sheet_id,
      job_id,
      status
    }: {
      user_id: string;
      sheet_id: string;
      job_id: string;
      status: StatusUpdate;
    }) => addNewStatus(user_id, sheet_id, job_id, status),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['jobApplications', variables.sheet_id] 
      });
      
    //   console.log("Status update successful, refreshing data");
    },
    onError: (error) => {
      console.error("Status update failed:", error);
    }
  });
}

export function useCreateNewJob(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ user_id, sheet_id, job_data }: 
            { 
            user_id: string, 
            sheet_id: string, 
            job_data: JobApplication 
            }) => createNewJob(user_id, sheet_id, job_data),
            onSuccess:(_data,variables) =>{
                queryClient.invalidateQueries({
                    queryKey:['jobApplications',variables.sheet_id]
                });
                // console.log("success, refreshing data");
            },
            onError:(error) =>{
                console.error("Status update failed:", error);
            }
    });
    
}