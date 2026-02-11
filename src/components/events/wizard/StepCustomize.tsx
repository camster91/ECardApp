'use client';

import type { EventCustomization } from './WizardContainer';

interface StepCustomizeProps {
  customization: EventCustomization;
  onUpdate: (field: keyof EventCustomization, value: unknown) => void;
}

const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Courier', label: 'Courier' },
];

const BUTTON_STYLE_OPTIONS = [
  { value: 'rounded', label: 'Rounded' },
  { value: 'pill', label: 'Pill' },
  { value: 'square', label: 'Square' },
];

export default function StepCustomize({ customization, onUpdate }: StepCustomizeProps) {
  const buttonBorderRadius =
    customization.buttonStyle === 'pill'
      ? '9999px'
      : customization.buttonStyle === 'square'
        ? '0px'
        : '8px';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Customize Appearance</h2>
        <p className="mt-1 text-sm text-gray-500">
          Personalize the look and feel of your event page.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Left column: Controls */}
        <div className="space-y-5">
          {/* Primary Color */}
          <div>
            <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">
              Primary Color
            </label>
            <div className="mt-1.5 flex items-center gap-3">
              <input
                id="primaryColor"
                type="color"
                value={customization.primaryColor}
                onChange={(e) => onUpdate('primaryColor', e.target.value)}
                className="h-10 w-10 cursor-pointer rounded-lg border border-gray-300"
              />
              <input
                type="text"
                value={customization.primaryColor}
                onChange={(e) => onUpdate('primaryColor', e.target.value)}
                className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {/* Background Color */}
          <div>
            <label htmlFor="backgroundColor" className="block text-sm font-medium text-gray-700">
              Background Color
            </label>
            <div className="mt-1.5 flex items-center gap-3">
              <input
                id="backgroundColor"
                type="color"
                value={customization.backgroundColor}
                onChange={(e) => onUpdate('backgroundColor', e.target.value)}
                className="h-10 w-10 cursor-pointer rounded-lg border border-gray-300"
              />
              <input
                type="text"
                value={customization.backgroundColor}
                onChange={(e) => onUpdate('backgroundColor', e.target.value)}
                className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {/* Font Family */}
          <div>
            <label htmlFor="fontFamily" className="block text-sm font-medium text-gray-700">
              Font Family
            </label>
            <select
              id="fontFamily"
              value={customization.fontFamily}
              onChange={(e) => onUpdate('fontFamily', e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            >
              {FONT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Button Style */}
          <div>
            <label htmlFor="buttonStyle" className="block text-sm font-medium text-gray-700">
              Button Style
            </label>
            <select
              id="buttonStyle"
              value={customization.buttonStyle}
              onChange={(e) => onUpdate('buttonStyle', e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            >
              {BUTTON_STYLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Show Countdown Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-700">Show Countdown Timer</span>
              <p className="text-xs text-gray-500">Display a countdown to the event date</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={customization.showCountdown}
              onClick={() => onUpdate('showCountdown', !customization.showCountdown)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                customization.showCountdown ? 'bg-indigo-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                  customization.showCountdown ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Right column: Live Preview */}
        <div>
          <p className="mb-3 text-sm font-medium text-gray-700">Live Preview</p>
          <div
            className="overflow-hidden rounded-xl border border-gray-200 p-6"
            style={{
              backgroundColor: customization.backgroundColor,
              fontFamily: customization.fontFamily,
            }}
          >
            <h3
              className="text-lg font-bold"
              style={{ color: customization.primaryColor }}
            >
              Event Title
            </h3>
            <p className="mt-2 text-sm" style={{ color: '#6b7280' }}>
              Saturday, March 15, 2025
            </p>
            <p className="mt-1 text-sm" style={{ color: '#6b7280' }}>
              Grand Ballroom, 123 Main St
            </p>

            {customization.showCountdown && (
              <div className="mt-4 flex gap-3">
                {['12', '05', '30', '45'].map((val, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center rounded-lg p-2"
                    style={{ backgroundColor: `${customization.primaryColor}15` }}
                  >
                    <span
                      className="text-lg font-bold"
                      style={{ color: customization.primaryColor }}
                    >
                      {val}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {['Days', 'Hrs', 'Min', 'Sec'][i]}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              className="mt-4 w-full px-4 py-2 text-sm font-medium text-white"
              style={{
                backgroundColor: customization.primaryColor,
                borderRadius: buttonBorderRadius,
              }}
            >
              RSVP Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
