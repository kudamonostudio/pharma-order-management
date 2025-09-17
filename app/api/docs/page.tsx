"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

import "swagger-ui-react/swagger-ui.css";

export default function DocsPage() {
  if (process.env.NODE_ENV === "production") {
    return <h1>Documentación no disponible en producción</h1>;
  }

  return <SwaggerUI url="/api/openapi" />;
}
