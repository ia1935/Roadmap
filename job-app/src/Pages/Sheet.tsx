import { useParams } from "react-router-dom";
function Sheet(){
    const {sheetId} = useParams<{sheetId:string}>();
    return (
        <div>
            <h1>Sheet: {sheetId}</h1>
        </div>
    )
}

export default Sheet;