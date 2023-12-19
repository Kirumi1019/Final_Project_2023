"use client"
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import useMember from "@/hooks/useMember";

import {
  TableCell,
  TableRow,
} from "@/components/ui/table"

import { useState } from "react";

type Props = {
  schoolId: string
  realname: string;
  password: string;
  phone: string;
  username: string;
}

function Entry(info: Props) {
  
    const [phone, setPhone] = useState(info.phone);
    const [realname, setRealName] = useState(info.realname);
    const [password, setPassword] = useState(info.password);
    const [username, setUserName] = useState(info.username);
    const {updateMember,loading}= useMember();
    

    const handleSubmit = async () => {
      
      try {
          await updateMember({
            schoolId: info.schoolId,
            realname,
            password,
            phone,
            username
          })
      }catch(e){
          console.error(e);
    }
    }
  
    return (
      <>
      
      
        <TableRow key={info.schoolId}>
          <TableCell className="font-medium">
                  <TextField
                required
                id={'Name'+info.username}
                defaultValue={info.realname}
                onChange={(e) => {setRealName(e.target.value)}}
              />
          </TableCell>
          <TableCell>
            <TextField className="w-full"
                required
                id={'userName'+info.username}
                defaultValue={info.username}
                onChange={(e) => {setUserName(e.target.value)}}
              />
          </TableCell>
          <TableCell>
            <TextField
                required
                id={'password'+info.username}
                defaultValue={info.password}
                onChange={(e) => {setPassword(e.target.value)}}
              />
          </TableCell>
          <TableCell>
            <TextField
                required
                id={'phone'+info.username}
                defaultValue={info.phone}
                onChange={(e) => {setPhone(e.target.value)}}
              />
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
  