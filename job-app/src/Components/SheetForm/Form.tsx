import { useState } from 'react';

interface AddFormProps {
    onAddSheet: (sheetName: string) => void;
}

export default function AddForm({ onAddSheet }: AddFormProps) {
    const [sheetName, setSheetName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddSheet(sheetName);
        setSheetName(''); // Clear the input field after submission
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Sheet Name"
                    value={sheetName}
                    onChange={(e) => setSheetName(e.target.value)}
                    className="border p-2 rounded-md mb-4"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                >
                    Add
                </button>
            </form>
        </div>
    );
}