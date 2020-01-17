export interface DashboardConfigResponse {
  displays: Display[]
}

export interface Display {
  index: number
  description: string
  url: string
  width: string
  height: string
  actionIdentifier: string
}