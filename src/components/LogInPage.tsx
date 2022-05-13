import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useAppDispatch } from '../app/hooks'
import { handleApiData, successStatus } from '../utils/apicalls'
import config from '../config'
import {setUser} from '../features/userInterface/userInterface-slice'
function LogIn(props: any) {
    const dispatch = useAppDispatch()
    const history = useHistory()
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    function changeName(e: React.FormEvent<HTMLInputElement>) {
        const targetElm = e.target as HTMLInputElement
        setUserName(targetElm.value)
    }
    function changePassword(e: React.FormEvent<HTMLInputElement>) {
        const targetElm = e.target as HTMLInputElement
        setPassword(targetElm.value)
    }
    async function login(e: any) {
        try {
            const logInResult = await handleApiData(`/login`, null, "post", {userName, password}, config.authPort as number)
            if (successStatus.includes(logInResult?.status ? logInResult.status : 400)) {
                history.push('/profile')
                try {
                    dispatch(setUser(JSON.parse(logInResult?.data).name))
                } catch (e) {
                    console.log('USER SET ERROR: ' + e)
                }
            } else if (logInResult?.data) {
                setErrorMessage(logInResult.data)
            } else {
                setErrorMessage('Login failed.')
            }
        } catch (e) {
            console.log("LOGIN ERROR" + e)
            setErrorMessage('Something went wrong. Check console for more info.')
        }
    }
    return (
        <div className = "content page">
            {errorMessage ?
                <div className={`halfWidth flexCenter mediumLineHeight errorMessage`}>
                    <p>{errorMessage}</p>
                </div>
                : ""}
            <form className="halfWidth flexEdges mediumLineHeight" autoComplete="on" onSubmit= {(e)=>{e.preventDefault()}}>
                <label>User Name: </label>
                <input className="mediumRelInput" placeholder="symbol name..."  onInput={(e) => { changeName(e) }}  style = {{color: "white"}} />
            </form>
            <form className="halfWidth flexEdges mediumLineHeight" autoComplete="on" onSubmit= {(e)=>{e.preventDefault()}} >
                <label>Password</label>
                <input className="mediumRelInput" type="password" placeholder="symbol name..."  onInput={(e) => { changePassword(e) }}  style = {{color: "white"}}/>
            </form>
            <form className="flexCenter mediumLineHeight">
                <button type="button" className="startButton" onClick={login}>Login</button>
            </form>
        </div>

    );
}

export default LogIn