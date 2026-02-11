interface LocationMapProps {
  address: string;
  name?: string;
}

export function LocationMap({ address, name }: LocationMapProps) {
  const query = encodeURIComponent(name ? `${name}, ${address}` : address);

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <iframe
        title="Event Location"
        width="100%"
        height="300"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps/embed/v1/place?key=&q=${query}`}
        className="bg-neutral-100"
      />
      <div className="bg-white p-3 text-sm text-muted-foreground">
        {name && <p className="font-medium text-foreground">{name}</p>}
        <p>{address}</p>
      </div>
    </div>
  );
}
