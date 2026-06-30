/**
 * Navbar
 * Top-level header bar showing the patient context / branding.
 * Props:
 *   patientName  – string shown as the active patient label
 */
export default function Navbar({ patientName = 'Personal Info' }) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
      {/* Brand / logo */}
      <div className="flex items-center gap-3">
        {/* Icon placeholder – swap with your actual logo */}
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
          <span className="text-white text-xs font-bold">HP</span>
        </div>
        <span className="text-gray-900 font-semibold text-lg tracking-tight">
          HealthPharm
        </span>
        <span className="hidden sm:inline text-gray-300 mx-1">|</span>
        <span className="hidden sm:inline text-gray-500 text-sm">
          Dietitian Dashboard
        </span>
      </div>

      {/* Active patient label */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-blue-600 text-xs font-semibold">P</span>
        </div>
        <span className="text-sm font-medium text-gray-700">{patientName}</span>
      </div>
    </header>
  )
}
