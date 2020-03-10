import { useMemo } from "react";

export const useLocale = () => {
    return useMemo(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get("lang")?? "en"
    }, []);
};