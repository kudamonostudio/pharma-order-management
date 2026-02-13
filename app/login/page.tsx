import LoginForm from "@/components/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen bg-neutral-950 p-12 justify-end">
      {/* Right side - Form */}
      <div className="flex w-full max-w-2xl items-center justify-center p-8 rounded-md bg-white">
        <Card className="border-none shadow-none w-4/5 h-full flex flex-col gap-12 justify-center text-center">
          <CardHeader className="p-0!">
            <Image
              src="/authlogo.webp"
              alt="App Logo"
              width={180}
              height={180}
              className="mx-auto py-4"
            />
            <CardTitle className="text-4xl">Bienvenido de nuevo!</CardTitle>
            <CardDescription className="text-lg">
              Ingresa tus credenciales para acceder a tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0!">
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
