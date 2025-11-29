interface EmptyStateProps {
  text: string;
}

function EmptyState({ text }: EmptyStateProps) {
  return (
    <div className="w-full py-20 flex flex-col items-center">
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
}

export { EmptyState }
