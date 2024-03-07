import { useEffect, useState } from "react";
import { account, db, storage } from "../firebase/firebase";
import Navbar from "../components/Navbar/Navbar";
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { toast,Toaster } from "sonner";

const Profile = () => {
    const [username, setUsername] = useState();
    const [posts, setPosts] = useState([]);
    const [postTitle, setPostTitle] = useState("");
    const [postBody, setPostBody] = useState("");
    const [imgsrc, setImageSrc] = useState(null);
    const [ userId, setUserID] = useState(null);
    const postRef = collection(db, "posts"); // reference to the collection in our database



    function showToast(e){
    e.preventDefault()
        toast.success('welcome to web dev', {
                style : {background : 'rgb(33, 190, 67)'},} )
    }

    return (
        <>
            <Navbar />
            <Toaster richColors
            position="top-right"
            />
            <div className="Myprofile">
                <button onClick={showToast} className="button">Show Toast</button>
            </div>
        </>
    );
}

export default Profile;
