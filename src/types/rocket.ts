export interface Rocket {
  id: number
  name: string
  family: string | null
  description: string | null
  imageUrl: string | null
  launchCost: string | null
  countryCode: string | null
  maidenFlight: string | null
  addedLocally: boolean
}

export interface RocketDraft {
  name: string
  family: string | null
  description: string | null
  imageUrl: string | null
  launchCost: string | null
  countryCode: string | null
  maidenFlight: string | null
}

export interface LaunchLibraryManufacturer {
  country_code: string | null
}

export interface LaunchLibraryLauncher {
  id: number
  name: string | null
  full_name: string | null
  family: string | null
  description: string | null
  image_url: string | null
  launch_cost: string | null
  maiden_flight: string | null
  manufacturer: LaunchLibraryManufacturer | null
}

export interface LaunchLibraryPage {
  count: number
  next: string | null
  previous: string | null
  results: LaunchLibraryLauncher[]
}
