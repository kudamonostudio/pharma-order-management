function StoreContainer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto">{children}</div>
    </div>
  );
}

export default StoreContainer;
