/**
 * @jest-environment jsdom
 */
import React from 'react'
import { screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import WikiPage from './WikiPage'
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
    const relatedAddElm = screen.getByTestId('table_related_add_0') as HTMLImageElement
    await user.click(relatedAddElm)
})

afterEach(() => {
    store.dispatch(pageReset())
})

test('change related url', async () => {
    const user = userEvent.setup()
    const relatedInputElm = screen.getByTestId('table_related_input_0_0') as HTMLTextAreaElement
    await user.type(relatedInputElm, "test_url.com")
    expect(relatedInputElm.value).toBe("")
})