/**
 * @jest-environment jsdom
 */
import React from 'react'
import { screen, act, getByTestId, queryAllByTestId } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import Banner from '../components/Banner'
import HomePage from '../components/HomePage'
import { BrowserRouter as Router } from 'react-router-dom'
import { renderWithRouter } from '../utils/testHelperFunctions'
import userEvent from '@testing-library/user-event'
import { setUser } from '../features/userInterface/userInterface-slice'
import { when } from 'jest-when'
import { getAfterLastCharacter } from '../utils/stringParse'


const testWikiFeaturedData = [
    { title: "Featured Page", action_type: "Created page.", time_executed: "12-27-1994" },
]

const testWikiDiscoverData = [
    { title: "Test Page 1", action_type: "Created page.", time_executed: "12-27-1994" },
    { title: "Test Page 2", action_type: "Created page.", time_executed: "1-10-1996" },
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
            } else if (path.includes('/wiki/search')) {
                const allPages = testWikiDiscoverData.concat(testWikiFeaturedData)
                const searchTerm = getAfterLastCharacter({string: path, character: "?search="})
                console.log("search term: " + searchTerm)
                const filteredResult = allPages.filter(item=> item.title.includes(searchTerm))
                console.log("filtered result: " + filteredResult.length)
                act(() => {
                    setState ? setState(filteredResult) : ""
                })
                return {
                    data: filteredResult,
                    status: 200
                }

            }
        }
    }
})

beforeEach(()=>{
    store.dispatch(setUser("testUser"))
    renderWithRouter(
        <Router>
            <Provider store={store}>
                <Banner />
                <HomePage />
            </Provider>
        </Router>
        , { route: '/home' })
})

test('populate home page data', () => {
    const wikiFeaturedContainer = screen.getByTestId("wiki_home_featured")
    const wikiDiscoverContainer = screen.getByTestId("wiki_home_discover")
    const wikiFeaturedCards = queryAllByTestId(wikiFeaturedContainer, "wiki_card")
    const wikiDiscoverCards = queryAllByTestId(wikiDiscoverContainer, "wiki_card")
    const wikiCountElm = screen.queryByText("Wikis created and counting", {exact: false})
    expect(wikiFeaturedCards.length).toBe(testWikiFeaturedData.length)
    expect(wikiDiscoverCards.length).toBe(testWikiDiscoverData.length)
    expect(wikiCountElm?.textContent).toBe("8 Wikis created and counting")
})

test('search wiki pages', async ()=>{
    const user = userEvent.setup()
    const searchInput = screen.getByTestId("banner_search_input") as HTMLInputElement
    await user.type(searchInput, "Test")
    const wikiSearchContainer = screen.getByTestId("wiki_home_search")
    const wikiSearchCards = queryAllByTestId(wikiSearchContainer, "wiki_card")
    expect(wikiSearchCards.length).toBe(2)
    await user.clear(searchInput)
    await user.type(searchInput, "Page")
    const wikiSearchCards_2 = queryAllByTestId(wikiSearchContainer, "wiki_card")
    expect(wikiSearchCards_2.length).toBe(3)
    await user.clear(searchInput)
    await user.type(searchInput, "Failed Search")
    const wikiSearchCards_3 = queryAllByTestId(wikiSearchContainer, "wiki_card")
    expect(wikiSearchCards_3.length).toBe(0)
})