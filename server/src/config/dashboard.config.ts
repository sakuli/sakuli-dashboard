export interface DashboardConfig {
  displays: Display[]
}

export interface Display {
  index: number
  url: string
  width: string
  height: string
  actionIdentifier: string
}