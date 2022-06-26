import React, { useEffect } from "react";
import { useHistory } from "react-router";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { handleApiData, successStatus } from '../utils/apicalls'
import { setUser, setSearchTerm } from '../features/userInterface/userInterface-slice'
import config from '../config'

function Banner() {
  const dispatch = useAppDispatch()
  const history = useHistory()
  const currentUser = useAppSelector((state: any) => state.userInterface.user)
  const searchTerm = useAppSelector((state: any) => state.userInterface.searchTerm)
  const doubleBanner = useAppSelector((state: any) => state.userInterface.doubleBanner)
  useEffect(() => {
    if (!currentUser) {
      getCurrentUser()
    }
  }, [])

  async function getCurrentUser() {
    let newCurrentUserGet = await handleApiData(`/currentUser`, null, "get", null)
    if (successStatus.includes(newCurrentUserGet?.status ? newCurrentUserGet.status : 400)) {
      const newCurrentUser = newCurrentUserGet?.data
      dispatch(setUser(newCurrentUser))
    }
  }

  function changeSearchTerm(e: React.FormEvent<HTMLInputElement>) {
    history.push('/home')
    const targetElm = e.target as HTMLInputElement
    dispatch(setSearchTerm(targetElm.value))
  }

  async function signOut() {
    const signOut = await handleApiData('/logout', null, "delete", null, config.authPort as number)
    if (successStatus.includes(signOut?.status ? signOut.status : 400)) {
      history.push('/home')
      dispatch(setSearchTerm(''))
      dispatch(setUser(''))
    }

  }

  return (
    <>
      <div className="banner">
        <a data-testid="banner_home_nav" onClick={(e) => {e.preventDefault(); dispatch(setSearchTerm('')); history.push('/home') }}>
          <img  src="/images/wikiBuilderHome.png" className="bannerHome" draggable="false" />
        </a>
        {!doubleBanner ? 
          <form onSubmit = {(e)=>{e.preventDefault()}}>
            <input data-testid="banner_search_input" className="bannerSearch" type="search" value={searchTerm ? searchTerm : ""} onInput={(e) => { changeSearchTerm(e) }} placeholder="Search wiki title here..." /> 
          </form>
        : ""}
        <div className="bannerLoginContainer">
          {!currentUser ?
            <>
              <a data-testid="banner_log_in" onClick={(e) => { e.preventDefault();history.push('/login') }} >
                <p >Log in</p>
              </a>
              <a data-testid="banner_sign_up" onClick={(e) => {e.preventDefault(); history.push('/signup') }}>
                <p>Sign up</p>
              </a>
            </>
            :
            <>
              <p data-testid="banner_sign_out" onClick={signOut}>Sign out</p>
              <a data-testid="banner_profile_display" onClick={(e) => {e.preventDefault(); history.push(`/profile/${currentUser}`) }}>
                <p>
                  {`${currentUser}'s Profile`}
                </p>
              </a>
            </>}
        </div>
      </div>
      {doubleBanner ?
        <form className="mobileSearchBanner"  onSubmit={(e)=>{e.preventDefault()}}>
          <input data-testid="banner_search_input" className="bannerSearch" type="search" value={searchTerm ? searchTerm : ""} onInput={(e) => { changeSearchTerm(e) }} placeholder="Search wiki title here..." />
        </form>
        : ""}
    </>
  )
}
export default Banner