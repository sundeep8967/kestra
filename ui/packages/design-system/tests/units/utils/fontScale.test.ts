import {describe, expect, it} from "vitest"
import {
    APP_FONT_SIZE_KEY,
    BASE_PX,
    MONO_BASE_PX,
    type AppFontSizeMode,
} from "../../../src/utils/fontScale"

const MODES: AppFontSizeMode[] = ["small", "medium", "large"]

describe("fontScale constants", () => {
    it("exposes the expected storage key", () => {
        expect(APP_FONT_SIZE_KEY).toBe("appFontSize")
    })

    it("has a BASE_PX entry for every AppFontSizeMode", () => {
        expect(Object.keys(BASE_PX).sort()).toEqual([...MODES].sort())
        for (const mode of MODES) {
            expect(BASE_PX[mode]).toBeGreaterThan(0)
        }
    })

    it("has the same set of keys in MONO_BASE_PX", () => {
        expect(Object.keys(MONO_BASE_PX).sort()).toEqual(Object.keys(BASE_PX).sort())
        for (const mode of MODES) {
            expect(MONO_BASE_PX[mode]).toBeGreaterThan(0)
        }
    })

    it("increases values from small through large in both maps", () => {
        expect(BASE_PX.small).toBeLessThan(BASE_PX.medium)
        expect(BASE_PX.medium).toBeLessThan(BASE_PX.large)

        expect(MONO_BASE_PX.small).toBeLessThan(MONO_BASE_PX.medium)
        expect(MONO_BASE_PX.medium).toBeLessThan(MONO_BASE_PX.large)
    })

    it("ensures mono sizes are no larger than their proportional counterparts", () => {
        for (const mode of MODES) {
            expect(MONO_BASE_PX[mode]).toBeLessThanOrEqual(BASE_PX[mode])
        }
    })
})
