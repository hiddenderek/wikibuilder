/**
 * @jest-environment jsdom
 */
import React from 'react'
import { screen, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import HomePage from './HomePage'
import { BrowserRouter as Router } from 'react-router-dom'
import { renderWithRouter } from '../utils/testHelperFunctions'
import userEvent from '@testing-library/user-event'
import { setUser } from '../features/userInterface/userInterface-slice'
import { when } from 'jest-when'

const testWikiFeaturedData = [
    { title: "Test page 1", action_type: "Created page.", time_executed: "12-27-1994" },
]

const testWikiDiscoverData = [
    { title: "Test page 1", action_type: "Created page.", time_executed: "12-27-1994" },
    { title: "Test page 2", action_type: "Created page.", time_executed: "1-10-1996" },
]

const testWikiCountData = 8

jest.mock('../utils/apicalls', () => {
    return {
        handleApiData: (path: string, setState: Function, action: string, body: object) => {
            console.log(setState)
            if (path.includes('/wiki/featured')) {
                act(() => {
                    setState ? setState(testWikiFeaturedData) : ""
                })
                return {
                    data: testWikiFeaturedData,
                    status: 200
                }
            } else if (path.includes('/wiki/discover')) {
                act(() => {
                    setState ? setState(testWikiDiscoverData) : ""
                })
                return {
                    data: testWikiDiscoverData,
                    status: 200
                }
            } else if (path.includes('/wiki/count')) {
                act(() => {
                    setState ? setState(testWikiCountData) : ""
                })
                return {
                    data: testWikiCountData,
                    status: 200
                }
            }
        }
    }
})


test('populate home page data', () => {
    store.dispatch(setUser("testUser"))
    renderWithRouter(
        <Router>
            <Provider store={store}>
                <HomePage />
            </Provider>
        </Router>
        , { route: '/home' })
    const wikiCard = screen.queryAllByTestId("wiki_card")
    const wikiCountElm = screen.queryByText("Wikis created and counting", {exact: false})
    expect(wikiCard.length).toBe(testWikiDiscoverData.length + 1)
    expect(wikiCountElm?.textContent).toBe("8 Wikis created and counting")
})
