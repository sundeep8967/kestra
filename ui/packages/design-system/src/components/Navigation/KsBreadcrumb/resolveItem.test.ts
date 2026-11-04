import {describe, test, expect, vi} from "vitest"
import {RouterLink} from "vue-router"
import {resolveItem} from "./resolveItem"
import type {KsBreadcrumbItem} from "./types"

describe("resolveItem", () => {
    test("resolves to a span with no attributes when disabled is true", () => {
        const item: KsBreadcrumbItem = {label: "Disabled crumb", disabled: true}
        expect(resolveItem(item)).toEqual({tag: "span", attrs: {}})
    })

    test("resolves to a span with no attributes when disabled, even with link and onClick", () => {
        const item: KsBreadcrumbItem = {
            label: "Disabled crumb with targets",
            disabled: true,
            link: "/flows",
            onClick: vi.fn(),
        }
        expect(resolveItem(item)).toEqual({tag: "span", attrs: {}})
    })

    test("resolves to RouterLink with to attribute when item has link", () => {
        const item: KsBreadcrumbItem = {label: "Flows", link: "/flows"}
        expect(resolveItem(item)).toEqual({tag: RouterLink, attrs: {to: "/flows"}})
    })

    test("resolves to RouterLink when link is a route location object", () => {
        const route = {name: "flows/update", params: {id: "my-flow"}}
        const item: KsBreadcrumbItem = {label: "Flow Details", link: route}
        expect(resolveItem(item)).toEqual({tag: RouterLink, attrs: {to: route}})
    })

    test("resolves to an anchor tag with href=\"#\" when only onClick is provided", () => {
        const item: KsBreadcrumbItem = {label: "Action", onClick: vi.fn()}
        const resolved = resolveItem(item)

        expect(resolved.tag).toBe("a")
        expect(resolved.attrs.href).toBe("#")
        expect(typeof resolved.attrs.onClick).toBe("function")
    })

    test("calls preventDefault and executes item onClick callback on click event", () => {
        const onClick = vi.fn()
        const item: KsBreadcrumbItem = {label: "Action", onClick}
        const resolved = resolveItem(item)

        const event = {preventDefault: vi.fn()} as unknown as Event
        const clickHandler = resolved.attrs.onClick as (e: Event) => void
        clickHandler(event)

        expect(event.preventDefault).toHaveBeenCalledOnce()
        expect(onClick).toHaveBeenCalledOnce()
    })

    test("resolves to a plain span when neither link nor onClick is present", () => {
        const item: KsBreadcrumbItem = {label: "Current Crumb"}
        expect(resolveItem(item)).toEqual({tag: "span", attrs: {}})
    })

    test("prioritizes link over onClick when both are present", () => {
        const onClick = vi.fn()
        const item: KsBreadcrumbItem = {label: "Link crumb", link: "/flows", onClick}
        expect(resolveItem(item)).toEqual({tag: RouterLink, attrs: {to: "/flows"}})
    })
})
