"use client";
import { Dialog,DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger,DialogFooter, DialogHeader  } from "@/components/ui/dialog";

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
    productInv: number,
}

function Buy({userId,productId,productName,productPrice,productInv}: Props) {
    const [quantity, setQuantity] = useState<number>(0);
    const [location, setLocation] = useState<string>('');
    const [delivery, setDelivery] = useState<boolean>(true);

    const {postOrder,loading} = useOrder();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(productInv < quantity)
        {
            alert('Cannot buy more than inventory!!');
            return null;
        }

        try {
            await postOrder({
                productId,
                quantity,
                buyerId:userId,
                location,
                delivery,
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
        <DialogContent className="sm:max-w-[850px]">
        <DialogHeader>
            <DialogTitle>Buy {productName} NOW !!!</DialogTitle>
            <DialogDescription>
            Please enter how many you want and press Submit.
            </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">

        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
                Quantity
            </Label>
            <Input
                id="name"
                type="text"
                placeholder="Input number here..."
                onChange={(e)=> {setQuantity(parseInt(e.target.value));}}
                className="col-span-3"
            />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
                {delivery && "Meeting Location"}
                {!delivery && "Freight Location"}
            </Label>
            <Input
                id="name"
                type="text"
                placeholder="Input the location here..."
                onChange={(e)=> {setLocation(e.target.value);}}
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
            <DialogClose>
            <div className="object-center absolute left-5">
                Looking for {delivery && "freight"} {!delivery && "face to face"}?
            <Button className="mx-5" onClick={() => setDelivery(!delivery)}>Here</Button>
            </div>
            <form onSubmit={handleSubmit}>
            <Button type="submit" disabled={loading} >Submit</Button>
            </form>
            </DialogClose>
        </DialogFooter>
        </DialogContent>
    </Dialog>

    )
    
}

export default Buy;

