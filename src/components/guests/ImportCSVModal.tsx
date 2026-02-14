'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { X, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ParsedGuest {
  name: string;
  email: string;
  phone: string;
  notes: string;
  valid: boolean;
  error?: string;
}

interface ImportCSVModalProps {
  open: boolean;
  onClose: () => void;
  eventId: string;
  onSuccess: () => void;
}

type Step = 'upload' | 'preview' | 'importing' | 'done';

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        fields.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
  }
  fields.push(current.trim());
  return fields;
}

function detectColumns(headers: string[]): { name: number; email: number; phone: number; notes: number } {
  const lower = headers.map((h) => h.toLowerCase().replace(/[^a-z]/g, ''));
  const find = (keywords: string[]) =>
    lower.findIndex((h) => keywords.some((k) => h.includes(k)));

  return {
    name: Math.max(0, find(['name', 'fullname', 'guest'])),
    email: find(['email', 'mail']),
    phone: find(['phone', 'tel', 'mobile', 'cell']),
    notes: find(['note', 'comment', 'memo', 'message']),
  };
}

export function ImportCSVModal({ open, onClose, eventId, onSuccess }: ImportCSVModalProps) {
  const [step, setStep] = useState<Step>('upload');
  const [guests, setGuests] = useState<ParsedGuest[]>([]);
  const [result, setResult] = useState<{ imported: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function reset() {
    setStep('upload');
    setGuests([]);
    setResult(null);
    setError(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split(/\r?\n/).filter((l) => l.trim());
      if (lines.length < 2) {
        setError('CSV must have a header row and at least one data row.');
        return;
      }

      const headers = parseCSVLine(lines[0]);
      const cols = detectColumns(headers);
      const parsed: ParsedGuest[] = [];

      for (let i = 1; i < lines.length; i++) {
        const fields = parseCSVLine(lines[i]);
        const name = (fields[cols.name] || '').trim();
        const email = cols.email >= 0 ? (fields[cols.email] || '').trim() : '';
        const phone = cols.phone >= 0 ? (fields[cols.phone] || '').trim() : '';
        const notes = cols.notes >= 0 ? (fields[cols.notes] || '').trim() : '';

        if (!name) {
          parsed.push({ name, email, phone, notes, valid: false, error: 'Name is required' });
        } else if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          parsed.push({ name, email, phone, notes, valid: false, error: 'Invalid email' });
        } else {
          parsed.push({ name, email, phone, notes, valid: true });
        }
      }

      setGuests(parsed);
      setError(null);
      setStep('preview');
    };
    reader.readAsText(file);
  }

  async function handleImport() {
    const validGuests = guests.filter((g) => g.valid);
    if (validGuests.length === 0) return;

    setStep('importing');
    setError(null);

    try {
      const res = await fetch(`/api/events/${eventId}/guests/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          validGuests.map(({ name, email, phone, notes }) => ({ name, email, phone, notes }))
        ),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Import failed');
      }

      const data = await res.json();
      setResult(data);
      setStep('done');
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
      setStep('preview');
    }
  }

  if (!open) return null;

  const validCount = guests.filter((g) => g.valid).length;
  const invalidCount = guests.filter((g) => !g.valid).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-xl rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Import Guests from CSV</h2>
          <button onClick={handleClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5">
          {/* Upload step */}
          {step === 'upload' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Upload a CSV file with columns: <strong>name</strong>, <strong>email</strong>, <strong>phone</strong>, <strong>notes</strong>.
                Only &quot;name&quot; is required.
              </p>
              <div
                onClick={() => fileRef.current?.click()}
                className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-gray-300 p-8 transition-colors hover:border-indigo-400 hover:bg-indigo-50/30"
              >
                <Upload className="h-10 w-10 text-gray-400" />
                <p className="text-sm font-medium text-gray-600">Click to select a CSV file</p>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFile}
                className="hidden"
              />
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Preview step */}
          {step === 'preview' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-green-700">{validCount} valid</span>
                {invalidCount > 0 && (
                  <span className="text-red-600">{invalidCount} invalid (will be skipped)</span>
                )}
              </div>

              <div className="max-h-64 overflow-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">Name</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">Email</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {guests.map((g, i) => (
                      <tr key={i} className={g.valid ? '' : 'bg-red-50'}>
                        <td className="px-3 py-1.5">{g.name || '—'}</td>
                        <td className="px-3 py-1.5 text-gray-500">{g.email || '—'}</td>
                        <td className="px-3 py-1.5">
                          {g.valid ? (
                            <span className="text-green-600">OK</span>
                          ) : (
                            <span className="text-red-600">{g.error}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={reset}>Back</Button>
                <Button onClick={handleImport} disabled={validCount === 0}>
                  Import {validCount} Guest{validCount !== 1 ? 's' : ''}
                </Button>
              </div>
            </div>
          )}

          {/* Importing step */}
          {step === 'importing' && (
            <div className="flex flex-col items-center gap-3 py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
              <p className="text-sm text-gray-600">Importing guests...</p>
            </div>
          )}

          {/* Done step */}
          {step === 'done' && result && (
            <div className="flex flex-col items-center gap-3 py-8">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
              <p className="text-lg font-semibold text-gray-900">
                {result.imported} guest{result.imported !== 1 ? 's' : ''} imported!
              </p>
              <Button onClick={handleClose}>Done</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
