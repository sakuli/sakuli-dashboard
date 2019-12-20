export interface DashboardResponse {
  displays: Display[]
}

export interface Display {
  index: number
  url: string
  width: string
  height: string
}