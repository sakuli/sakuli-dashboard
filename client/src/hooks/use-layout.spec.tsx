import { renderHook } from "@testing-library/react-hooks";
import { useLayout } from "./use-layout";
import { act } from "react-dom/test-utils";

describe("use layout", () => {

    test('should return column be default', () => {

        //GIVEN
        const expectedLayout = "column"

        //WHEN
        const { result } = renderHook(() => useLayout())

        //THEN
        expect(result.current[0]).toBe(expectedLayout)
        expect(result.current[2]).toBeFalsy()
    })

    test('should return stored layout', () => {

        //GIVEN
        const expectedLayout = "row"
        localStorage.setItem("dashboard-layout", expectedLayout)

        //WHEN
        const { result } = renderHook(() => useLayout())

        //THEN
        expect(result.current[0]).toBe(expectedLayout)
        expect(result.current[2]).toBeTruthy()
    })

    test('should set layout to storage', () => {

        //GIVEN
        const expectedLayout = "row"
        const layoutHook1 = renderHook(() => useLayout())

        //WHEN
        act(() => {
            layoutHook1.result.current[1](expectedLayout)
        })

        //THEN
        const layoutHook2 = renderHook(() => useLayout())
        expect(layoutHook2.result.current[0]).toBe(expectedLayout)
        expect(layoutHook2.result.current[2]).toBeTruthy()
    })
})