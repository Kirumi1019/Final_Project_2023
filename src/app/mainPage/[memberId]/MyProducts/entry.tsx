"use client"
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import useProduct from "@/hooks/useProduct";

import {
  TableCell,
  TableRow,
} from "@/components/ui/table"

import { useState } from "react";

type Props = {
  productName: string;
  description: string | null;
  price: number;
  inventory: number | null;
  productID: string;
}

function Entry(myProduct: Props) {
  
    const [productName, setProductName] = useState('');
    const handleProductNameChange = (e) => {
      setProductName(e.target.value);
    }
    const [productDescript, setProductDescript] = useState('');
    const handleProductDescriptChange = (e) => {
      setProductDescript(e.target.value);
    }
    const [productInv, setProductInv] = useState(0);
    const handleProductInvChange = (e) => {
      setProductInv(e.target.value);
    }
    const [productPrice, setProductPrice] = useState(0);
    const handleProductPriceChange = (e) => {
      setProductPrice(e.target.value);
    }
  
    const {updateProduct,loading,deleteProduct}= useProduct();
    
    const handleDelete = async () => {
      try {
        await deleteProduct({
            productId: myProduct.productID,
        })
      }catch(e){
          console.error(e);
  }
    }

    const handleSubmit = async () => {
      
      try {
          await updateProduct({
              productId: myProduct.productID,
              productName,
              productDescription: productDescript,
              productPrice,
              productInv
          })
      }catch(e){
          console.error(e);
    }
    }
  
    return (
      <>
      
      
        <TableRow key={myProduct.productID}>
          <TableCell className="font-medium">
                  <TextField
                required
                id={'Product Name'+myProduct.productID}
                defaultValue={myProduct.productName}
                onChange={handleProductNameChange}
              />
          </TableCell>
          <TableCell>
            <TextField className="w-full"
                required
                id={'Product Description'+myProduct.productID}
                defaultValue={myProduct.description}
                onChange={handleProductDescriptChange}
              />
          </TableCell>
          <TableCell>
            <TextField
                required
                id={'Product Price'+myProduct.productID}
                defaultValue={myProduct.price}
                onChange={handleProductPriceChange}
              />
          </TableCell>
          <TableCell>
            <TextField
                required
                id={'Product Quantity'+myProduct.productID}
                defaultValue={myProduct.inventory}
                onChange={handleProductInvChange}
              />
          </TableCell>
          <TableCell>
            <Button disabled={loading} onClick={handleDelete} variant="outlined" startIcon={<DeleteIcon />}>
                Delete
            </Button>
          </TableCell>
          <TableCell>
            
            <Button disabled={loading} onClick={handleSubmit} variant="outlined"
              endIcon={<SendIcon />}>
              {loading && ('Updating...')}
              {!loading && ('Send')}
            </Button>
          </TableCell>
          
        </TableRow>
        
        </>
    );
  }
  export default Entry;
  