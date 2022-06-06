/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import WikiPage from '../components/WikiPage'
import { BrowserRouter as Router } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { renderWithRouter } from '../utils/testHelperFunctions'
import { resetUserInterface } from '../features/userInterface/userInterface-slice'
const dispatch = store.dispatch

beforeEach(() => {
    renderWithRouter(
        <Router>
            <Provider store={store}>
                <WikiPage />
            </Provider>
        </Router>
        , { route: '/wiki' })
})

afterEach(() => {
    dispatch(resetUserInterface())
})

async function activateEditMode() {
    const user = userEvent.setup()
    let userInterfaceState = store.getState().userInterface
    expect(userInterfaceState.editMode).toBe(false)
    const editModeButton = screen.getByRole('button', { name: 'Contribute to Page' })
    await user.click(editModeButton)
    Promise.resolve('Edit Mode Active')
}

test('activate edit mode', async () => {
    await activateEditMode()
    let userInterfaceState = store.getState().userInterface
    expect(userInterfaceState.editMode).toBe(true)
})

test('deactivate edit mode', async () => {
    const user = userEvent.setup()
    await activateEditMode()
    let userInterfaceState = store.getState().userInterface
    expect(userInterfaceState.editMode).toBe(true)
    const viewPageButton = screen.getByRole('button', { name: 'View page' })
    await user.click(viewPageButton)
    userInterfaceState = store.getState().userInterface
    expect(userInterfaceState.editMode).toBe(false)
})

test('change page title', async () => {
    const user = userEvent.setup()
    await activateEditMode()
    const titleInput = screen.getByTestId('title_page_input') as HTMLInputElement
    await user.clear(titleInput)
    await user.type(titleInput, 'New Title Test')
    expect(titleInput.value).toBe('New Title Test')
})

test('add page section', async () => {
    const user = userEvent.setup()
    await activateEditMode()
    const pageSectionCheck1 = screen.queryAllByTestId("page_section")
    expect(pageSectionCheck1.length).toBe(1)
    const pageSectionButton = screen.getByRole('button', {name: "Add Section" })
    await user.click(pageSectionButton)
    const pageSectionCheck2 = screen.queryAllByTestId("page_section")
    expect(pageSectionCheck2.length).toBeGreaterThan(1)
})

