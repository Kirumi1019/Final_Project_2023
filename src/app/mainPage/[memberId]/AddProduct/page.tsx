import { createProduct } from "../../_components/actions";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { publicEnv } from "@/lib/env/public";
import { auth } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { getCategories } from "../../_components/actions";

async function AddProduct() {
    const session = await auth();
    if (!session || !session?.user?.id) {
        redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
    }
    const userId = session.user.id;
    const categories = await getCategories();

    return (
        <>
            <div className="w-200">
                <h1 className="m-4">Product Name</h1>
                <Input className="m-4 w-1/2" placeholder="Enter product name"></Input>
                <h1 className="m-4">Product Description</h1>
                <textarea rows={4}
                    className="m-4 block p-2.5 w-1/2 text-sm text-gray-900 bg-gray-50 
                        rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500
                        dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                        dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter product description"></textarea>
                <h1 className="m-4">Price</h1>
                <Input type="number" className="m-4 w-1/2" placeholder="Enter price"></Input>
                <h1 className="m-4">Inventory</h1>
                <Input type="number" className="m-4 w-1/2" placeholder="Enter number in stock"></Input>
                <h1 className="m-4">Category</h1>
                <select className="m-4 w-1/2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                    focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 
                    dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    {categories.map((category)=>{
                        return(
                            <option value = {category.categoryID}>{category.categoryName}</option>
                        )
                    })}
                </select>
            </div>
            <form
                action={
                    async () => {
                        "use server";
                        await createProduct(userId, "newProductName", "newProductDescription", 100, 1, "009ae339-979c-45b3-94c5-e12f834aa860");
                        revalidatePath('/MyProducts')
                    }
                }>
                <Button className="m-4">Add Product</Button>
            </form>
        </>
    )
}

export default AddProduct;