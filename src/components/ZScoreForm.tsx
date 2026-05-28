import { useState } from 'react'
import type { ZScoreInputs, CompanyType } from '../types'

interface Props {
  onCalculate: (inputs: ZScoreInputs) => void
}

type FieldKey = keyof Omit<ZScoreInputs, 'companyType' | 'companyName' | 'fiscalYear'>

const FIELDS: { key: FieldKey; label: string; hint: string }[] = [
  { key: 'workingCapital',      label: 'Working Capital',                hint: 'Current Assets − Current Liabilities' },
  { key: 'totalAssets',         label: 'Total Assets',                   hint: 'Sum of all assets on balance sheet' },
  { key: 'retainedEarnings',    label: 'Retained Earnings',              hint: 'Cumulative undistributed earnings' },
  { key: 'ebit',                label: 'EBIT',                           hint: 'Earnings before interest and taxes' },
  { key: 'marketValueEquity',   label: 'Market / Book Value of Equity',  hint: 'Market cap (public) or book equity (private)' },
  { key: 'bookValueLiabilities',label: 'Book Value of Total Liabilities',hint: 'Total debt + other liabilities' },
  { key: 'sales',               label: 'Net Sales / Revenue',            hint: 'Total revenue for the period' },
]

const defaultValues: Omit<ZScoreInputs, 'companyType' | 'companyName' | 'fiscalYear'> = {
  workingCapital: 0, totalAssets: 0, retainedEarnings: 0,
  ebit: 0, marketValueEquity: 0, bookValueLiabilities: 0, sales: 0,
}

function formatWithCommas(val: number): string {
  if (val === 0) return ''
  const [int, dec] = String(val).split('.')
  const formattedInt = Number(int).toLocaleString('en-US')
  return dec !== undefined ? `${formattedInt}.${dec}` : formattedInt
}

export default function ZScoreForm({ onCalculate }: Props) {
  const [companyType, setCompanyType] = useState<CompanyType>('public')
  const [companyName, setCompanyName] = useState('')
  const [fiscalYear, setFiscalYear] = useState(String(new Date().getFullYear()))
  const [values, setValues] = useState(defaultValues)
  const [focused, setFocused] = useState<FieldKey | null>(null)

  function handleChange(key: FieldKey, raw: string) {
    const num = parseFloat(raw.replace(/,/g, ''))
    setValues(prev => ({ ...prev, [key]: isNaN(num) ? 0 : num }))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    onCalculate({ companyType, companyName, fiscalYear, ...values })
  }

  function handleReset() {
    setValues(defaultValues)
    setCompanyName('')
    setFiscalYear(String(new Date().getFullYear()))
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-6">
      <div className="pl-3 border-l-2 border-teal-500">
        <h2 className="text-sm font-semibold text-gray-900">Input Parameters</h2>
        <p className="text-xs text-gray-500 mt-0.5">Enter financial data in the same currency unit (thousands, millions, etc.).</p>
      </div>

      {/* Company info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-1">
          <label className="label-text">Company Name</label>
          <input
            className="input-field"
            type="text"
            placeholder="e.g. Acme Corp"
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
          />
        </div>
        <div>
          <label className="label-text">Fiscal Year</label>
          <input
            className="input-field"
            type="text"
            placeholder="2024"
            value={fiscalYear}
            onChange={e => setFiscalYear(e.target.value)}
          />
        </div>
        <div>
          <label className="label-text">Company Type</label>
          <div className="flex gap-1 mt-1">
            {(['public', 'private'] as CompanyType[]).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setCompanyType(t)}
                className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors capitalize
                  ${companyType === t
                    ? 'bg-teal-600 border-teal-500 text-white'
                    : 'bg-white border-gray-300 text-gray-500 hover:border-gray-400'
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Model info banner */}
      <div className="rounded-lg bg-teal-50 border border-teal-200 px-4 py-3 text-xs text-teal-800">
        {companyType === 'public' ? (
          <>
            <div><span className="font-semibold">Original Z-Score (1968):</span> Z = 1.2·X₁ + 1.4·X₂ + 3.3·X₃ + 0.6·X₄ + 1.0·X₅</div>
            <div className="mt-0.5">Safe: Z &gt; 2.99 &nbsp;|&nbsp; Grey: 1.81–2.99 &nbsp;|&nbsp; Distress: Z &lt; 1.81</div>
          </>
        ) : (
          <>
            <div><span className="font-semibold">Z'-Score — Private firms (1983):</span> Z' = 0.717·X₁ + 0.847·X₂ + 3.107·X₃ + 0.420·X₄ + 0.998·X₅</div>
            <div className="mt-0.5">Safe: Z' &gt; 2.9 &nbsp;|&nbsp; Grey: 1.23–2.9 &nbsp;|&nbsp; Distress: Z' &lt; 1.23</div>
          </>
        )}
      </div>

      {/* Financial inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {FIELDS.map(({ key, label, hint }) => (
          <div key={key}>
            <label className="label-text">{label}</label>
            <input
              className="input-field"
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={focused === key
                ? (values[key] === 0 ? '' : String(values[key]))
                : formatWithCommas(values[key])
              }
              onFocus={() => setFocused(key)}
              onBlur={() => setFocused(null)}
              onChange={e => handleChange(key, e.target.value)}
            />
            <p className="text-xs text-gray-400 mt-0.5">{hint}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
        >
          Calculate Z-Score
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 text-sm text-gray-500 hover:text-gray-700 bg-white hover:bg-gray-50 rounded-lg border border-gray-300 transition-colors"
        >
          Reset
        </button>
      </div>
    </form>
  )
}
