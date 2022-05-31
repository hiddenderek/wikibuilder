/**
 * @jest-environment jsdom
 */
import React from 'react'
import { screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import Banner from './Banner'
import { BrowserRouter as Router } from 'react-router-dom'
import { renderWithRouter } from '../utils/testHelperFunctions'
import userEvent from '@testing-library/user-event'
import { setUser } from '../features/userInterface/userInterface-slice'
import { pageReset } from '../features/pageCreator/pageCreator-slice'

beforeEach(async () => {
    store.dispatch(setUser('testUser'))
    renderWithRouter(
        <Router>
            <Provider store={store}>
                <Banner />
            </Provider>
        </Router>
        , { route: '/home' })
})

afterEach(() => {
    store.dispatch(pageReset())
})

test('banner user display', () => {
    const profileDisplay = screen.getByTestId('banner_profile_display')
    expect(profileDisplay.textContent).toBe("testUser's Profile")
})

test('banner search input', async () => {
    const user = userEvent.setup()
    const searchInput = screen.getByTestId('banner_search_input') as HTMLInputElement
    await user.type(searchInput, "Test Search")
    expect(searchInput.value).toBe("Test Search")
})