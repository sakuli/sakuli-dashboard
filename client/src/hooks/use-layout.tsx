import { useCallback, useState } from "react";
import { LayoutMode } from "@sakuli-dashboard/api";
import { loadLayoutMode, persistLayoutMode } from "../services/localStorageService";

export const useLayout = () => {
    const [currentLayout, setLayout] = useState<LayoutMode>((loadLayoutMode() ?? "column") as LayoutMode);

    const enhanceSetLayout = useCallback((layout: LayoutMode) => {
        setLayout(layout);
        persistLayoutMode(layout)
    }, []);

    const fromLocalStorage = !!loadLayoutMode()

    return [currentLayout, enhanceSetLayout, fromLocalStorage] as const;
}