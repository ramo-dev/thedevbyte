import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'sonner';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { account, updateProfile } from '../firebase/firebase';
import signInWithGoogle from './utils/signInWithGoogle';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const Register = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPass, setConfPass] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(true);

    useEffect(() => {
        const unsubscribe = account.onAuthStateChanged(user => {
            if (user) {
                console.log('Logged in:', user);
                navigate('/profile');
            } else {
                console.log('Not logged in');
            }
        });
        return unsubscribe;
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (username.trim() === '' || email.trim() === '' || password.trim() === '') {
            toast.error('Please fill all required fields', {
                style : {background : '#d9534f'},});
        } else if (password.length < 8 || password !== confPass) {
            toast.error('Passwords do not meet requirements or do not match', {
                style : {background : '#d9534f'},});
        } else {
            try {
                const userCredential = await createUserWithEmailAndPassword(account, email, password);
                if (userCredential && userCredential.user) {
                    let displayName = username;
                    let profilePhoto = '';
                    if (userCredential.additionalUserInfo?.providerId === 'google.com') {
                        // If the user signed up with Google, use Google's display name and profile photo
                        displayName = userCredential.user.displayName;
                        profilePhoto = userCredential.user.photoURL;
                    }
                    else{
                        profilePhoto = 'https://gravatar.com/avatar/06f56e5ed6d49e86a1f8735b41d1e8ca?s=400&d=robohash&r=x'
                    }
                    await updateProfile(userCredential.user, { displayName, photoURL: profilePhoto });
                    await addUserToFirestore(userCredential.user.uid, displayName, email, profilePhoto); // Pass displayName and profilePhoto here
                    toast.success("Account Created Successfully",
                    {style: { background: '#5cb85c' }});
                    setIsPasswordValid(true);
                }
            } catch (error) {
                toast.error(error.message, {
                    style : {background : '#d9534f'},});
            }
        }
    };

    const addUserToFirestore = async (userId, username, email, profilePhoto) => {
        try {
            const userRef = doc(db, 'users', userId);
            await setDoc(userRef, {
                username,
                email,
                profilePhoto,
                // You can add other user data here if needed
            });
            console.log('User added to Firestore:', username);
        } catch (error) {
            console.error('Error adding user to Firestore:', error);
        }
    };

    // Handle password change
    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setIsPasswordValid(newPassword.length >= 8 && newPassword === confPass);
    };

    // Handle confirm password change
    const handleConfPasswordChange = (e) => {
        const newConfPassword = e.target.value;
        setConfPass(newConfPassword);
        setIsPasswordValid(password.length >= 8 && password === newConfPassword);
    };

    return (
        <div className="container">
            <Toaster position='top-right' richColors />
            <div className="containerimg-reg">
                <h1>Welcome To Devbyte</h1>
            </div>
            <div className="wrapper">
                <h2>Registration</h2>
                <form action="#" onSubmit={handleSubmit}>
                    <div className="input-box">
                        <input type="text" placeholder="Enter Username" required onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="input-box">
                        <input type="email" placeholder="Enter Your email" required onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder="Create password" required onChange={handlePasswordChange} />
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder="Confirm password" required onChange={handleConfPasswordChange} />
                    </div>
                    <div className="policy">
                        <input type="checkbox" required />
                        <h3>I accept all terms & condition</h3>
                    </div>
                    <div className="input-box button">
                        <button disabled={!isPasswordValid}>Register</button>
                    </div>
                </form>

                <div className="input-box button">
                    {/* <button onClick={signInWithGoogle}> Continue with <i className="fa-brands fa-google"></i>oogle</button> */}
                </div>
                <div className="text">
                    <h3>Already have an account? <Link to='/login'>Login now</Link></h3>
                </div>
            </div>
        </div>
    );
}

export default Register;
