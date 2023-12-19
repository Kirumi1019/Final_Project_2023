"use client";

import { Button } from "@/components/ui/button"

import useComplete from "@/hooks/useComplete";
import { useState } from 'react';

type Props = {
    orderId: string,
    transactionStatus: string,
}

function Complete({orderId,transactionStatus}: Props) {
    const {postComplete,loading} = useComplete();

    const [complete, setComplete] = useState<string>(transactionStatus);

    const handleClick = async () => {
        if (complete === "Underway") {
            await postComplete({
                orderId,
                transactionStatus: "Complete",
            });
        
            setComplete("Complete");
        } 
        
        else {
            await postComplete({
                orderId,
                transactionStatus: "Underway",
            });
            setComplete("UnderWay");
        
        }
    };

    return (
        <form onSubmit={handleClick}>
            <Button disabled={loading} variant="ghost">To {transactionStatus === "Complete" ? "Underway" : "Complete"}</Button>
        </form>
        
    )
    
}

export default Complete;

