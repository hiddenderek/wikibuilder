import { store } from '../../app/store'
import { initialState, pageLoad, pageReset, setPageTitle, setIntroText, addSection, deleteSection, setSectionText, setSectionTitle, setTableWidth, addTableTitle, addTableImage, addTableInfo, addTableText, addTableRelated, selectTableElement, deleteTableElement } from './pageCreator-slice'
import { pageCreatorState } from './pageCreator-types'
const dispatch = store.dispatch

afterEach(() => {
    dispatch(pageReset())
})

test('page load test', () => {
    let pageCreatorState = store.getState().pageCreator    
    const newPageData: pageCreatorState = {
        pageTitle: 'Test page.',
        introText: 'Test intro',
        introTableData: {
            width: 40,
            titles: [],
            images: [],
            text: [],
            info: [],
            related: []
        },
        pageSections: [],
        titleSelected: { element: -1, section: -1 },
        imageSelected: { element: -1, section: -1 },
        textSelected: { element: -1, section: -1 },
        infoSelected: { element: -1, section: -1 },
        relatedSelected: { element: -1, section: -1 }
    }
    console.log(pageCreatorState)
    expect(pageCreatorState.pageTitle).toBe(initialState.pageTitle)
    expect(pageCreatorState.introText).toBe(initialState.introText)
    expect(pageCreatorState.introTableData.width).toBe(initialState.introTableData.width)
    dispatch(pageLoad({
        title: newPageData.pageTitle,
        intro_text: newPageData.introText,
        intro_table_data: JSON.stringify(newPageData.introTableData),
        page_section_data: JSON.stringify(newPageData.pageSections)
    }))
    pageCreatorState = store.getState().pageCreator
    expect(pageCreatorState.pageTitle).toBe(newPageData.pageTitle)
    expect(pageCreatorState.introText).toBe(newPageData.introText)
    expect(pageCreatorState.introTableData.width).toBe(newPageData.introTableData.width)
})

test('Page title change test', () => {
    let pageCreatorState = store.getState().pageCreator
    expect(pageCreatorState.pageTitle).toBe(initialState.pageTitle)
    dispatch(setPageTitle('Changing Title'))
    pageCreatorState = store.getState().pageCreator
    expect(pageCreatorState.pageTitle).toBe('Changing Title')
})

test('Page intro change test', () => {
    let pageCreatorState = store.getState().pageCreator
    expect(pageCreatorState.introText).toBe(initialState.introText)
    dispatch(setIntroText('New Intro Text'))
    pageCreatorState = store.getState().pageCreator
    expect(pageCreatorState.introText).toBe('New Intro Text')
})

const newPageSection = {
    title: 'New Page Section Title',
    text: 'New Page Section Text',
    tableData: {
        width: 40,
        titles: [],
        images: [],
        text: [],
        info: [],
        related: []
    },
}

describe('testing page sections', () => {
    beforeEach(() => {
        let pageCreatorState = store.getState().pageCreator
        expect(pageCreatorState.pageSections[0]?.title).toBe(undefined)
        expect(pageCreatorState.pageSections[0]?.text).toBe(undefined)
        dispatch(addSection(newPageSection))
        pageCreatorState = store.getState().pageCreator
        expect(pageCreatorState.pageSections[0].title).toBe(newPageSection.title)
        expect(pageCreatorState.pageSections[0].text).toBe(newPageSection.text)
    })

    test('delete page section', () => {
        let pageCreatorState = store.getState().pageCreator  
        expect(pageCreatorState.pageSections[0].title).toBe(newPageSection.title)
        expect(pageCreatorState.pageSections[0].text).toBe(newPageSection.text)
        dispatch(deleteSection(0))
        pageCreatorState = store.getState().pageCreator
        expect(pageCreatorState.pageSections[0]?.title).toBe(undefined)
        expect(pageCreatorState.pageSections[0]?.text).toBe(undefined)
    })

    test('Change page section text.', () => {
        let pageCreatorState = store.getState().pageCreator
        expect(pageCreatorState.pageSections[0]?.text).toBe(newPageSection.text)
        dispatch(setSectionText({ index: 0, text: "Changed page section text" }))
        pageCreatorState = store.getState().pageCreator
        expect(pageCreatorState.pageSections[0]?.text).toBe("Changed page section text")
    })

    test('Change page section title.', () => {
        let pageCreatorState = store.getState().pageCreator   
        expect(pageCreatorState.pageSections[0]?.title).toBe(newPageSection.title)
        dispatch(setSectionTitle({ index: 0, text: "Changed page section title" }))
        pageCreatorState = store.getState().pageCreator
        expect(pageCreatorState.pageSections[0]?.title).toBe("Changed page section title")
    })

    test('Change page table width.', () => {
        let pageCreatorState = store.getState().pageCreator
        expect(pageCreatorState.pageSections[0]?.tableData?.width).toBe(40)
        dispatch(setTableWidth({ index: 0, width: 80 }))
        pageCreatorState = store.getState().pageCreator
        expect(pageCreatorState.pageSections[0]?.tableData?.width).toBe(80)
    })

    test('Add page table title', () => {
        let pageCreatorState = store.getState().pageCreator
        expect(pageCreatorState.pageSections[0]?.tableData?.titles[0]).toBe(undefined)
        dispatch(addTableTitle({ index: 0, subIndex: 0, text: "New Subindex Title" }))
        pageCreatorState = store.getState().pageCreator
        expect(pageCreatorState.pageSections[0]?.tableData?.titles[0]).toBe("New Subindex Title")
    })

    test("Add page table image", () => {
        let pageCreatorState = store.getState().pageCreator
        expect(pageCreatorState.pageSections[0]?.tableData?.images[0]).toBe(undefined)
        dispatch(addTableImage({ index: 0, subIndex: 0, url: "/images/user-images/test.png", type: "", width: 200, height: 200}))
        pageCreatorState = store.getState().pageCreator
        expect(pageCreatorState.pageSections[0]?.tableData?.images[0].url).toBe("/images/user-images/test.png")
    })

    test("Add page table text", () => {
        let pageCreatorState = store.getState().pageCreator
        expect(pageCreatorState.pageSections[0]?.tableData?.text[0]).toBe(undefined)
        dispatch(addTableText({ index: 0, subIndex: 0, text: "New Subindex Title" }))
        pageCreatorState = store.getState().pageCreator
        expect(pageCreatorState.pageSections[0]?.tableData?.text[0]).toBe("New Subindex Title")
    })

    test("Add page table info", () => {
        let pageCreatorState = store.getState().pageCreator
        expect(pageCreatorState.pageSections[0]?.tableData?.info[0]).toBe(undefined)
        dispatch(addTableInfo({ index: 0, subIndex: 0, label: "New Subindex Label", text: "New Subindex Text" }))
        pageCreatorState = store.getState().pageCreator
        expect(pageCreatorState.pageSections[0]?.tableData?.info[0].label).toBe("New Subindex Label")
    })

    test("Add page table related", () => {
        let pageCreatorState = store.getState().pageCreator
        expect(pageCreatorState.pageSections[0]?.tableData?.related[0]).toBe(undefined)
        dispatch(addTableRelated({ index: 0, subIndex: 0, url: "New Subindex Url", text: "New Subindex Url Text" }))
        pageCreatorState = store.getState().pageCreator
        expect(pageCreatorState.pageSections[0]?.tableData?.related[0].url).toBe("New Subindex Url")
    })

    test("Select table element", () => {
        let pageCreatorState = store.getState().pageCreator
        dispatch(selectTableElement({ index: 0, element: 1, type: "image" }))
        pageCreatorState = store.getState().pageCreator 
        expect(pageCreatorState.textSelected.element).toBe(-1)
        expect(pageCreatorState.textSelected.section).toBe(-1)
        expect(pageCreatorState.imageSelected.element).toBe(1)
        expect(pageCreatorState.imageSelected.section).toBe(0)
    })

    test("delete table element", () => {
        let pageCreatorState = store.getState().pageCreator
        dispatch(addTableImage({ index: 0, subIndex: 0, url: "/images/user-images/test.png", type: "", width: 200, height: 200}))
        dispatch(selectTableElement({ index: 0, element: 0, type: "image" }))
        pageCreatorState = store.getState().pageCreator 
        expect(pageCreatorState.pageSections[0]?.tableData?.images[0].url).toBe("/images/user-images/test.png")
        dispatch(deleteTableElement("image"))
        pageCreatorState = store.getState().pageCreator
        expect(pageCreatorState.pageSections[0]?.tableData?.images[0]).toBe(undefined)
    })
})