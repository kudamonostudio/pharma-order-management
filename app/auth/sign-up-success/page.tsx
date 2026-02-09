import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center p-12">
      <div className="flex w-full max-w-2xl items-center justify-center p-8">
        <Card className="border-none shadow-none w-4/5 h-full flex flex-col gap-12 justify-center text-center">
          <CardHeader className="p-0!">
            <CardTitle className="text-4xl">
              ¡Gracias por registrarte!
            </CardTitle>
            <CardDescription className="text-lg">
              Revisa tu correo para confirmar
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0!">
            <p className="text-muted-foreground text-lg">
              Te has registrado exitosamente. Por favor revisa tu correo
              electrónico para confirmar tu cuenta antes de iniciar sesión.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
