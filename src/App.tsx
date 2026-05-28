import { useState } from 'react'
import Header from './components/Header'
import ZScoreForm from './components/ZScoreForm'
import ZScoreResult from './components/ZScoreResult'
import { computeZScore } from './utils/altmanZScore'
import type { ZScoreInputs, ZScoreResult as ZScoreResultType } from './types'

export default function App() {
  const [result, setResult] = useState<ZScoreResultType | null>(null)

  function handleCalculate(inputs: ZScoreInputs) {
    setResult(computeZScore(inputs))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Page title — HOMNOX "Asset Intake" style */}
        <div className="mb-8 pl-3 border-l-2 border-teal-500">
          <h1 className="text-lg font-semibold text-gray-900">Probability of Default</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Subject model · Altman Z-Score (1968 / 1983) · Pre-loaded for analysis
          </p>
        </div>

        <div className={`grid gap-6 ${result ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-2xl'}`}>
          <ZScoreForm onCalculate={handleCalculate} />
          {result && <ZScoreResult result={result} />}
        </div>

        {!result && (
          <div className="mt-8 card max-w-2xl">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">About the Model</h3>
            <div className="space-y-2 text-xs text-gray-500 leading-relaxed">
              <p>
                The <strong className="text-gray-700">Altman Z-Score</strong> is a multivariate financial formula developed in 1968 to predict the probability of a company entering bankruptcy within two years.
              </p>
              <p>
                It combines five financial ratios — liquidity, profitability, leverage, solvency, and activity — weighted by coefficients derived from discriminant analysis of real corporate data.
              </p>
              <p>
                The <strong className="text-gray-700">Z'-Score</strong> variant (1983) adapts the model for private companies by substituting market value of equity with book value.
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 mt-16 py-6 text-center text-xs text-gray-400">
        HOM Analytics · Probability of Default · Altman Z-Score · {new Date().getFullYear()}
      </footer>
    </div>
  )
}
