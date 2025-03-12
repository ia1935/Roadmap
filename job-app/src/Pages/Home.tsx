import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { useFetchSheets, useAddSheet, useFetchJobApplications } from '../api/Queries';
import Header from '../Components/Header';

function Home() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [sheetName, setSheetName] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userId = localStorage.getItem('user');

  const fetchSheets = useFetchSheets();

  const { data: spreadsheets = [], isLoading: isFetchingSheets } = useQuery({
    queryKey: ['spreadsheets', userId],
    queryFn: () => fetchSheets(userId as string),
    enabled: !!userId
  });

  const addSheetMutation = useAddSheet();

  const handleCreateSheet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      console.error('No user ID available, cannot add sheet');
      return;
    }
    addSheetMutation.mutate(
      { userId, sheetName },
      {
        onSuccess: () => {
          setIsPopupVisible(false);
          setSheetName('');
        },
        onError: (error) => {
          console.error('Sheet add failed: ', error);
        }
      }
    );
  };

  const handleSheetClick = (sheetId: string) => {
    if (!userId) {
      console.error('No user ID available, cannot add sheet');
      return;
    }
    navigate(`/sheet/${sheetId}`);
  };

  return (
    <div className="bg-gray-100 h-screen flex flex-col">
      <Header />
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">Your Sheets:</h1>
        <button
          onClick={() => setIsPopupVisible(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-300"
        >
          Add Sheet
        </button>
      </div>
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
      <div className="p-4 flex-1 overflow-y-auto rounded-lg shadow-md bg-gray-100">
        {isFetchingSheets && <p>Loading spreadsheets...</p>}
        {!isFetchingSheets && spreadsheets.length > 0 ? (
          spreadsheets.map((spreadsheet, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md mb-4 hover:bg-gray-300"
              onClick={() => handleSheetClick(spreadsheet.sheet_id)}
            >
              <h2 className="text-xl font-bold mb-2">{spreadsheet.spreadsheet_name}</h2>
              <div className="flex justify-between">
                <p className="mr-4">Entries: {spreadsheet.number_of_entries}</p>
                <p className="mr-4">Created: {spreadsheet.date_created}</p>
                <p>Updated: {spreadsheet.date_updated}</p>
              </div>
            </div>
          ))
        ) : (
          !isFetchingSheets && <p>No spreadsheets available</p>
        )}
      </div>
    </div>
  );
}

export default Home;

