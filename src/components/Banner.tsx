import React, {useEffect} from "react";
import { useHistory } from "react-router";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { handleApiData, successStatus } from '../utils/apicalls'
import { setUser } from '../features/userInterface/userInterface-slice'

function Banner() {
    const dispatch = useAppDispatch()
    const history = useHistory()
    const currentUser = useAppSelector((state: any) => state.userInterface.user)
    useEffect(() =>{
        if (!currentUser) {
          getCurrentUser()
        }
      }, [])
      async function getCurrentUser(){
        let  newCurrentUserGet = await handleApiData(`/currentUser`, null, "get", null)
        console.log(newCurrentUserGet)
        if (newCurrentUserGet === undefined) {
          newCurrentUserGet = await handleApiData(`/currentUser`, null, "get", null)
        }
        console.log(newCurrentUserGet)
        if (successStatus.includes(newCurrentUserGet?.status ? newCurrentUserGet.status : 400)) {
          const newCurrentUser = newCurrentUserGet?.data
          dispatch(setUser(newCurrentUser))
        } 
      }

    return (
        <div className = "banner">

        </div>
    )
}
export default Banner