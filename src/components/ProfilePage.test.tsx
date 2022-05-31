/**
 * @jest-environment jsdom
 */
import React from 'react'
import { screen, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import ProfilePage from './ProfilePage'
import { BrowserRouter as Router } from 'react-router-dom'
import { renderWithRouter } from '../utils/testHelperFunctions'
import userEvent from '@testing-library/user-event'
import { setUser } from '../features/userInterface/userInterface-slice'
import { when } from 'jest-when'

const testWikiContributionData = [
    {title: "Test page 1", action_type: "Test Action", time_executed: "12-27-1994"},
    {title: "Test page 1", action_type: "Test Action 2", time_executed: "1-10-1996"},
    {title: "Test page 2", action_type: "Test Action 3", time_executed: "5-15-1999"},
    {title: "Test page 2", action_type: "Test Action 4", time_executed: "10-7-2002"}
]

const testWikiCreatedData = [
    {title: "Test page 1", action_type: "Created page.", time_executed: "12-27-1994"},
    {title: "Test page 2", action_type: "Created page.", time_executed: "1-10-1996"},
]

jest.mock('../utils/apicalls', () => {
    return {
        handleApiData: (path: string, setState: Function, action: string, body: object) => {
            console.log(setState)
            if (!path.includes('?created=')) {
                act(() => {
                    setState ? setState(testWikiContributionData) : ""
                })
                return {
                    data: testWikiContributionData,
                    status: 200
                }
            } else {
                act(() => {
                    setState ? setState(testWikiCreatedData) : ""
                })
                return {
                    data: testWikiCreatedData,
                    status: 200
                }
            }
        }
    }
})


test('populate data with current user matching endpoint', ()=>{
    store.dispatch(setUser("testUser"))
    renderWithRouter(
        <Router>
            <Provider store={store}>
                <ProfilePage />
            </Provider>
        </Router>
        , { route: '/profile/testUser' })
    const tableRow = screen.queryAllByTestId("table_row")
    const wikiCard = screen.queryAllByTestId("wiki_card")
    console.log("ROW LENGTH: " + tableRow.length)
    console.log("CARD LENGTH: " + wikiCard.length)
    expect(tableRow.length).toBe(testWikiContributionData.length + 2)
    expect(wikiCard.length).toBe(testWikiCreatedData.length)
})

test('populate data with current user not matching endpoint', ()=>{
    store.dispatch(setUser("differentUser"))
    renderWithRouter(
        <Router>
            <Provider store={store}>
                <ProfilePage />
            </Provider>
        </Router>
        , { route: '/profile/testUser' })
    const tableRow = screen.queryAllByTestId("table_row")
    const wikiCard = screen.queryAllByTestId("wiki_card")
    console.log("ROW LENGTH: " + tableRow.length)
    console.log("CARD LENGTH: " + wikiCard.length)
    expect(tableRow.length).toBe(testWikiContributionData.length + 2)
    expect(wikiCard.length).toBe(testWikiCreatedData.length)
})

test('populate data with no current user and an endpoint', ()=>{
    store.dispatch(setUser(""))
    renderWithRouter(
        <Router>
            <Provider store={store}>
                <ProfilePage />
            </Provider>
        </Router>
        , { route: '/profile/testUser' })
    const tableRow = screen.queryAllByTestId("table_row")
    const wikiCard = screen.queryAllByTestId("wiki_card")
    console.log("ROW LENGTH: " + tableRow.length)
    console.log("CARD LENGTH: " + wikiCard.length)
    expect(tableRow.length).toBe(testWikiContributionData.length + 2)
    expect(wikiCard.length).toBe(testWikiCreatedData.length)
})

test('populate data with no current user and no endpoint', ()=>{
    store.dispatch(setUser(""))
    renderWithRouter(
        <Router>
            <Provider store={store}>
                <ProfilePage />
            </Provider>
        </Router>
        , { route: '/profile' })
    const tableRow = screen.queryAllByTestId("table_row")
    const wikiCard = screen.queryAllByTestId("wiki_card")
    console.log("ROW LENGTH: " + tableRow.length)
    console.log("CARD LENGTH: " + wikiCard.length)
    expect(tableRow.length).toBe(testWikiContributionData.length + 2)
    expect(wikiCard.length).toBe(testWikiCreatedData.length)
})