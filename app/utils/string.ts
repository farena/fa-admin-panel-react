export function humanReadableSize(bytes: number | null | undefined): string {
  if (!bytes) return '0 Byte'

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']

  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
}

/**
 * Convert cents to dollars
 * @param cents - Amount in cents
 * @returns Amount in dollars
 */
export function centsToDollars(cents: number | string | null | undefined): number {
  if (cents == null) return 0

  const val = typeof cents === 'number' ? cents : parseInt(cents)
  return val / 100
}

/**
 * Convert dollars to cents
 * @param dollars - Amount in dollars
 * @returns Amount in cents
 */
export function dollarsToCents(dollars: number | string | null | undefined): number {
  if (dollars == null) return 0

  const val = typeof dollars === 'number' ? dollars : parseFloat(dollars)
  if (isNaN(val)) return 0
  return Math.round(val * 100)
}

/**
 * Format money value for display (always 2 decimal places)
 * @param value - Amount in dollars (e.g. 99.5)
 * @returns Formatted money string (e.g. "1.234,50")
 */
export function formatToMoney(value: number | string | null | undefined): string {
  if (value == null || isNaN(Number(value))) return '0,00'

  const [integer, decimals] = Number(value).toFixed(2).split('.')
  return `${integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${decimals}`
}

/**
 * Format cents to money string
 * @param cents - Amount in cents
 * @returns Formatted money string
 */
export function formatCentsToMoney(cents: number | string | null | undefined): string {
  return formatToMoney(centsToDollars(cents))
}

export function textToHtml(text: string): string {
  // Replace line breaks with <br> tags
  let htmlText = text.replace(/\r?\n/g, '<br>')

  // Replace multiple spaces with &nbsp; to preserve them in HTML
  htmlText = htmlText.replace(/ {2,}/g, (match) => '&nbsp;'.repeat(match.length))

  return htmlText
}
