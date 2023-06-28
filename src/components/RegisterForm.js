import React from 'react';

const RegisterForm = ({ userData, setUserData, registerUser, handleUsername }) => {
  return (
    <div className="register">
      <input
        id="user-name"
        placeholder="Digite seu nome"
        name="userName"
        value={userData.username}
        onChange={handleUsername}
        className="form-control"
      />
      <button type="button" className="btn btn-primary" onClick={registerUser}>
        Conectar
      </button>
    </div>
  );
};

export default RegisterForm;
