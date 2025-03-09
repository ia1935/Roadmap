import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useFetchSheets, useAddSheet } from '../api/Queries';
import Header from '../Components/Header';
import Sheet from '../Interface/Sheets';
import AddForm from '../Components/SheetForm/Form';

function Home(){
    const [spreadsheets, setSpreadsheets] = useState<Sheet[]>([]);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [sheetName, setSheetName] = useState('');
    // Add a state to track if we need to refetch
    const [refetchNeeded, setRefetchNeeded] = useState(false);
    
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const fetchSheets = useFetchSheets();
    const addSheet = useAddSheet();
    
    const cachedSpreadsheets = queryClient.getQueryData(['spreadsheets']);
    const cachedUserData = queryClient.getQueryData(['user']);
    
    // Get userId from localStorage
    const userId = localStorage.getItem('user');
    
    useEffect(() => {
      // Check if cache exists AND has items
      if (cachedSpreadsheets && Array.isArray(cachedSpreadsheets) && cachedSpreadsheets.length > 0 && !refetchNeeded) {
        // Use cached data - handle both snake_case and camelCase formats
        const transformedData = cachedSpreadsheets.map(sheet => ({
          // If the data already has camelCase format, use it directly; otherwise, transform from snake_case
          sheetId: sheet.sheetId || sheet.sheet_id || '',
          spreadsheetName: sheet.spreadsheetName || sheet.spreadsheet_name || '',
          numberOfEntries: sheet.numberOfEntries || sheet.number_of_entries || 0,
          dateCreated: sheet.dateCreated ? sheet.dateCreated.split('T')[0] : 
                       sheet.date_created ? sheet.date_created.split('T')[0] : '',
          dateUpdated: sheet.dateUpdated ? sheet.dateUpdated.split('T')[0] : 
                       sheet.date_updated ? sheet.date_updated.split('T')[0] : '',
        }));
        // console.log("Using cached data:", transformedData);
        setSpreadsheets(transformedData);
      } else {
        console.log("Empty or no cached data, refetch needed.");
        // Fetch from API if we have a userId
        if (userId) {
          fetchSheetsData(userId);
          // Reset the refetch flag after fetch initiation
          setRefetchNeeded(false);
        } else {
          console.error("No user ID available, cannot fetch spreadsheets");
        }
      }
    }, [cachedSpreadsheets, refetchNeeded, userId]);

    const fetchSheetsData = async (userid: string) => {
      try {
        const data = await fetchSheets.mutateAsync(userid);
        // console.log("Fetched spreadsheets", data);
        
        // After a successful fetch, we should update the cache
        // This is now done in the useFetchSheets hook onSuccess callback
      } catch(error) {
        console.error("Error fetching spreadsheets: ", error);
      }
    };
    
    const handleCreateSheet = (e: React.FormEvent) => {
      e.preventDefault();
      
      //call api
      if (!userId) {
        console.error("No user ID available, cannot add sheet");
        return;
      }
      addSheet.mutate({ userId, sheetName },
        {onSuccess: (data) =>{

          const updatedSheets = queryClient.getQueryData<Sheet[]>(['spreadsheets']) || [];
          setSpreadsheets(updatedSheets);
          // console.log("Sheet added successfully: ", updatedSheets);

          setIsPopupVisible(false);
          setSheetName('');
        },
        onError: (error) =>{
          console.error("Sheet add failed: ", error);
        }
    });
      
      
    };
    
    const handleSheetClick = (sheetId:string) =>{
        navigate(`/sheet/${sheetId}`);
    };

    return (
        <div className="bg-gray-100 h-screen flex flex-col">
            <Header />
            
            {/* Header with button */}
            <div className="flex justify-between items-center p-4">
                <h1 className="text-2xl font-bold">Your Sheets:</h1>
                <button
                    onClick={() => setIsPopupVisible(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-300"
                >
                    Add Sheet
                </button>
            </div>
            
            {/* Popup Form */}
            {isPopupVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                        <h2 className="text-xl font-bold mb-4">Create New Sheet</h2>
                        
                        <form onSubmit={handleCreateSheet}>
                            <div className="mb-4">
                                <label htmlFor="spreadsheetName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Spreadsheet Name
                                </label>
                                <input
                                    type="text"
                                    id="spreadsheetName"
                                    name="spreadsheetName"
                                    value={sheetName}
                                    onChange={(e) => setSheetName(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter spreadsheet name"
                                    required
                                />
                            </div>
                            
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsPopupVisible(false)}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition-colors duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-300"
                                >
                                    Create Sheet
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {/* Display spreadsheets or loading state */}
            <div className="p-4 flex-1 overflow-y-auto rounded-lg shadow-md bg-gray-100">
                {fetchSheets.isPending && <p>Loading spreadsheets...</p>}
                
                {!fetchSheets.isPending && spreadsheets.length > 0 ? (
                    spreadsheets.map((spreadsheet, index) => (
                        <div 
                            key={index} 
                            className="bg-white p-4 rounded-lg shadow-md mb-4 hover:bg-gray-300"
                            onClick={() => handleSheetClick(spreadsheet.sheetId)}
                        >
                            <h2 className="text-xl font-bold mb-2">{spreadsheet.spreadsheetName}</h2>
                            <div className="flex justify-between">
                                <p className="mr-4">Entries: {spreadsheet.numberOfEntries}</p>
                                <p className="mr-4">Created: {spreadsheet.dateCreated}</p>  
                                <p>Updated: {spreadsheet.dateUpdated}</p>
                            </div>
                        </div>
                    ))
                ) : (!fetchSheets.isPending && 
                    <p>No spreadsheets available</p>
                )}
            </div>
        </div>
    );
}

export default Home;