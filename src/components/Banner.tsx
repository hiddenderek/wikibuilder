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
  useEffect(() => {
    if (!currentUser) {
      getCurrentUser()
    }
  }, [])
  async function getCurrentUser() {
    let newCurrentUserGet = await handleApiData(`/currentUser`, null, "get", null)
    console.log(newCurrentUserGet)
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
    <div className="banner">
      <img onClick={() => { dispatch(setSearchTerm('')); history.push('/home') }} src="/images/wikiBuilderHome.png" className="bannerHome" draggable="false" />
      <input data-testid = "banner_search_input" className="bannerSearch" type="search" value={searchTerm} onInput={(e) => { changeSearchTerm(e) }} placeholder="Search wiki title here..." />
      <div className="bannerLoginContainer">
        {!currentUser ?
          <>
            <p onClick={() => { history.push('/login') }}>Log in</p>
            <p onClick={() => { history.push('/signup') }}>Sign up</p>
          </>
          : 
          <>
            <p onClick = {signOut}>Sign out</p>
            <p data-testid = "banner_profile_display" onClick={() => { history.push(`/profile/${currentUser}`) }}>
              {`${currentUser}'s Profile`}
            </p>
          </>}
      </div>
    </div>
  )
}
export default Banner