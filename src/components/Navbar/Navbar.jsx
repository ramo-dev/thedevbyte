// Navbar.jsx
import { Link } from "react-router-dom";
import '../Navbar/navbarStyles.css';
import { account,updateProfile } from "../../firebase/firebase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const [isLoggedin, setIsLoggedIn] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        // Retrieve dark mode state from local storage or default to false
        return localStorage.getItem('darkMode') === 'true';
    });
    const [profilepic, setProfilePic] = useState(null);
    const [username, setUsername] = useState("");
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = account.onAuthStateChanged(user => {
            setIsLoggedIn(!!user);
        
            if (user) {
                setUsername(user.displayName);
                setProfilePic(user.photoURL);
            }
        });
        
        return unsubscribe;
 
    }, []);

    useEffect(() => {
        // Update CSS variables based on dark mode state
        
        document.documentElement.style.setProperty('--background-color', darkMode ? '#111' : '#fff');
        document.documentElement.style.setProperty('--primary-color', darkMode ? 'crimson' : 'crimson');
        document.documentElement.style.setProperty('--text-color', darkMode ? '#fff' : '#000');
        // Store dark mode state in local storage
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    function handleThemeClick() {
        setDarkMode(prevDarkMode => !prevDarkMode); 
    }

    function handleLogout() {
        account.signOut();
        const Timer = setTimeout(() => {
    navigate('/')
        }, 300);

        return () => clearTimeout(Timer);
    }

    const toggleNav = () => {
        setIsSideNavOpen(prevState => !prevState);
    };

    let profilePic = null
    if(account?.currentUser?.photoURL){
        profilePic = account?.currentUser?.photoURL
    }
    else{
        profilePic = 'https://gravatar.com/avatar/5142c06675d78f0bbca30f750662b8ea?s=400&d=robohash&r=x'
    }
    return ( 
        <>
        <nav>
            <div className="logo">
                <Link to='/'><h1>Devbyte</h1></Link>
            </div>

            <div className="nav-button">
                <button className="themeMode" onClick={handleThemeClick}>
                    {darkMode ? <i className="fa-solid fa-moon"></i> : <i className="fa fa-sun"></i>}
                </button>

                {isLoggedin ? (
                    <>
                        <img src={profilePic} alt="Profile" className="UserProfile" onClick={toggleNav} />
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to='/login'><button>Login</button></Link>
                        <Link to='/register'><button>SignUp</button></Link>
                    </>
                )}
            </div>
        </nav>
        <div id="mySidenav" className={`sidenav ${isSideNavOpen ? 'open' : ''}`}>
            <a href="javascript:void(0)" className="closebtn" onClick={toggleNav}>&times;</a>
                            <div className="sidebar-profile-flex">
                                <img src={profilePic} alt="Profile" className="UserProfile"/>
                                {account?.currentUser?.displayName ? <p>{username}</p> : <p>You</p>}
                            </div>
                    <Link to="/">Posts</Link>
                    <Link to="/profile">Profile</Link>
                    
            {isLoggedin && <button onClick={handleLogout} className="button">Logout</button>}
        </div>
        </>
     );
}
 
export default Navbar;
