import { getProducts } from "../_components/actions";

const products = await getProducts();

function Products() {
    return (
      <div>
        <h1>Products</h1>
        {products.map((product)=>{
          return <div>{product.productID} / {product.productName}</div>
        })}
      </div>
    );
  }
  export default Products;
  