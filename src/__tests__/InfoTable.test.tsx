/**
 * @jest-environment jsdom
 */
import React from 'react'
import { screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import WikiPage from '../components/WikiPage'
import { BrowserRouter as Router } from 'react-router-dom'
import { renderWithRouter } from '../utils/testHelperFunctions'
import userEvent from '@testing-library/user-event'
import { setEditMode } from '../features/userInterface/userInterface-slice'
import { pageReset } from '../features/pageCreator/pageCreator-slice'

beforeEach(async () => {
    const user = userEvent.setup()
    store.dispatch(setEditMode(true))
    renderWithRouter(
        <Router>
            <Provider store={store}>
                <WikiPage />
            </Provider>
        </Router>
        , { route: '/wiki' })
    const pageSectionButton = screen.getByRole('button', { name: "Add Section" })
    await user.click(pageSectionButton)
})

afterEach(() => {
    store.dispatch(pageReset())
})

test('Add Table Title', async () => {
    const user = userEvent.setup()
    let pageState = store.getState().pageCreator
    expect(pageState.pageSections[0].tableData.titles.length).toBe(0)
    const titleAddElm = screen.getByTestId('table_title_add_0') as HTMLImageElement
    await user.click(titleAddElm)
    pageState = store.getState().pageCreator
    expect(pageState.pageSections[0].tableData.titles.length).toBeGreaterThan(0)
})

test('Remove Table Title', async () => {
    const user = userEvent.setup()
    let pageState = store.getState().pageCreator
    expect(pageState.pageSections[0].tableData.titles.length).toBe(0)
    const titleAddElm = screen.getByTestId('table_title_add_0') as HTMLImageElement
    await user.click(titleAddElm)
    pageState = store.getState().pageCreator
    expect(pageState.pageSections[0].tableData.titles.length).toBeGreaterThan(0)
})

test('Add Table Image', async () => {
    const user = userEvent.setup()
    let pageState = store.getState().pageCreator
    expect(pageState.pageSections[0].tableData.images.length).toBe(0)
    const imageAddElm = screen.getByTestId('table_image_add_0') as HTMLImageElement
    await user.click(imageAddElm)
    pageState = store.getState().pageCreator
    expect(pageState.pageSections[0].tableData.images.length).toBeGreaterThan(0)
})

test('Remove Table Image', async () => {
    const user = userEvent.setup()
    let pageState = store.getState().pageCreator
    expect(pageState.pageSections[0].tableData.images.length).toBe(0)
    const imageAddElm = screen.getByTestId('table_image_add_0') as HTMLImageElement
    await user.click(imageAddElm)
    pageState = store.getState().pageCreator
    expect(pageState.pageSections[0].tableData.images.length).toBeGreaterThan(0)
    const imageElm = screen.getByTestId('table_image_0_0')
    await user.click(imageElm)
    const imageRemoveElm = screen.getByTestId('table_image_remove_0') as HTMLImageElement
    await user.click(imageRemoveElm)
    pageState = store.getState().pageCreator
    expect(pageState.pageSections[0].tableData.images.length).toBe(0)
})

test('Add Table Text', async () => {
    const user = userEvent.setup()
    let pageState = store.getState().pageCreator
    expect(pageState.pageSections[0].tableData.text.length).toBe(0)
    const textAddElm = screen.getByTestId('table_text_add_0') as HTMLImageElement
    await user.click(textAddElm)
    pageState = store.getState().pageCreator
    expect(pageState.pageSections[0].tableData.text.length).toBeGreaterThan(0)
    const textElm = screen.getByTestId('table_text_0_0')
    await user.click(textElm)
    const textRemoveElm = screen.getByTestId('table_text_remove_0') as HTMLImageElement
    await user.click(textRemoveElm)
    pageState = store.getState().pageCreator
    expect(pageState.pageSections[0].tableData.text.length).toBe(0)
})

test('Remove Table Text', async () => {
    const user = userEvent.setup()
    let pageState = store.getState().pageCreator
    expect(pageState.pageSections[0].tableData.text.length).toBe(0)
    const textAddElm = screen.getByTestId('table_text_add_0') as HTMLImageElement
    await user.click(textAddElm)
    pageState = store.getState().pageCreator
    expect(pageState.pageSections[0].tableData.text.length).toBeGreaterThan(0)
    const textElm = screen.getByTestId('table_text_0_0')
    await user.click(textElm)
    const textRemoveElm = screen.getByTestId('table_text_remove_0') as HTMLImageElement
    await user.click(textRemoveElm)
    pageState = store.getState().pageCreator
    expect(pageState.pageSections[0].tableData.text.length).toBe(0)
})

test('Add Table Info', async () => {
    const user = userEvent.setup()
    let pageState = store.getState().pageCreator
    expect(pageState.pageSections[0].tableData.info.length).toBe(0)
    const infoAddElm = screen.getByTestId('table_info_add_0') as HTMLImageElement
    await user.click(infoAddElm)
    pageState = store.getState().pageCreator
    expect(pageState.pageSections[0].tableData.info.length).toBeGreaterThan(0)
    const infoElm = screen.getByTestId('table_info_0_0')
    await user.click(infoElm)
    const infoRemoveElm = screen.getByTestId('table_info_remove_0') as HTMLImageElement
    await user.click(infoRemoveElm)
    pageState = store.getState().pageCreator
    expect(pageState.pageSections[0].tableData.info.length).toBe(0)
})

test('Remove Table Info', async () => {
    const user = userEvent.setup()
    let pageState = store.getState().pageCreator
    expect(pageState.pageSections[0].tableData.info.length).toBe(0)
    const infoAddElm = screen.getByTestId('table_info_add_0') as HTMLImageElement
    await user.click(infoAddElm)
    pageState = store.getState().pageCreator
    expect(pageState.pageSections[0].tableData.info.length).toBeGreaterThan(0)
    const infoElm = screen.getByTestId('table_info_0_0')
    await user.click(infoElm)
    const infoRemoveElm = screen.getByTestId('table_info_remove_0') as HTMLImageElement
    await user.click(infoRemoveElm)
    pageState = store.getState().pageCreator
    expect(pageState.pageSections[0].tableData.info.length).toBe(0)
})

test('Add Table Related', async () => {
    const user = userEvent.setup()
    let pageState = store.getState().pageCreator
    expect(pageState.pageSections[0].tableData.related.length).toBe(0)
    const relatedAddElm = screen.getByTestId('table_related_add_0') as HTMLImageElement
    await user.click(relatedAddElm)
    pageState = store.getState().pageCreator
    expect(pageState.pageSections[0].tableData.related.length).toBeGreaterThan(0)
    const relatedElm = screen.getByTestId('table_related_0_0')
    await user.click(relatedElm)
    const relatedRemoveElm = screen.getByTestId('table_related_remove_0') as HTMLImageElement
    await user.click(relatedRemoveElm)
    pageState = store.getState().pageCreator
    expect(pageState.pageSections[0].tableData.related.length).toBe(0)
})

test('Remove Table Related', async () => {
    const user = userEvent.setup()
    let pageState = store.getState().pageCreator
    expect(pageState.pageSections[0].tableData.related.length).toBe(0)
    const relatedAddElm = screen.getByTestId('table_related_add_0') as HTMLImageElement
    await user.click(relatedAddElm)
    pageState = store.getState().pageCreator
    expect(pageState.pageSections[0].tableData.related.length).toBeGreaterThan(0)
    const relatedElm = screen.getByTestId('table_related_0_0')
    await user.click(relatedElm)
    const relatedRemoveElm = screen.getByTestId('table_related_remove_0') as HTMLImageElement
    await user.click(relatedRemoveElm)
    pageState = store.getState().pageCreator
    expect(pageState.pageSections[0].tableData.related.length).toBe(0)

})