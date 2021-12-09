import { LayoutMode, LoginResponse } from "@sakuli-dashboard/api";

const LOGIN_INFORMATION_KEY = "loginInformation";
const DASHBOARD_LAYOUT_KEY = "dashboard-layout";

export function loadLoginInformation(): LoginResponse | undefined {
    const storedLoginInformation = localStorage.getItem(LOGIN_INFORMATION_KEY);
    if(storedLoginInformation != null){
        return JSON.parse(storedLoginInformation)
    }
    return undefined
}

export function persistLoginInformation(loginInformation?: LoginResponse){
    localStorage.setItem(LOGIN_INFORMATION_KEY, JSON.stringify(loginInformation))
}

export function loadLayoutMode() {
    return localStorage.getItem(DASHBOARD_LAYOUT_KEY)
}

export function persistLayoutMode(layout: LayoutMode){
    localStorage.setItem(DASHBOARD_LAYOUT_KEY, layout)
}