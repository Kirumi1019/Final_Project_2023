'use client'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import useReport from "@/hooks/useReport";

type Props = {
    params: {
        memberId: string,
    }
}

function AddProduct({ params: { memberId } }: Props) {


    const [reportName, setReportNameChange] = useState('');
    const handleReportNameChange = (e) => {
      setReportNameChange(e.target.value);
    }
    const [reportDescription, setReportDescriptionChange] = useState('');
    const handleReportDescriptionChange = (e) => {
      setReportDescriptionChange(e.target.value);
    }

    const {postReport,loading} = useReport();
    const handleSubmit = async () => {
        try {
            await postReport({
                reporterID: memberId,
                reportDescription: reportDescription,
                suspectID: reportName,
            })
        }catch(e){
            console.error(e);
        }
    };

    return (
        <>
            <div className="w-200">
                <h1 className="m-4">Member ID</h1>
                <form onSubmit={handleSubmit}>
                <Input name="name" value={reportName} onChange={handleReportNameChange} className="m-4 w-1/2" placeholder="Enter memberID"></Input>
                <h1 className="m-4">Report Description</h1>
                <textarea name="description" value={reportDescription} onChange={handleReportDescriptionChange} rows={4}
                    className="m-4 block p-2.5 w-1/2 text-sm text-gray-900 bg-gray-50 
                        rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500
                        dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                        dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter report description"></textarea>
                
                <Button disabled={loading} className="m-4">Submit</Button>
                </form>
            </div>

        </>
    )
}

export default AddProduct;