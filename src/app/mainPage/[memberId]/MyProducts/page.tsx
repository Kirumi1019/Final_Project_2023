import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { getMyProducts } from "../../_components/actions";
import Entry from "./entry";

type Props = {
  params: {
      memberId: string,
  }
}

async function MyProducts({ params: { memberId } }: Props) {
  const dbProduct = await getMyProducts(memberId);
  return (
    <>
        
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Product Name</TableHead>
          <TableHead>Product Description</TableHead>
          <TableHead className="w-[100px]">Product Price</TableHead>
          <TableHead className="w-[100px]">Product Inventory</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dbProduct?.map((myProduct) => (
          <Entry key={myProduct.productID} productID={myProduct.productID}
            description={myProduct.description} price={myProduct.price} 
            inventory={myProduct.inventory} productName={myProduct.productName}/>
        ))}
      </TableBody>
    </Table>
      </>
  );
}
export default MyProducts;
