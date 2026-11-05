import {describe, expect, test} from "vitest"
import {mount} from "@vue/test-utils"
import EmptyTemplate from "./EmptyTemplate.vue"

describe("EmptyTemplate", () => {
    test("renders the default slot", () => {
        const wrapper = mount(EmptyTemplate, {
            slots: {default: "<p>No data found</p>"},
        })
        expect(wrapper.html()).toContain("<p>No data found</p>")
    })

    test("adds the plain class when plain prop is true", () => {
        const wrapper = mount(EmptyTemplate, {props: {plain: true}})
        expect(wrapper.classes()).toContain("plain")
    })

    test("plain class is absent by default and plain defaults to false", () => {
        const wrapper = mount(EmptyTemplate)
        expect(wrapper.classes()).not.toContain("plain")
        expect(wrapper.props("plain")).toBe(false)
    })

    test("container classes are present in both default and plain variants", () => {
        const defaultWrapper = mount(EmptyTemplate)
        expect(defaultWrapper.classes()).toContain("container")
        expect(defaultWrapper.classes()).toContain("empty-template")

        const plainWrapper = mount(EmptyTemplate, {props: {plain: true}})
        expect(plainWrapper.classes()).toContain("container")
        expect(plainWrapper.classes()).toContain("empty-template")
    })

    test("mounting with no props does not throw", () => {
        expect(() => mount(EmptyTemplate)).not.toThrow()
    })
})
