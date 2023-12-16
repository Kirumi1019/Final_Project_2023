import { auth } from "@/lib/auth";
import { publicEnv } from "@/lib/env/public";
import { redirect } from "next/navigation";

async function Transactions() {
  const session = await auth();
  if (!session || !session?.user?.id) {
    redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
  }
  const userId = session.user.id;
    return (
      <div>
        <h1>Transactions</h1>
        <h1>{userId}</h1>
        
      </div>
    );
  }
  export default Transactions;
  