import crypto from 'crypto'

const BASE_URL = 'https://app.0xprocessing.com'
const MERCHANT_ID = process.env.OX_MERCHANT_ID!
const API_KEY = process.env.OX_API_KEY!
const WEBHOOK_PASSWORD = process.env.OX_WEBHOOK_PASSWORD!
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://aiinflux.io'

export interface CreatePaymentParams {
  amountUSD: number
  currency?: string
  email: string
  clientId: string
  billingId: string
}

export interface CreatePaymentResponse {
  redirectUrl: string
  id: number
}

export async function createPayment(params: CreatePaymentParams): Promise<CreatePaymentResponse> {
  const isTestMode = process.env.OX_TEST_MODE === 'true'

  const formData = new URLSearchParams({
    AmountUSD: params.amountUSD.toString(),
    Currency: params.currency || 'USDT (TRC20)',
    Email: params.email,
    ClientId: params.clientId,
    MerchantId: MERCHANT_ID,
    BillingID: params.billingId,
    ReturnUrl: 'true',
    SuccessUrl: `${APP_URL}/dashboard/brand?deposit=success`,
    CancelUrl: `${APP_URL}/dashboard/brand?deposit=cancelled`,
    AutoReturn: 'true',
    ...(isTestMode && { Test: 'true' }),
  })

  const res = await fetch(`${BASE_URL}/Payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString(),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`0xProcessing payment creation failed: ${text}`)
  }

  return await res.json()
}

export interface CreateWithdrawalParams {
  currency: string
  amount: number
  address: string
  clientId: string
  externalId: string
  destinationTag?: string
}

export interface CreateWithdrawalResponse {
  id: number
  currency: string
  amount: number
  address: string
  autoWithdraw: boolean
  externalId: string
}

export async function createWithdrawal(params: CreateWithdrawalParams): Promise<CreateWithdrawalResponse> {
  const body: Record<string, string> = {
    Currency: params.currency,
    Amount: params.amount.toString(),
    Address: params.address,
    ClientId: params.clientId,
    ExternalId: params.externalId,
  }
  if (params.destinationTag) {
    body.DestinationTag = params.destinationTag
  }

  const res = await fetch(`${BASE_URL}/Api/Withdraw`, {
    method: 'POST',
    headers: {
      'APIKEY': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`0xProcessing withdrawal failed: ${text}`)
  }

  return await res.json()
}

export function verifyDepositSignature(payload: {
  PaymentId: number
  MerchantId: string
  Email: string
  Currency: string
  Signature: string
}): boolean {
  const input = `${payload.PaymentId}:${payload.MerchantId}:${payload.Email}:${payload.Currency}:${WEBHOOK_PASSWORD}`
  const expected = crypto.createHash('md5').update(input).digest('hex')
  return expected === payload.Signature
}

export function verifyWithdrawalSignature(payload: {
  ID: number
  MerchantID: string
  Address: string
  Currency: string
  Signature: string
}): boolean {
  const input = `${payload.ID}:${payload.MerchantID}:${payload.Address}:${payload.Currency}:${WEBHOOK_PASSWORD}`
  const expected = crypto.createHash('md5').update(input).digest('hex')
  return expected === payload.Signature
}

export async function getSupportedCoins() {
  const res = await fetch(`${BASE_URL}/Api/Coins`, {
    headers: { 'APIKEY': API_KEY },
  })
  return await res.json()
}
