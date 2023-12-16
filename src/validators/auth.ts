import { z } from "zod";

export const authSchema = z.object({
  // Sign in doesn't require a username, but sign up does.
  schoolID: z.string().length(9,{message: "Please enter your school number!"}),
  name: z.string().max(20, {message: "Name should be less than 20 characters!"})
    .optional(),
  phone: z.string().max(10,{message:"Phone number should be 10 digits!"}).optional(), // phone number length will report error
  username: z.string().max(20,{message:"Username cannot be over 20 characters!"})
    .optional(),
  password: z.string().max(20,{message:"Password should be less than 20 characters!"}),
});
