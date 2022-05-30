/**
 * @jest-environment jsdom
 */
import React from 'react'
import { screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import WikiContributionTable from './WikiContributionTable'
import { BrowserRouter as Router } from 'react-router-dom'
import { renderWithRouter } from '../utils/testHelperFunctions'
import userEvent from '@testing-library/user-event'
import { setEditMode } from '../features/userInterface/userInterface-slice'
import { pageReset } from '../features/pageCreator/pageCreator-slice'

const testData = [
    {title: "Test page", action_type: "Test Action", time_executed: "12-27-1994"},
    {title: "Test page", action_type: "Test Action 2", time_executed: "1-10-1996"},
    {title: "Test page", action_type: "Test Action 3", time_executed: "5-15-1999"},
    {title: "Test page", action_type: "Test Action 4", time_executed: "10-7-2002"}
]

beforeEach(async () => {
    const user = userEvent.setup()
    store.dispatch(setEditMode(true))
    renderWithRouter(
        <Router>
            <Provider store={store}>
                <WikiContributionTable wikiContributionList={testData} type = "user"/>
            </Provider>
        </Router>
        , { route: '/wiki' })
})

afterEach(() => {
    store.dispatch(pageReset())
})

test('Wiki contribution table populate', ()=>{
    const tableRow = screen.queryAllByTestId("table_row")
    expect(tableRow.length).toBe(testData.length + 2)
})