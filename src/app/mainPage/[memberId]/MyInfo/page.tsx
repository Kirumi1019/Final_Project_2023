import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { getMyinfo } from "../../_components/actions";
import Entry from "./entry";
import { db } from "@/db";

type Props = {
  params: {
      memberId: string,
  }
}

async function MyInfo({ params: { memberId } }: Props) {
  const dbInfo = await getMyinfo(memberId);
  return (
    <>
        
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead >Real Name</TableHead>
          <TableHead >Username</TableHead>
          <TableHead >Password</TableHead>
          <TableHead >Phone Number</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dbInfo?.map((info) => (
          <Entry key={info.schoolID} schoolId={info.schoolID} realname={info.name} password={info.password}
           phone={info.phone} username={info.username}
            />
        ))}
      </TableBody>
    </Table>
      </>
  );
}
export default MyInfo;
