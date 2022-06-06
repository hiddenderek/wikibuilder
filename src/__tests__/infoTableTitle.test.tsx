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
    const titleAddElm = screen.getByTestId('table_title_add_0') as HTMLImageElement
    await user.click(titleAddElm)
})

afterEach(() => {
    store.dispatch(pageReset())
})

test('change table title', async () => {
    const user = userEvent.setup()
    const titleInputElm = screen.getByTestId('table_title_input_0_0') as HTMLTextAreaElement
    await user.clear(titleInputElm)
    await user.type(titleInputElm, "title test")
    expect(titleInputElm.value).toBe("title test")
})