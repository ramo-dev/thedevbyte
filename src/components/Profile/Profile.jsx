import React, { useState, useEffect } from 'react';
import Navbar from "../Navbar/Navbar";
import { account, updateProfile } from "../../firebase/firebase";
import { profileImgs } from './pics';
import './profileStyles.css';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { Link } from 'react-router-dom';
import { toast,Toaster } from 'sonner';

const Profile = () => {
    const [newUsername, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [profilePhoto, setProfilePhoto] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDoc = await getDoc(doc(db, 'users', account.currentUser.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUsername(userData.username || account?.currentUser?.displayName);
                    setProfilePhoto(userData.photoURL || account?.currentUser?.photoURL);
                } else {
                    console.log('User document not found');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (account.currentUser) {
            fetchUserData();
        }

        const unsubscribe = account.onAuthStateChanged((user) => {
            if (user) {
                setEmail(user.email || '');
            }
        });

        return () => unsubscribe();
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        try {
            const updatedProfile = {};
            const userDocRef = doc(db, 'users', account.currentUser.uid);

            if (newUsername) {
                updatedProfile.displayName = newUsername;
            await updateDoc(userDocRef , {username : newUsername} )
            }

            if (email) {
                updatedProfile.email = email;
            }

            if (profilePhoto) {
                // Update the profile picture in authentication
                await updateProfile(account.currentUser, { photoURL: profilePhoto });

                // Update the profile picture URL in the user document in Firestore
                
                await updateDoc(userDocRef, { photoURL: profilePhoto });
            }

            // Update the profile with the provided fields
            await updateProfile(account.currentUser, updatedProfile);

        toast('Profile updated successfully!', {
        style : {background : '#5cb85c'},});
        } catch (error) {
            console.error('Error updating profile:', error.message);
            toast('Error updating profile. Please try again.', {
                style : {background : '#d9534f'},});
        }
    };

    const handleAvatarSelection = (selectedImgUrl) => {
        setProfilePhoto(selectedImgUrl);
    };

    return (
        <>
            <Navbar />
        <Toaster position='top-right' richColors/>
            <div className="profileSettings">
                <Link to='/'><i className="fa-solid fa-left-long backarrow"></i></Link>
                <div className="SetProfilePic">
                    <h2 className="userDisplayName">
                        {newUsername}
                    </h2>
                    <label htmlFor="profilePhotoInput">
                        <img src={profilePhoto} alt="" className="userDisplayPhoto" />
                    </label>
                    <h4>Select an avatar</h4>
                    <div className="imgSelector">
                        {profileImgs.map((img) => (
                            <div className="imgCard" key={img.name} onClick={() => handleAvatarSelection(img.url)}>
                                <img src={img.url} alt="" />
                                <p>{img.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="changeProfileInfo">
                    <h2>Edit Profile</h2>
                    <form onSubmit={handleUpdateProfile}>
                        <label htmlFor="username">Username: </label>
                        <input type="text" name="username" id="username" value={newUsername} onChange={(e) => setUsername(e.target.value)} />
                        <label htmlFor="email">Email: </label>
                        <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <label htmlFor="confirmEmail">Confirm Email: </label>
                        <input type="email" name="confirmEmail" id="confirmEmail" value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)} />
                        <button type="submit" className="button">Update info</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Profile;
