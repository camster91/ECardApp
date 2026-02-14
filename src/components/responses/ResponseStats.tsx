"use client";

import type { RSVPResponse } from "@/types/database";

interface ResponseStatsProps {
  responses: RSVPResponse[];
}

export function ResponseStats({ responses }: ResponseStatsProps) {
  const total = responses.length;
  const attending = responses.filter((r) => r.status === "attending").length;
  const notAttending = responses.filter((r) => r.status === "not_attending").length;
  const maybe = responses.filter((r) => r.status === "maybe").length;
  const attendingResponses = responses.filter((r) => r.status === "attending");
  const totalHeadcount = attendingResponses.reduce((sum, r) => sum + r.headcount, 0);

  const totalAdults = attendingResponses.reduce(
    (sum, r) => sum + (parseInt(String(r.response_data?.adult_count ?? "0"), 10) || 0),
    0
  );
  const totalChildren = attendingResponses.reduce(
    (sum, r) => sum + (parseInt(String(r.response_data?.child_count ?? "0"), 10) || 0),
    0
  );
  const hasAgeCounts = totalAdults > 0 || totalChildren > 0;

  const stats = [
    { label: "Total Responses", value: total, color: "bg-brand-500" },
    { label: "Attending", value: attending, color: "bg-accent-green" },
    { label: "Not Attending", value: notAttending, color: "bg-accent-red" },
    { label: "Maybe", value: maybe, color: "bg-accent-amber" },
  ];

  // Simple donut chart
  const chartSize = 120;
  const strokeWidth = 20;
  const radius = (chartSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const segments = [
    { count: attending, color: "#22c55e" },
    { count: notAttending, color: "#ef4444" },
    { count: maybe, color: "#f59e0b" },
  ];

  let offset = 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border bg-white p-4"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
        <div className="col-span-2 rounded-lg border border-border bg-white p-4">
          <p className="text-sm text-muted-foreground">Total Headcount (Attending)</p>
          <p className="mt-1 text-2xl font-bold">{totalHeadcount}</p>
          {hasAgeCounts && (
            <p className="mt-1 text-sm text-muted-foreground">
              Adults: {totalAdults} &middot; Children: {totalChildren}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center rounded-lg border border-border bg-white p-6">
        {total === 0 ? (
          <p className="text-sm text-muted-foreground">No responses yet</p>
        ) : (
          <div className="text-center">
            <svg
              width={chartSize}
              height={chartSize}
              viewBox={`0 0 ${chartSize} ${chartSize}`}
              className="mx-auto"
            >
              <circle
                cx={chartSize / 2}
                cy={chartSize / 2}
                r={radius}
                fill="none"
                stroke="#e5e5e5"
                strokeWidth={strokeWidth}
              />
              {segments.map((seg, i) => {
                if (seg.count === 0) return null;
                const segmentLength = (seg.count / total) * circumference;
                const currentOffset = offset;
                offset += segmentLength;
                return (
                  <circle
                    key={i}
                    cx={chartSize / 2}
                    cy={chartSize / 2}
                    r={radius}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                    strokeDashoffset={-currentOffset}
                    transform={`rotate(-90 ${chartSize / 2} ${chartSize / 2})`}
                  />
                );
              })}
              <text
                x={chartSize / 2}
                y={chartSize / 2}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-foreground text-2xl font-bold"
                fontSize="24"
              >
                {total}
              </text>
            </svg>
            <div className="mt-3 flex justify-center gap-4 text-xs">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-accent-green" />
                Attending
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-accent-red" />
                Declined
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-accent-amber" />
                Maybe
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
