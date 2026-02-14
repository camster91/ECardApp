interface LocationMapProps {
  address: string;
  name?: string;
}

export function LocationMap({ address, name }: LocationMapProps) {
  const query = encodeURIComponent(name ? `${name}, ${address}` : address);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <iframe
        title="Event Location"
        width="100%"
        height="300"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=-180,-90,180,90&layer=mapnik&marker=0,0`}
        className="bg-neutral-100"
      />
      <div className="flex items-center justify-between bg-white p-3 text-sm text-muted-foreground">
        <div>
          {name && <p className="font-medium text-foreground">{name}</p>}
          <p>{address}</p>
        </div>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-700"
        >
          Get Directions
        </a>
      </div>
    </div>
  );
}
