export type CompanyType = 'public' | 'private'

export interface ZScoreInputs {
  companyType: CompanyType
  workingCapital: number
  totalAssets: number
  retainedEarnings: number
  ebit: number
  marketValueEquity: number
  bookValueLiabilities: number
  sales: number
  companyName: string
  fiscalYear: string
}

export interface ZScoreComponents {
  x1: number
  x2: number
  x3: number
  x4: number
  x5: number
}

export type RiskZone = 'safe' | 'grey' | 'distress'

export interface ZScoreResult {
  score: number
  components: ZScoreComponents
  zone: RiskZone
  label: string
  description: string
  defaultProbability: string
  inputs: ZScoreInputs
}
