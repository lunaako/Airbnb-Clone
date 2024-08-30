import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          console.log(data)
          if (data?.errors) {
            setErrors(data.errors);
          }

        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  const isDisabled = () => {
    const checkPassword = password.length >= 6;
    const checkUsername = username.length >= 4;
    const checkFirstName = firstName.length;
    const checkLastName = lastName.length;
    const checkEmail = email.length;
    const checkConfirmPassword = confirmPassword.length >= 6;
    return !(checkPassword 
            && checkConfirmPassword 
            && checkEmail 
            && checkFirstName 
            && checkLastName 
            && checkUsername)
  }

  return (
    <>
      <h1 id='signup-title'>Sign Up</h1>

      {errors.email && <p style={{textAlign: 'center', color: 'red'}}>{errors.email}</p>}
      {errors.username && <p style={{textAlign: 'center', color: 'red'}}>{errors.username}</p>}
      {errors.firstName && <p style={{textAlign: 'center', color: 'red'}}>{errors.firstName}</p>}
      {errors.lastName && <p style={{textAlign: 'center', color: 'red'}}>{errors.lastName}</p>}
      {errors.password && <p style={{textAlign: 'center', color: 'red'}}>{errors.password}</p>}
      {errors.confirmPassword && (
          <p style={{textAlign: 'center', color: 'red'}}>{errors.confirmPassword}</p>
        )}

      <form className="signup-form-profile" onSubmit={handleSubmit}>

        <label className='signup-firstname'>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>

        <div className='signup-divider'></div>

        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>

        <div className='signup-divider'></div>
        
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>

        <button 
          className='signup-button'
          disabled = {isDisabled()}
          type="submit"
        >Sign Up</button>
      </form>
    </>
  );
}

export default SignupFormModal;