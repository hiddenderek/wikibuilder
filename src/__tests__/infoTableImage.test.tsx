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
    const imageAddElm = screen.getByTestId('table_image_add_0') as HTMLImageElement
    await user.click(imageAddElm)
})

afterEach(() => {
    store.dispatch(pageReset())
})

test('image menu toggle', async () => {
    const user = userEvent.setup()
    const imageMenuElmCheck1 = screen.queryAllByTestId('table_image_menu_0_0')
    expect(imageMenuElmCheck1.length).toBeGreaterThan(0)
    const imageMenuBtnElm = screen.getByTestId('table_image_menu_btn_0_0')
    await user.click(imageMenuBtnElm)
    const imageMenuElmCheck2 = screen.queryAllByTestId('table_image_menu_0_0')
    expect(imageMenuElmCheck2.length).toBe(0)
})