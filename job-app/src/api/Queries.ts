import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser, getSheets, addNewSheet, getJobApplications, addNewStatus } from "./Api";
import { LoginForm, LoginResponse } from "../Interface/Loginform";
import { Sheet, JobApplication, StatusUpdate } from "../Interface/Sheets";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: LoginForm) => loginUser(formData),
    onSuccess: (data: LoginResponse) => {
      localStorage.setItem('user', data.user);

      // Storing in React Query cache
      queryClient.setQueryData(['user'], {
        token: data.token,
        user: data.user,
        email: data.email,
      });
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
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:['job_applications']});
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