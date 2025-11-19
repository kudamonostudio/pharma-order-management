import TiendasContent from "./Content";

export default async function TiendasPage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/stores`, { 
    cache: 'no-store' 
  });
  
  const stores = res.ok ? await res.json() : [];

  return <TiendasContent stores={stores} />;
}
