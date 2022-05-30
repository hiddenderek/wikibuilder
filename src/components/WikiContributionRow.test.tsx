/**
 * @jest-environment jsdom
 */
 import React from 'react'
 import { render, screen, fireEvent } from '@testing-library/react'
 import { Provider } from 'react-redux'
 import { store } from '../app/store'
 import WikiContributionRow from './WikiContributionRow'
 import { BrowserRouter as Router } from 'react-router-dom'
 import userEvent from '@testing-library/user-event'
 import { renderWithRouter } from '../utils/testHelperFunctions'
 import { resetUserInterface } from '../features/userInterface/userInterface-slice'
 const dispatch = store.dispatch
 
 beforeEach(() => {
     renderWithRouter(
         <Router>
             <Provider store={store}>
                 <WikiContributionRow title = "Test Page" action_type = "Test Action" time_executed = "12-27-1994"/>
             </Provider>
         </Router>
         , { route: '/wiki' })
 })
 
 afterEach(() => {
     dispatch(resetUserInterface())
 })

 test('Row populate test', () => {
    const rowElmTitle = screen.getByTestId('table_row_title')
    const rowElmAction = screen.getByTestId('table_row_action')
    const rowElmTime = screen.getByTestId('table_row_time')
    expect(rowElmTitle.textContent).toBe("Test Page")
    expect(rowElmAction.textContent).toBe("Test Action")
    expect(rowElmTime.textContent).toBe("12-27-1994")
 })