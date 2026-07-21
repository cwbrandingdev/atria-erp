"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { redirect } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  function redirectToDashboard() {
    redirect("/dashboard");
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Faça login na sua conta</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Digite o e-mail da sua conta{" "}
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" placeholder="email@gmail.com" />
        </Field>
        <Field>
          <Input id="password" type="password" />
        </Field>
        <Field>
          <Button type="submit" onClick={redirectToDashboard}>
            Login
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
