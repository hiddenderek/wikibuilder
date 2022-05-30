import React, { useEffect, useState } from 'react'
import config from '../config'
import { useHistory } from 'react-router-dom';
import { handleApiData, successStatus } from '../utils/apicalls';

function SignUpPage() {
  const history = useHistory()
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [signUpMessage, setSignUpMessage] = useState('')

  useEffect(() => {
    setSignUpMessage('')
    if (!userName) {
        setErrorMessage('Username must be specified.')
    } else if (password.length < 8) {
        setErrorMessage('password length must be greater than 8 characters.')
    } else if (password.search(/[a-z]/i) < 0) {
        setErrorMessage('password must include at least one letter.')
    } else if (password.search(/[0-9]/i) < 0) {
        setErrorMessage('password must include at least one number.')
    } else if (password.search(/[!@#$%^&*()+=-\?;,./{}|\":<>\[\]\\\' ~_/]/i) < 0) {
        setErrorMessage('password must include at least one special character.')
    } else if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.')
    } else if (!dateOfBirth) {
        setErrorMessage('Date of birth must be specified.')
    } else {
        setErrorMessage('')
    }
}, [userName, password, confirmPassword, dateOfBirth])

  async function signUp(e:any) {
    e.preventDefault()
    if (!errorMessage) {
      const signUpResult = await handleApiData(`/users/${userName}`, null, "post", {password, dateOfBirth})
      if (successStatus.includes(signUpResult?.status ? signUpResult.status : 400)) {
        setErrorMessage('')
        setSignUpMessage(signUpResult!.data.split("\"").join(""))
      } else {
        setErrorMessage(signUpResult?.data)
        setSignUpMessage('')
      }
    } else {
    }
  }

  function specifyUserName(e: any) {
    e.preventDefault()
    setUserName(e.target.value)
  }
  function specifyPassword(e: any) {
    e.preventDefault()
    setPassword(e.target.value)
  }
  function specifyConfirmPassword(e: any) {
    e.preventDefault()
    setConfirmPassword(e.target.value)
  }
  function specifyDateOfBirth(e: any) {
    e.preventDefault()
    console.log(e.target.value)
    setDateOfBirth(e.target.value)
  }
  function profileNavigate() {
    history.push(`/login`)
  }
  return (
    <div className="content page">
      <div className="signUpPopup">
        <h1 className="popupHeader" >Sign Up</h1>
        <div className="singleLine">
          <label>User Name: </label>
          <input data-testid = "user_input" className="mediumRelInput" type="text" placeholder="User Name..." onInput={specifyUserName} ></input>
        </div>
        <div className="singleLine">
          <label>Password: </label>
          <input data-testid = "pswd_input" className="mediumRelInput" type="password" placeholder="Password..."  onInput={specifyPassword}></input>
        </div>
        <div className="singleLine">
          <label>Confirm Password: </label>
          <input data-testid = "c_pswd_input" className="mediumRelInput" type="password" placeholder="Confirm Password..." onInput={specifyConfirmPassword}></input>
        </div>
        <div className="singleLine">
          <label>Date of Birth: </label>
          <input data-testid = "dob_input" className="mediumRelInput" type="date" onChange={specifyDateOfBirth}></input>
        </div>
        <form className="singleLine" onSubmit={(e)=>{signUp(e)}}>
          <button className={errorMessage ? "inactiveButton center" : "activeButton center"}>Submit</button>
        </form>
        {errorMessage ?
          <div className="singleLine">
            <p data-testid = "error_message" className="center">Error: {errorMessage}</p>
          </div> : ""}
        {!errorMessage && signUpMessage ? 
        <div className="fullWidth">
            <div className = "singleLine">
              <p className="center">Sign up successfull!</p>
            </div>
            <div className= "singleLine" >
              <button className="center" onClick={profileNavigate}>Continue to login</button>
            </div>
        </div> : ""}
      </div>
    </div>
  );
}
export default SignUpPage