"use client";
import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { revalidatePath } from "next/cache";

const formSchema = z.object({
  email_address: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Must be 8 or more characters long" }),
});

const verificationFormSchema = z.object({
  code: z.string().min(6, { message: "Must be 6 or more characters long" }),
});

export default function SignUpForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email_address: "",
      password: "",
    },
  });

  const verificationForm = useForm<z.infer<typeof verificationFormSchema>>({
    resolver: zodResolver(verificationFormSchema),
    defaultValues: {
      code: "",
    },
  });

  const { isLoaded, signUp, setActive } = useSignUp();

  const [pendingVerification, setPendingVerification] = useState(false);
  const router = useRouter();
  // // start the sign up process.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress: values.email_address,
        password: values.password,
      });

      // send the email.
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // change the UI to our pending section.
      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      console.log(err.errors);
      if (err?.errors) {
        err.errors.forEach((error: any) => {
          form.setError(error?.meta?.paramName, {
            message: error.message || "Something went wrong.",
          });
        });
      }
    }
  };

  // This verifies the user using email code that is delivered.
  const onPressVerify = async (
    values: z.infer<typeof verificationFormSchema>,
  ) => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: values.code,
      });
      if (completeSignUp.status !== "complete") {
        /*  investigate the response, to see if there was an error
         or if the user needs to complete more steps.*/
        console.log(JSON.stringify(completeSignUp, null, 2));
      }
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.refresh();
        router.replace("/");
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      if (err?.errors) {
        err?.errors?.forEach((error: any) => {
          verificationForm.setError(error?.meta?.paramName, {
            message: error.message || "Something went wrong.",
          });
        });
      }
    }
  };

  return (
    <div className="container mx-auto mt-16 w-full lg:w-1/4">
      <Card>
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          {!pendingVerification && (
            <Form {...form}>
              <form
                className="mb-4 flex flex-col space-y-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="email_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Create an account</Button>
              </form>
            </Form>
          )}
          {pendingVerification && (
            // <div>
            //   <form>
            //     <input
            //       value={code}
            //       placeholder="Code..."
            //       onChange={(e) => setCode(e.target.value)}
            //     />
            //     <button onClick={onPressVerify}>Verify Email</button>
            //   </form>
            // </div>
            <Form {...verificationForm}>
              <form
                className="mb-4 flex flex-col space-y-4"
                onSubmit={verificationForm.handleSubmit(onPressVerify)}
              >
                <FormField
                  control={verificationForm.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Code</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter Vertification Code..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Verify Email</Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
