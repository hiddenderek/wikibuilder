import cypress from 'cypress'
import config from '../../src/config'

Cypress.Cookies.defaults({
  preserve: "secureCookie"
})

describe('spec.cy.ts', () => {
  before(() => {
    cy.exec(`psql -f cypress/e2e/reset-database.sql "dbname=wikibuilder user=postgres password=D@c77357 host=${config.hostname} port=5433"`, {timeout: 2000})
    cy.clearCookies()
    cy.visit(`https://${config.hostname}:${config.port}/home`)
  })

  it('Sign up', () => {
    //check to see if all necessary elements exist first.
    cy.get('[data-testid=banner_sign_up]').should('exist')
    cy.get('[data-testid=banner_sign_up]').click()
    cy.get('[data-testid=user_input').should('exist')
    cy.get('[data-testid=pswd_input').should('exist')
    cy.get('[data-testid=c_pswd_input').should('exist')
    cy.get('[data-testid=dob_input]').should('exist')
    cy.get('[data-testid=signup_btn]').should('exist')
    cy.get('[data-testid=user_input').type('testUser')
    cy.get('[data-testid=pswd_input').type('asdf1234$')
    cy.get('[data-testid=c_pswd_input').type('asdf1234$')
    cy.get('[data-testid=dob_input').type('2020-05-01', { force: true })
    cy.get('[data-testid=signup_btn]').click()
    cy.get('[data-testid=sign_up_log_in_nav]').should('exist')
    cy.get('[data-testid=sign_up_log_in_nav]').click()
  })

  it('Log in', () => {
    //check to see if all necessary elements exist first.
    cy.get('[data-testid=user_login_input]').should('exist')
    cy.get('[data-testid=pswd_login_input]').should('exist')
    cy.get('[data-testid=log_in_button]').should('exist')

    cy.get('[data-testid=user_login_input]').type('testUser')
    cy.get('[data-testid=pswd_login_input]').type('asdf1234$')
    cy.get('[data-testid=log_in_button]').click()
  })

  it('Profile navigate', () => {
    cy.wait(500)
    cy.get('[data-testid=banner_profile_display]').should('exist')
    cy.get('[data-testid=banner_profile_display]').click()
    cy.get('[data-testid=profile_name_display]').should('exist')
  })

  it('Create wiki', () => {
    cy.get('[data-testid=profile_page_create]').should('exist')
    cy.get('[data-testid=profile_page_create]').click()
  })

  it('Edit wiki', () => {
    //check to see if all necessary elements exist first.
    cy.get('[data-testid=page_contribute_button]').should('exist')
    cy.get('[data-testid=title_page_input]').should('exist')
    cy.get('[data-testid=page_contribute_button]').click()
    cy.get('[data-testid=title_page_input]').clear()
    cy.get('[data-testid=title_page_input]').type('Test page')
    cy.get('[data-testid=page_save_toggle_button]').click()

    //check to see if all necessary elements exist first.
    cy.get('[data-testid=page_save_button]').should('exist')
    cy.get('[data-testid=page_save_close_button]').should('exist')
    cy.get('[data-testid=page_contribution_action_input]').should('exist')
    
    cy.get('[data-testid=page_contribution_action_input]').type('added new page')
    cy.get('[data-testid=page_save_button]').click()
    cy.contains('Saved page successfully.', {timeout: 4000}).should('exist')
    cy.get('[data-testid=page_save_close_button]').click()
  })

  it('Navigate to user from contribution table', () => {
    cy.get('[data-testid=page_view_contributions_button]').should('exist')
    cy.get('[data-testid=page_view_contributions_button]').click()
    cy.wait(500)
    cy.get('[data-testid=table_row]').within(() => {
      cy.contains('testUser').should('exist')
      cy.contains('testUser').click()
    })
  })

  it('Navigate to wiki from profile contribution table', () => {
    cy.wait(500)
    cy.get('[data-testid=table_row]').within(() => {
      cy.contains('Test page').should('exist')
      cy.contains('Test page').click()
    })
  })

  it('Home navigate', () => {
    cy.get('[data-testid=banner_home_nav]').should('exist')
    cy.get('[data-testid=banner_home_nav]').click()
    cy.get('[data-testid=wiki_home_discover]').should('exist')
  })

  it('Discover wikis', () => {
    cy.get('[data-testid=wiki_home_discover]').should('exist')
    cy.get('[data-testid=wiki_home_discover_button]').should('exist')
    cy.get('[data-testid=wiki_home_discover_button]').should('have.attr', 'style').should('contain', 'transform: rotate(0deg)')

    cy.get('[data-testid=wiki_home_discover_button]').click()
    cy.get('[data-testid=wiki_home_discover_button]').should('have.attr', 'style').should('contain', 'transform: rotate(360deg)')
  })

  it('Search wikis', () => {
    cy.get('[data-testid=banner_search_input]').should('exist')
    cy.get('[data-testid=banner_search_input]').type('Test')
    cy.get('[data-testid=wiki_card]').should('exist')
    cy.get('[data-testid=wiki_card]').within(()=>{
      cy.contains('Test page').should('exist')
    })
    cy.get('[data-testid=banner_search_input]').clear()
    cy.get('[data-testid=banner_search_input]').type('Failed')
    cy.get('[data-testid=wiki_card]').should('not.exist')
  })

  it('Sign out', () => {
    cy.get('[data-testid=banner_sign_out]').should('exist')
    cy.get('[data-testid=banner_sign_out]').click()
    cy.get('[data-testid=banner_sign_up]').should('exist')
  })

})
