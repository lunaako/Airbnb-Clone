import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        
        //!if username or password are invalid --> show an err message
        if (data && data.message) {
          setErrors({ credential: 'The provided credentials were invalid.' });
        }
      });
  };

  return (
    <>
      <h1 id='login-title'>Log In</h1>

      {errors.credential && (
          <p style={{color: 'red', textAlign: 'center'}}>{errors.credential}</p>
        )}

      <form onSubmit={handleSubmit}>
        <label className="loginLabel">
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>

        <label className="loginLabel">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button 
          disabled = {credential.length < 4 || password.length < 6}
          type="submit"
          id='login-button'
        >Log In</button>
      </form>

      <button
        onClick={() => dispatch(sessionActions.login({'credential': 'Demo-lition', 'password': 'password'})).then(() => dispatch(sessionActions.getSessionSpotsThunk())).then(closeModal)}
        id='demo-user-login'
      >Demo User</button>
    </>
  );
}

export default LoginFormModal;