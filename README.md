# Probability of Default - Altman Z-Score

An interactive web calculator that estimates a company's risk of bankruptcy using the **Altman Z-Score** model (1968) and its private-company variant, the **Z'-Score** (1983).

Enter seven figures from a company's financial statements, choose whether the company is public or private, and the app computes the score and classifies the firm into a **Safe**, **Grey**, or **Distress** zone.

---

## Features

- **Two model variants**: original Z-Score for publicly traded companies and Z'-Score for private companies, switchable with one click.
- **Guided inputs**: every field includes a short definition so non-specialists know which balance-sheet or income-statement line to use.
- **Instant classification**: the result is mapped to a risk zone with the model's standard cut-off values.
- **Currency-agnostic**: works with any currency or unit (thousands, millions, etc.), as long as all inputs use the same one.

---

## How to use

1. Enter the **Company Name** and **Fiscal Year**.
2. Select the **Company Type**: `Public` or `Private`.
3. Fill in the financial data (all in the same currency unit):

| Field | Definition | Source |
|---|---|---|
| Working Capital | Current Assets − Current Liabilities | Balance sheet |
| Total Assets | Sum of all assets | Balance sheet |
| Retained Earnings | Cumulative undistributed earnings | Balance sheet (equity) |
| EBIT | Earnings before interest and taxes | Income statement |
| Market / Book Value of Equity | Market capitalisation (public) or book equity (private) | Market data / Balance sheet |
| Book Value of Total Liabilities | Total debt + other liabilities | Balance sheet |
| Net Sales / Revenue | Total revenue for the period | Income statement |

4. Click **Calculate Z-Score**. Use **Reset** to clear the form.

---

## The theory behind the method

### Origin

The Z-Score was published by Edward I. Altman, professor at New York University, in 1968 (*"Financial Ratios, Discriminant Analysis and the Prediction of Corporate Bankruptcy"*, *Journal of Finance*). It was one of the first models to show that a combination of accounting ratios could predict corporate failure better than any single ratio on its own.

Altman studied a sample of 66 U.S. manufacturing firms — half that had filed for bankruptcy and half that had not — and used **Multiple Discriminant Analysis (MDA)**. MDA is a statistical technique that finds the weighted combination of variables that best separates two groups. The result is a single score: firms that later failed clustered at low values and healthy firms at high values. The original model correctly classified about 95% of the sample one year before bankruptcy, and about 72% two years before.

### The five ratios

Each ratio captures a different dimension of financial health:

| Ratio | Formula | What it measures |
|---|---|---|
| **X₁** | Working Capital / Total Assets | **Liquidity** – short-term resources relative to company size. Firms in trouble usually see shrinking working capital. |
| **X₂** | Retained Earnings / Total Assets | **Cumulative profitability and age** – how much of the asset base was financed by reinvested profits rather than debt. Young firms naturally score lower. |
| **X₃** | EBIT / Total Assets | **Operating profitability** – how productively assets generate earnings, independent of taxes and leverage. This is the most heavily weighted factor. |
| **X₄** | Equity / Total Liabilities | **Solvency / leverage** – how far asset values can fall before liabilities exceed them and the firm becomes insolvent. |
| **X₅** | Sales / Total Assets | **Activity / asset turnover** – management's ability to generate revenue from the asset base. |

### Original Z-Score (public companies, 1968)

```
Z = 1.2·X₁ + 1.4·X₂ + 3.3·X₃ + 0.6·X₄ + 1.0·X₅
```

X₄ uses the **market value of equity** (market capitalisation).

| Zone | Z-Score | Interpretation |
|---|---|---|
| 🟢 Safe | Z > 2.99 | Low probability of bankruptcy |
| 🟡 Grey | 1.81 – 2.99 | Uncertain; needs closer analysis |
| 🔴 Distress | Z < 1.81 | High probability of bankruptcy within ~2 years |

### Z'-Score (private companies, 1983)

Private companies have no market price for their shares, so Altman re-estimated the model replacing market value with **book value of equity** in X₄. The coefficients and cut-offs change as a result:

```
Z' = 0.717·X₁ + 0.847·X₂ + 3.107·X₃ + 0.420·X₄ + 0.998·X₅
```

| Zone | Z'-Score | Interpretation |
|---|---|---|
| 🟢 Safe | Z' > 2.90 | Low probability of bankruptcy |
| 🟡 Grey | 1.23 – 2.90 | Uncertain; needs closer analysis |
| 🔴 Distress | Z' < 1.23 | High probability of bankruptcy |

### Worked example (public company)

| Input | Value |
|---|---|
| Working Capital | 200 |
| Total Assets | 1,000 |
| Retained Earnings | 300 |
| EBIT | 150 |
| Market Value of Equity | 800 |
| Total Liabilities | 500 |
| Sales | 1,200 |

X₁ = 0.20, X₂ = 0.30, X₃ = 0.15, X₄ = 1.60, X₅ = 1.20

Z = 1.2(0.20) + 1.4(0.30) + 3.3(0.15) + 0.6(1.60) + 1.0(1.20) = 0.24 + 0.42 + 0.495 + 0.96 + 1.20 = **3.315 → Safe zone**

### Limitations

- **Industry scope**: the model was calibrated on U.S. manufacturing firms. For non-manufacturing and emerging-market companies, Altman's **Z''-Score** (four ratios, without X₅) is usually more appropriate.
- **Not suited to financial institutions**: banks, insurers and similar firms have balance-sheet structures the model does not capture.
- **Accounting-based**: results depend on the quality of the reported figures and can be distorted by creative accounting or one-off items.
- **A score, not a precise probability**: the Z-Score ranks and classifies risk; turning it into an exact percentage probability of default requires additional calibration (for example, mapping to bond ratings or historical default rates).
- **Static snapshot**: one year's figures give a point-in-time view; tracking the score over several years is more informative.

The Z-Score is best used as a screening tool alongside other credit analysis, not as a stand-alone decision.

---

## References

- Altman, E. I. (1968). *Financial Ratios, Discriminant Analysis and the Prediction of Corporate Bankruptcy*. The Journal of Finance, 23(4), 589–609.
- Altman, E. I. (1983). *Corporate Financial Distress: A Complete Guide to Predicting, Avoiding, and Dealing with Bankruptcy*. Wiley.
- Altman, E. I., & Hotchkiss, E. (2006). *Corporate Financial Distress and Bankruptcy* (3rd ed.). Wiley.

---

## Disclaimer

This tool is for educational and analytical purposes only and does not constitute financial or investment advice.
