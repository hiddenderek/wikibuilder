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
    const infoAddElm = screen.getByTestId('table_info_add_0') as HTMLImageElement
    await user.click(infoAddElm)
})

afterEach(() => {
    store.dispatch(pageReset())
})

test('change info label', async () => {
    const user = userEvent.setup()
    const labelElm = screen.getByTestId('table_info_label_0_0') as HTMLTextAreaElement
    await user.clear(labelElm)
    await userEvent.type(labelElm, "Test Info Label")
    expect(labelElm.value).toBe("Test Info Label")
})

test('change info text', async () => {
    const user = userEvent.setup()
    const textElm = screen.getByTestId('table_info_text_0_0') as HTMLTextAreaElement
    await user.clear(textElm)
    await user.type(textElm, "Test Info Text")
    expect(textElm.value).toBe("Test Info Text")
})