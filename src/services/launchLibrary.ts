import type { LaunchLibraryLauncher, LaunchLibraryPage, Rocket } from '@/types/rocket'

const API_ORIGIN = 'https://lldev.thespacedevs.com/2.2.0'
const SPACEX_CATALOG_QUERY = 'manufacturer__name=SpaceX&mode=detailed&limit=20'

export class RocketRequestError extends Error {
  readonly notFound: boolean

  constructor (message: string, notFound = false) {
    super(message)
    this.name = 'RocketRequestError'
    this.notFound = notFound
  }
}

function normalisePunctuation (value: string): string {
  return value.replace(/\s*\u2014\s*/g, ', ').replace(/ \u2013 /g, ', ')
}

function cleanText (value: string | null | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? normalisePunctuation(trimmed) : null
}

function cleanValue (value: string | null | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

export function toRocket (launcher: LaunchLibraryLauncher): Rocket {
  return {
    id: launcher.id,
    name: cleanText(launcher.full_name) ?? cleanText(launcher.name) ?? `Rocket ${launcher.id}`,
    family: cleanText(launcher.family),
    description: cleanText(launcher.description),
    imageUrl: cleanValue(launcher.image_url),
    launchCost: cleanValue(launcher.launch_cost),
    countryCode: cleanValue(launcher.manufacturer?.country_code),
    maidenFlight: cleanValue(launcher.maiden_flight),
    addedLocally: false,
  }
}

async function requestJson<T> (url: string): Promise<T> {
  let response: Response
  try {
    response = await fetch(url, { headers: { Accept: 'application/json' } })
  } catch {
    throw new RocketRequestError('The Launch Library 2 API could not be reached. Check your connection, then retry.')
  }

  if (response.status === 404) {
    throw new RocketRequestError('The Launch Library 2 API has no rocket with that id.', true)
  }
  if (!response.ok) {
    throw new RocketRequestError(`The Launch Library 2 API replied with ${response.status}. Wait a moment, then retry.`)
  }

  return await response.json() as T
}

export async function fetchRockets (): Promise<Rocket[]> {
  const page = await requestJson<LaunchLibraryPage>(`${API_ORIGIN}/config/launcher/?${SPACEX_CATALOG_QUERY}`)
  return page.results.map(toRocket)
}

export async function fetchRocket (id: number): Promise<Rocket> {
  const launcher = await requestJson<LaunchLibraryLauncher>(`${API_ORIGIN}/config/launcher/${id}/?mode=detailed`)
  return toRocket(launcher)
}
