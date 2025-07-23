"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { signInAction, signUpAction } from "@/actions/auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { FirebaseError } from "firebase/app";

interface AuthFormProps {
  type: "signin" | "signup";
}

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
  displayName: z.string().optional(),
});

export function AuthForm({ type }: AuthFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      displayName: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "signup") {
        if (!values.displayName) {
          form.setError("displayName", { type: "manual", message: "Display name is required for sign up." });
          return;
        }
        await signUpAction({
          email: values.email,
          password: values.password,
          displayName: values.displayName,
        });
        toast({
          title: "Account Created",
          description: "Welcome! You can now sign in.",
        });
      } else {
        await signInAction({
          email: values.email,
          password: values.password,
        });
        toast({
          title: "Signed In",
          description: "Welcome back!",
        });
        // Force a full page reload to ensure auth state is updated and redirection occurs.
        window.location.href = "/dashboard";
      }
    } catch (error) {
        let errorMessage = "An unknown error occurred.";
        if (error instanceof FirebaseError) {
            switch (error.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                    errorMessage = 'Invalid email or password. Please try again.';
                    break;
                case 'auth/email-already-in-use':
                    errorMessage = 'This email is already registered. Please sign in.';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'The password is too weak. Please choose a stronger password.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Please enter a valid email address.';
                    break;
                default:
                    errorMessage = 'An unexpected authentication error occurred. Please try again later.';
                    break;
            }
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: errorMessage,
      });
    }
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4 pt-6">
            {type === "signup" && (
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
               {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {type === "signup" ? "Create Account" : "Sign In"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
