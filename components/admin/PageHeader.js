export default function PageHeader({ title, description, action }) {
  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="font-display text-3xl tracking-wide text-bone-50">{title}</h1>
        {description ? <p className="mt-1 text-sm text-bone-500">{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
