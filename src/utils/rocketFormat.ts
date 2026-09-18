export const NOT_RECORDED = 'Not recorded'

const costFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const flightDateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

export function formatLaunchCost(launchCost: string | null): string | null {
  if (!launchCost) {
    return null
  }
  const amount = Number(launchCost.replace(/[^\d.]/g, ''))
  if (!Number.isFinite(amount) || amount <= 0) {
    return null
  }
  return costFormatter.format(amount)
}

export function formatFlightDate(maidenFlight: string | null): string | null {
  const parts = maidenFlight ? /^(\d{4})-(\d{2})-(\d{2})/.exec(maidenFlight) : null
  if (!parts) {
    return null
  }
  const date = new Date(Date.UTC(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3])))
  if (Number.isNaN(date.getTime())) {
    return null
  }
  return flightDateFormatter.format(date)
}
