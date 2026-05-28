import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts'
import type { ZScoreResult } from '../types'
import { zoneColors, formatNumber } from '../utils/altmanZScore'

interface Props {
  result: ZScoreResult
}

const COMPONENTS = [
  { key: 'x1' as const, label: 'X₁', name: 'Working Capital / Total Assets' },
  { key: 'x2' as const, label: 'X₂', name: 'Retained Earnings / Total Assets' },
  { key: 'x3' as const, label: 'X₃', name: 'EBIT / Total Assets' },
  { key: 'x4' as const, label: 'X₄', name: 'Equity / Liabilities' },
  { key: 'x5' as const, label: 'X₅', name: 'Sales / Total Assets' },
]

const WEIGHTS_PUBLIC  = { x1: 1.2,   x2: 1.4,   x3: 3.3,   x4: 0.6,  x5: 1.0   }
const WEIGHTS_PRIVATE = { x1: 0.717, x2: 0.847, x3: 3.107, x4: 0.420, x5: 0.998 }

function ScoreGauge({ score, zone }: { score: number; zone: ZScoreResult['zone'] }) {
  const colors = zoneColors(zone)
  const normalised = Math.min(Math.max((score / 5) * 100, 0), 100)
  const data = [{ value: normalised, fill: colors.bar }]

  return (
    <div className="relative flex items-center justify-center" style={{ height: 180 }}>
      <ResponsiveContainer width="100%" height={180}>
        <RadialBarChart innerRadius="60%" outerRadius="90%" startAngle={200} endAngle={-20} data={data}>
          <RadialBar dataKey="value" cornerRadius={6} background={{ fill: '#E5E7EB' }} />
          <Tooltip formatter={(v: number) => [`${(v / 20).toFixed(2)}`, 'Z-Score']} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className={`text-4xl font-bold tabular-nums ${colors.text}`}>
          {formatNumber(score)}
        </span>
        <span className={`text-xs font-medium mt-1 px-2 py-0.5 rounded-full border ${colors.badge}`}>
          {zone === 'safe' ? 'Safe Zone' : zone === 'grey' ? 'Grey Zone' : 'Distress Zone'}
        </span>
      </div>
    </div>
  )
}

export default function ZScoreResult({ result }: Props) {
  const { score, components, zone, description, defaultProbability, inputs } = result
  const colors = zoneColors(zone)
  const weights = inputs.companyType === 'public' ? WEIGHTS_PUBLIC : WEIGHTS_PRIVATE

  const safeThreshold     = inputs.companyType === 'public' ? 2.99 : 2.9
  const distressThreshold = inputs.companyType === 'public' ? 1.81 : 1.23

  return (
    <div className="space-y-4">
      {/* Main result card */}
      <div className={`card border-2 ${colors.border} ${colors.bg}`}>
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              {inputs.companyName || 'Company'}{' '}
              <span className="text-gray-400 font-normal">· FY{inputs.fiscalYear}</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5 capitalize">
              {inputs.companyType} company — Altman {inputs.companyType === 'public' ? 'Z-Score' : "Z'-Score"}
            </p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full border font-medium ${colors.badge}`}>
            PD: {defaultProbability}
          </span>
        </div>

        <ScoreGauge score={score} zone={zone} />

        <p className={`text-sm text-center mt-2 font-medium ${colors.text}`}>{description}</p>

        {/* Threshold bar */}
        <div className="mt-4">
          <div className="h-2 rounded-full bg-gray-200 relative overflow-hidden">
            <div className="absolute left-0 top-0 h-full bg-red-300 rounded-full" style={{ width: `${(distressThreshold / 5) * 100}%` }} />
            <div className="absolute left-0 top-0 h-full bg-amber-300 rounded-full" style={{ width: `${(safeThreshold / 5) * 100}%` }} />
            <div className="absolute left-0 top-0 h-full bg-emerald-300 rounded-full" style={{ width: `${(safeThreshold / 5) * 100}%` }} />
            <div
              className="absolute top-0 h-full w-1 bg-gray-700 rounded"
              style={{ left: `${Math.min((score / 5) * 100, 98)}%` }}
              title={`Z = ${score.toFixed(2)}`}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0</span>
            <span className="text-red-500">{distressThreshold}</span>
            <span className="text-amber-500">{safeThreshold}</span>
            <span>5+</span>
          </div>
        </div>
      </div>

      {/* Component breakdown */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Component Breakdown</h3>
        <div className="space-y-3">
          {COMPONENTS.map(({ key, label, name }) => {
            const ratio   = components[key]
            const weight  = weights[key]
            const weighted = ratio * weight
            return (
              <div key={key} className="grid grid-cols-12 items-center gap-2 text-xs">
                <div className="col-span-1 font-mono text-gray-400">{label}</div>
                <div className="col-span-4 text-gray-500 truncate">{name}</div>
                <div className="col-span-2 text-right font-mono text-gray-700">{ratio.toFixed(4)}</div>
                <div className="col-span-1 text-center text-gray-400">×</div>
                <div className="col-span-1 font-mono text-teal-600">{weight}</div>
                <div className="col-span-1 text-center text-gray-400">=</div>
                <div className={`col-span-2 text-right font-mono font-semibold ${weighted >= 0 ? 'text-gray-900' : 'text-red-500'}`}>
                  {weighted.toFixed(4)}
                </div>
              </div>
            )
          })}

          <div className="border-t border-gray-200 pt-3 grid grid-cols-12 items-center gap-2 text-xs">
            <div className="col-span-9 text-right text-gray-500 font-medium">Z-Score</div>
            <div className="col-span-1 text-center text-gray-400">=</div>
            <div className={`col-span-2 text-right font-mono text-base font-bold ${colors.text}`}>
              {formatNumber(score)}
            </div>
          </div>
        </div>
      </div>

      {/* Thresholds */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Score Thresholds</h3>
        <div className="space-y-2">
          {inputs.companyType === 'public' ? (
            <>
              <ThresholdRow color="emerald" label="Safe Zone"     range="Z > 2.99"        active={zone === 'safe'}     />
              <ThresholdRow color="amber"   label="Grey Zone"     range="1.81 ≤ Z ≤ 2.99" active={zone === 'grey'}     />
              <ThresholdRow color="red"     label="Distress Zone" range="Z < 1.81"         active={zone === 'distress'} />
            </>
          ) : (
            <>
              <ThresholdRow color="emerald" label="Safe Zone"     range="Z' > 2.9"          active={zone === 'safe'}     />
              <ThresholdRow color="amber"   label="Grey Zone"     range="1.23 ≤ Z' ≤ 2.9"  active={zone === 'grey'}     />
              <ThresholdRow color="red"     label="Distress Zone" range="Z' < 1.23"          active={zone === 'distress'} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function ThresholdRow({ color, label, range, active }: { color: string; label: string; range: string; active: boolean }) {
  const dot: Record<string, string> = {
    emerald: 'bg-emerald-500',
    amber:   'bg-amber-500',
    red:     'bg-red-500',
  }
  return (
    <div className={`flex items-center gap-3 text-xs rounded-lg px-3 py-2 transition-colors ${active ? 'bg-gray-100' : ''}`}>
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${dot[color]}`} />
      <span className="text-gray-700 font-medium w-28">{label}</span>
      <span className="text-gray-400 font-mono">{range}</span>
      {active && <span className="ml-auto text-gray-500 text-[10px] font-medium uppercase tracking-wide">Current</span>}
    </div>
  )
}
