import { useCallback, useState } from "react";
import { LayoutMode } from "@sakuli-dashboard/api";

export const useLayout = () => {
    const [currentLayout, setLayout] = useState<LayoutMode>((localStorage.getItem("dashboard-layout")?? "column") as LayoutMode);

    const enhanceSetLayout = useCallback((layout: LayoutMode) => {
        setLayout(layout);
        localStorage.setItem("dashboard-layout", layout)
    }, []);

    return [currentLayout, enhanceSetLayout] as const;
}