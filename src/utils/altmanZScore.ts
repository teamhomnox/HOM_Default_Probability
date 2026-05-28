import type { ZScoreInputs, ZScoreResult, ZScoreComponents, RiskZone } from '../types'

/**
 * Altman Z-Score (1968) — Public manufacturing companies
 *   Z = 1.2·X1 + 1.4·X2 + 3.3·X3 + 0.6·X4 + 1.0·X5
 *   Safe:     Z > 2.99
 *   Grey:     1.81 ≤ Z ≤ 2.99
 *   Distress: Z < 1.81
 *
 * Altman Z'-Score (1983) — Private companies
 *   Z' = 0.717·X1 + 0.847·X2 + 3.107·X3 + 0.420·X4 + 0.998·X5
 *   (X4 uses book value of equity instead of market value)
 *   Safe:     Z' > 2.9
 *   Grey:     1.23 ≤ Z' ≤ 2.9
 *   Distress: Z' < 1.23
 */
export function computeZScore(inputs: ZScoreInputs): ZScoreResult {
  const { totalAssets, workingCapital, retainedEarnings, ebit, marketValueEquity, bookValueLiabilities, sales } = inputs

  const x1 = totalAssets !== 0 ? workingCapital / totalAssets : 0
  const x2 = totalAssets !== 0 ? retainedEarnings / totalAssets : 0
  const x3 = totalAssets !== 0 ? ebit / totalAssets : 0
  const x4 = bookValueLiabilities !== 0 ? marketValueEquity / bookValueLiabilities : 0
  const x5 = totalAssets !== 0 ? sales / totalAssets : 0

  const components: ZScoreComponents = { x1, x2, x3, x4, x5 }

  let score: number
  let zone: RiskZone
  let label: string
  let description: string
  let defaultProbability: string

  if (inputs.companyType === 'public') {
    score = 1.2 * x1 + 1.4 * x2 + 3.3 * x3 + 0.6 * x4 + 1.0 * x5
    if (score > 2.99) {
      zone = 'safe'
      label = 'Safe Zone'
      description = 'The company is financially healthy with a low probability of default.'
      defaultProbability = '< 5%'
    } else if (score >= 1.81) {
      zone = 'grey'
      label = 'Grey Zone'
      description = 'The company is in a zone of uncertainty. Monitor closely for deterioration.'
      defaultProbability = '15% – 35%'
    } else {
      zone = 'distress'
      label = 'Distress Zone'
      description = 'High probability of financial distress or default within 2 years.'
      defaultProbability = '> 50%'
    }
  } else {
    score = 0.717 * x1 + 0.847 * x2 + 3.107 * x3 + 0.420 * x4 + 0.998 * x5
    if (score > 2.9) {
      zone = 'safe'
      label = 'Safe Zone'
      description = 'The company is financially healthy with a low probability of default.'
      defaultProbability = '< 5%'
    } else if (score >= 1.23) {
      zone = 'grey'
      label = 'Grey Zone'
      description = 'The company is in a zone of uncertainty. Monitor closely for deterioration.'
      defaultProbability = '15% – 35%'
    } else {
      zone = 'distress'
      label = 'Distress Zone'
      description = 'High probability of financial distress or default within 2 years.'
      defaultProbability = '> 50%'
    }
  }

  return { score, components, zone, label, description, defaultProbability, inputs }
}

export function zoneColors(zone: RiskZone) {
  switch (zone) {
    case 'safe':
      return {
        bg: 'bg-emerald-50',
        border: 'border-emerald-400',
        text: 'text-emerald-700',
        badge: 'bg-emerald-100 text-emerald-700 border-emerald-300',
        bar: '#10b981',
        glow: '',
      }
    case 'grey':
      return {
        bg: 'bg-amber-50',
        border: 'border-amber-400',
        text: 'text-amber-700',
        badge: 'bg-amber-100 text-amber-700 border-amber-300',
        bar: '#f59e0b',
        glow: '',
      }
    case 'distress':
      return {
        bg: 'bg-red-50',
        border: 'border-red-400',
        text: 'text-red-700',
        badge: 'bg-red-100 text-red-700 border-red-300',
        bar: '#ef4444',
        glow: '',
      }
  }
}

export function formatNumber(value: number): string {
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
