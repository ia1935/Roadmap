import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser, getSheets, addNewSheet } from "./Api";
import { LoginForm, LoginResponse } from "../Interface/Loginform";
import Sheet from "../Interface/Sheets";


export function useLogin(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:(formData:LoginForm) => loginUser(formData),
        onSuccess: (data:LoginResponse) => {

           
            localStorage.setItem('user', data.user);
            

            //storing in react query cache
            queryClient.setQueryData(['user'],{
                token:data.token,
                user:data.user,
                email:data.email,
            }
            );
            queryClient.setQueryData(['spreadsheets'],data.spreadsheets);


            
        }
    })
}

export function useFetchSheets(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:(userId:string) => getSheets(userId),
        onSuccess:(data:Sheet[]) => {
            // Store the entire array in the cache
            queryClient.setQueryData(['spreadsheets'], data);
        }
    });
}


export function useAddSheet(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, sheetName }: { userId: string; sheetName: string }) => 
            addNewSheet(userId, sheetName),
        onSuccess:(newSheet:Sheet) => { // Changed from Sheet[] to any to handle single object
            // Store the entire array in the cache
            const existingSheets = queryClient.getQueryData<Sheet[]>(['spreadsheets']) || [];

            // Add the newly created sheet to the existing sheets array
            const updatedSheets = [...existingSheets, newSheet];
            // console.log("Updated sheets:", updatedSheets);

            queryClient.setQueryData(['spreadsheets'], updatedSheets);
        }
    });
}
