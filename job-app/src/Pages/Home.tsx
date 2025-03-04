import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';


import Header from '../Components/Header';
import Sheet from '../Interface/Sheets';

function Home(){
    const [spreadsheets, setSpreadsheets] = useState<Sheet[]>([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        fetch('/Mockdata/mock.json')
      .then(response => response.json())
      .then(data => setSpreadsheets(data.spreadsheets));
  }, []);
    console.log(spreadsheets);

    const handleSheetClick = (sheetId:string) =>{
        navigate(`/sheet/${sheetId}`);
    };


    return (
        <div className="bg-gray-100 h-screen flex flex-col">
          <Header/>
          <h1 className="text-2xl p-4 rounded-b-lg font-bold ">Job Sheets:</h1>
      <div className="p-4 flex-1 overflow-y-auto rounded-lg shadow-md bg-gray-100" >
        {spreadsheets.map((spreadsheet, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md mb-4 hover:bg-gray-300"
              onClick={() => handleSheetClick(spreadsheet.sheetId)}>
                <h2 className="text-xl font-bold mb-2">{spreadsheet['Spreadsheet Name']}</h2>
                <div className="flex justify-between">
                  <p className="mr-4">Entries: {spreadsheet["Number of entries"]}</p>
                  <p className="mr-4">Created: {spreadsheet["Date Created"]}</p>  
                  <p>Updated: {spreadsheet["Date Updated"]}</p>
                </div>
              </div>
            ))}
      </div>
        </div>
    );
}

export default Home;