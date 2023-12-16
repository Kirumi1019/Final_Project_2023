"use client";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger,DialogFooter, DialogHeader  } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";

import useOrder from "@/hooks/useOrder";

type Props = {
    productId: string,
    productName: string,
    productPrice: number,
    userId: string,
}

function Buy({userId,productId,productName,productPrice}: Props) {
    const [quantity, setQuantity] = useState<number>(0);

    const {postOrder,loading} = useOrder();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        try {
            await postOrder({
                productId,
                quantity,
                buyerId:userId,
            })
        }catch(e){
            console.error(e);
            alert("Error posting tweet");
        }
    };

    return (
        <Dialog>
        <DialogTrigger asChild>
        <Button variant="outline">Buy</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
            <DialogTitle>Buy {productName} NOW !!!</DialogTitle>
            <DialogDescription>
            Please enter how many you want and press Submit.
            </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">

            <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
                Number
            </Label>
            <Input
                id="name"
                type="text"
                defaultValue={quantity}
                onChange={(e)=> {setQuantity(parseInt(e.target.value));}}
                className="col-span-3"
            />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
                Total Cost: {productPrice * quantity}
            </Label>
            
            </div>
        </div>
        <DialogFooter>
            <Button type="submit" disabled={loading}>Save changes</Button>
        </DialogFooter>
        </form>
        </DialogContent>
    </Dialog>

    )
    
}

export default Buy;

