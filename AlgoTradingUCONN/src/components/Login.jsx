import { signInWithGoogle } from '../services/firebase';
import '../App.css';

const Login = () => {
  return (
      <button className="button" onClick={signInWithGoogle}><i className="fab_fa-google"></i>Sign in</button>
  )
}

export default Login;