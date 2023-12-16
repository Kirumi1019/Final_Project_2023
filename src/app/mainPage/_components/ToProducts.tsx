import { Button } from "@/components/ui/button";
import Link from "next/link";

function ToProducts() {
  return (
    <div className="w-full">
      <Link href={'/mainPage/Products'}>
        <Button>Products</Button>
      </Link>
    </div>
  );
}

export default ToProducts;
