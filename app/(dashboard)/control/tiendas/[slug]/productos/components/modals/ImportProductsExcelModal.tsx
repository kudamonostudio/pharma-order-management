"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { importProductsFromExcel } from "@/app/actions/Products";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeSlug: string;
}

export function ImportProductsExcelModal({
  open,
  onOpenChange,
  storeSlug,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleImport = async () => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("El archivo no debe superar los 5MB");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("slug", storeSlug);

    const result = await importProductsFromExcel(formData);

    setLoading(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(
      `Se han importado ${result.count} productos`
    );

    onOpenChange(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cargar productos con Excel</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <input
              id="excel-upload"
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            <label htmlFor="excel-upload" className="block">
              <div className="cursor-pointer inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary/80 border">
                Seleccionar archivo
              </div>
            </label>

            {file && (
              <p className="text-sm text-muted-foreground truncate">
                {file.name}
              </p>
            )}
          </div>
          <div className="text-sm">
            <p className="font-semibold mb-2">Columnas requeridas:</p>
            <table className="w-full border text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-1">nombre *</th>
                  <th className="border p-1">descripcion</th>
                  <th className="border p-1">precio</th>
                </tr>
              </thead>
            </table>
            <p className="mt-2 text-muted-foreground">
              La cabecera es opcional.
            </p>
          </div>

          <Button
            onClick={handleImport}
            disabled={loading || !file}
            className="w-full"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Importar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
