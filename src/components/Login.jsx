import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { account } from "../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import signInWithGoogle from '../components/utils/signInWithGoogle';

const Login = () => {
    const navigate = useNavigate();

    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [password, setPassword ] = useState('');
    const [email, setEmail ] = useState('');
    const [isLoggedin, setIsLoggedIn] = useState(false);
    const [isLoginLoading, setIsLoginLoading] = useState(false); 



    useEffect(() => {
        const unsubscribe = account.onAuthStateChanged(user => {
            if (user) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        });
        
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (isLoggedin) {
            navigate('/');
        }
    }, [isLoggedin, navigate]);

    async function LoginWithEmailandPassword() {
        try {
            setIsLoginLoading(true); // Set loading state to true when login starts
            const user = await signInWithEmailAndPassword(account, email, password);
            !!user && toast.success('Login successful', {
                style : {background : '#5cb85c'},});
            setIsLoggedIn(true);
        } catch (err) {
            console.log(err);
            // toast.error('Invalid Email or Password');
            alert('Invalid Email or Password')
            setIsLoggedIn(false);
        } finally {
            setIsLoginLoading(false); // Set loading state to false when login completes
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (password.length < 8) {
            // toast.error('Password must be more than 8 characters');
            alert('Password must be more than 8 characters')
        } else {
            setIsPasswordValid(true);
            LoginWithEmailandPassword();
        }
    }

    return ( 
        <div className="container">
        <Toaster position="top-right" richColors/>
            <div className="containerimg">
                <h1>Welcome Back</h1>
            </div>
            <div className="wrapper">
                <h2>Login</h2>
                <form action="#" onSubmit={handleSubmit}>
                    <div className="input-box">
                        <input type="email" placeholder="Enter your email" required onChange={(e)=> setEmail(e.target.value)}/>
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder="Create password" required onChange={(e)=> setPassword(e.target.value)}/>
                    </div>
                    <div className="input-box button">
                        <button disabled={isLoginLoading}> {isLoginLoading ? 'Logging In...' : 'Login'} </button> {/* Disable button while login loading */}
                    </div>
                </form>
                <div className="input-box button">
                    <button onClick={signInWithGoogle}> Continue with <i className="fa-brands fa-google"></i>oogle</button>
                </div>
                <div className="text">
                    <h3>Dont have an account? <Link to='/register'>Register now</Link></h3>
                </div>
            </div>
        </div>
     );
}
 
export default Login;
