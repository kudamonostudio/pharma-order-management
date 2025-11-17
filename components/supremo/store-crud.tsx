"use client";

import { useEffect, useState } from "react";
import { createStore, updateStore, deleteStore } from "@/app/actions/Store";

type StoreLite = {
  id: number;
  name: string;
  address: string;
  phone: string | null;
  slug?: string;
};

export function StoreCrud() {
  const [stores, setStores] = useState<StoreLite[]>([]);
  const [editing, setEditing] = useState<StoreLite | null>(null);

  async function fetchStores() {
    const res = await fetch("/api/stores");
    const json = await res.json();
    setStores(Array.isArray(json) ? json : []);
  }

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <div className="w-full space-y-10">
      {/* CREATE / UPDATE FORM */}
      <form
        action={editing ? updateStore.bind(null, editing.id) : createStore}
        className="p-4 border rounded space-y-3"
      >
        <h2 className="font-bold text-xl">
          {editing ? "Editar Tienda" : "Crear Tienda"}
        </h2>

        <input
          name="name"
          placeholder="Nombre"
          defaultValue={editing?.name || ""}
          className="border p-2 rounded w-full"
          required
        />

        <input
          name="address"
          placeholder="Dirección"
          defaultValue={editing?.address || ""}
          className="border p-2 rounded w-full"
          required
        />

        <input
          name="phone"
          placeholder="Teléfono"
          defaultValue={editing?.phone || ""}
          className="border p-2 rounded w-full"
        />

        {!editing && (
          <input
            name="slug"
            placeholder="slug-ejemplo"
            className="border p-2 rounded w-full"
            required
          />
        )}

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {editing ? "Actualizar" : "Crear"}
        </button>

        {editing && (
          <button
            type="button"
            onClick={() => setEditing(null)}
            className="ml-2 px-4 py-2 rounded border"
          >
            Cancelar
          </button>
        )}
      </form>

      {/* TABLE LIST */}
      <div>
        <h2 className="text-xl font-bold mb-4">Tiendas Registradas</h2>

        <table className="w-full text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Dirección</th>
              <th className="p-2 border">Teléfono</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {stores.map((store) => (
              <tr key={store.id}>
                <td className="p-2 border">{store.id}</td>
                <td className="p-2 border">{store.name}</td>
                <td className="p-2 border">{store.address}</td>
                <td className="p-2 border">{store.phone || "-"}</td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => setEditing(store)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                  >
                    Editar
                  </button>

                  <form action={deleteStore.bind(null, store.id)} className="inline">
                    <button className="px-3 py-1 bg-red-600 text-white rounded">
                      Eliminar
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
