import {describe, it, expect, vi} from "vitest"
import {mount} from "@vue/test-utils"
import {defineComponent} from "vue"

const mockEditorBindings = {
    theme: "vs-dark",
    tabSize: 4,
}

vi.mock("../../../composables/useEditorBindings", () => ({
    useEditorBindings: () => mockEditorBindings,
}))

import DiffView from "./DiffView.vue"

const KsEditorStub = defineComponent({
    name: "KsEditor",
    props: {
        modelValue: {type: String, default: ""},
        original: {type: String, default: ""},
        options: {type: Object, default: () => ({})},
        readOnly: {type: Boolean, default: false},
        lang: {type: String, default: ""},
        theme: {type: String, default: ""},
        tabSize: {type: Number, default: 2},
    },
    template: '<div class="ks-editor-stub" />',
})

const mountDiffView = (props = {oldValue: "initial: 1", newValue: "updated: 2"}) =>
    mount(DiffView, {
        props,
        global: {
            stubs: {
                KsEditor: KsEditorStub,
            },
        },
    })

describe("DiffView", () => {
    it("passes newValue as modelValue and oldValue as original", () => {
        const wrapper = mountDiffView({oldValue: "old: content", newValue: "new: content"})
        const editor = wrapper.findComponent(KsEditorStub)
        expect(editor.props("modelValue")).toBe("new: content")
        expect(editor.props("original")).toBe("old: content")
    })

    it("ensures the editor is read-only", () => {
        const wrapper = mountDiffView()
        const editor = wrapper.findComponent(KsEditorStub)
        expect(editor.props("readOnly")).toBe(true)
    })

    it("forces diffSideBySide to false so the diff renders inline", () => {
        const wrapper = mountDiffView()
        const editor = wrapper.findComponent(KsEditorStub)
        expect(editor.props("options")).toEqual({diffSideBySide: false})
    })

    it("sets the language to yaml", () => {
        const wrapper = mountDiffView()
        const editor = wrapper.findComponent(KsEditorStub)
        expect(editor.props("lang")).toBe("yaml")
    })

    it("passes an empty oldValue through rather than replacing it with a default", () => {
        const wrapper = mountDiffView({oldValue: "", newValue: "id: new-flow"})
        const editor = wrapper.findComponent(KsEditorStub)
        expect(editor.props("original")).toBe("")
        expect(editor.props("modelValue")).toBe("id: new-flow")
    })

    it("spreads the editor bindings from useEditorBindings onto the editor", () => {
        const wrapper = mountDiffView()
        const editor = wrapper.findComponent(KsEditorStub)
        expect(editor.props("theme")).toBe("vs-dark")
        expect(editor.props("tabSize")).toBe(4)
    })

    it("has the copilot-diff test handle present", () => {
        const wrapper = mountDiffView()
        expect(wrapper.find('[data-test="copilot-diff"]').exists()).toBe(true)
    })
})
