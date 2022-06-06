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
import { text } from 'stream/consumers'

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
    const textAddElm = screen.getByTestId('table_text_add_0') as HTMLImageElement
    await user.click(textAddElm)
})

afterEach(() => {
    store.dispatch(pageReset())
})

test('change info text', async () => {
    const user = userEvent.setup()
    const textInputElm = screen.getByTestId('table_text_input_0_0') as HTMLTextAreaElement
    await user.clear(textInputElm)
    await user.type(textInputElm, "test text")
    expect(textInputElm.value).toBe("test text")
})