export function formatDate(dateInput: Date | string | number): string {
  const date = new Date(dateInput);
  const day = date.getDate();
  const month = date.toLocaleString("es-ES", { month: "short" });
  const year = date.getFullYear();
  return `${day}-${capitalize(month)}-${year}`;
}

export function formatDateTime(dateInput: Date | string | number): string {
  const date = new Date(dateInput);
  const datePart = formatDate(date);
  const timePart = date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${datePart} ${timePart}`;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
