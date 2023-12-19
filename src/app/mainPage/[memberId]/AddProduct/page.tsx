'use client'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import useProduct from "@/hooks/useProduct";

type Props = {
    params: {
        memberId: string,
    }
}

function AddProduct({ params: { memberId } }: Props) {
    
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productPrice, setProductPrice] = useState(0);
    const [productInventory, setProductInventory] = useState(0);
    const [productCategory, setProductCategory] = useState('');


    const {createProduct,loading} = useProduct();
    const handleSubmit = async () => {
        try {
            await createProduct({
                productName,
                description: productDescription,
                price: productPrice,
                inventory: productInventory,
                sellerID: memberId,
                categoryID: productCategory
            })
        }catch(e){
            console.error(e);
        }
    };

    return (
        <>
            <div className="w-200">
                <h1 className="m-4">Product Name</h1>
                <form onSubmit={handleSubmit}>
                <Input name="name" value={productName} onChange={(e) => setProductName(e.target.value)} className="m-4 w-1/2" placeholder="Enter product name"></Input>
                <h1 className="m-4">Product Description</h1>
                <textarea name="description" value={productDescription} onChange={(e)=>setProductDescription(e.target.value)} rows={4}
                    className="m-4 block p-2.5 w-1/2 text-sm text-gray-900 bg-gray-50 
                        rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500
                        dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                        dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter product description"></textarea>
                <h1 className="m-4">Price</h1>
                <Input name="price"  onChange={(e)=>setProductPrice(parseInt(e.target.value))} type="number" className="m-4 w-1/2" placeholder="Enter price"></Input>
                <h1 className="m-4">Inventory</h1>
                <Input name="inventory" onChange={(e) => setProductInventory(parseInt(e.target.value))} type="number" className="m-4 w-1/2" placeholder="Enter number in stock"></Input>
                <h1 className="m-4">Category</h1>
                <select onChange={(e) => setProductCategory(e.target.value)} className="m-4 w-1/2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                    focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 
                    dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value=''>---Choose a Category---</option>
                    <option value="009ae339-979c-45b3-94c5-e12f834aa860">Sports Equipment</option>
                    <option value="3598f340-5807-46bd-bde5-4710f9124469">Clothing</option>
                    <option value="4e84c72b-1bc8-4703-af0f-7306e770baa8">Electronics</option>
                    <option value="9d39ca6d-e533-4e39-b60f-056d587b9a23">Miscellaneous</option>
                    <option value="9dc6cc83-0440-4946-adea-0ac3bb187a74">Kitchen & Dining</option>
                    <option value="e1caf1ea-7fa5-48cd-a029-a3897a1c2260">Bath Supplies</option>
                </select>
                
                <Button disabled={loading} className="m-4">Add Product</Button>
                </form>
            </div>

        </>
    )
}

export default AddProduct;