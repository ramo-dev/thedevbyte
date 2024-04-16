import './blogsStyles.css';
import { useEffect, useState } from 'react';
import { account, db, storage } from '../../firebase/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, getDoc } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { Await, Link } from 'react-router-dom';
import { toast, Toaster } from 'sonner';

const BlogsData = () => {
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedin, setIsLoggedIn] = useState(false);
    const [query, setQuery] = useState('');
    const [match, setMatch] = useState(0);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imgsrc, setImageSrc] = useState(null);
    const [username, setUsername] = useState(null);
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
    const postsCollection = collection(db, 'posts');

    useEffect(() => {
        fetchData();
        const unsubscribe = account.onAuthStateChanged(user => {
            setIsLoggedIn(!!user);
            console.log(user.uid)
        });
        return unsubscribe;
    }, []);

    async function fetchData() {
        toast.loading('Fetching Posts...', {
            style: { background: '#292b2c' }, duration: 400
        });
    
        try {
            const querySnapshot = await getDocs(postsCollection);
            const fetchedBlogs = [];
            for (const doc of querySnapshot.docs) {
                const data = doc.data();
                const imageURL = await getImageURL(data.imageURL);
                const userData = await getUserData(data.userId);
                fetchedBlogs.push({ ...data, id: doc.id, imageURL: imageURL, username: userData.username, profilePhoto: userData.photoURL });
            }
            toast.dismiss();
            setBlogs(fetchedBlogs);
            setFilteredBlogs(fetchedBlogs);
            console.log(fetchedBlogs); 
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching blogs:", error);
            toast.error('Error Fetching Blogs', {
                style: { background: '#d9534f' }
            });
        }
    }
    

    async function getImageURL(imagePath) {
  try {
    const fileRef = ref(storage, imagePath);
    const imageURL = await getDownloadURL(fileRef);
    return imageURL;
  } catch (error) {
    console.error("Error getting image URL:", error);
    // **Keep the original imagePath (might be a valid URL)**
    return imagePath;
  }
}

    async function getUserData(userId) {
        try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
                return userDoc.data();
            } else {
                return { username: 'Unknown', profilePhoto: 'https://gravatar.com/avatar/5142c06675d78f0bbca30f750662b8ea?s=400&d=robohash&r=x' };
            }
        } catch (error) {
            console.error("Error getting user data:", error);
            return { username: 'Unknown', profilePhoto: 'https://gravatar.com/avatar/5142c06675d78f0bbca30f750662b8ea?s=400&d=robohash&r=x' };
        }
    }

    function handleSearch(e){
      e.preventDefault()
      query.length === 0
        ? toast.info("Please enter text to search", {
            style: { background: "#0275d8" },
          })
        : filterData();
    }

    function filterData() {
        toast.loading('Loading Search results....', {
            style: { background: '#0275d8' }
        });
        setTimeout(() => {
            const searchString = query.toLowerCase();
            if (searchString === '') {
                setFilteredBlogs(blogs);
                setMatch(0);
                toast.dismiss();
                return;
            }
            const filtered = blogs.filter((blog) =>
                blog.title.toLowerCase().includes(searchString) || blog.body.toLowerCase().includes(searchString)
            );
            
            setFilteredBlogs(filtered);
            setMatch(filtered.length);
            toast.dismiss();
        }, 900);
    }
    

    async function handleSubmit(e) {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            alert("Please fill in all the required fields");
            toast.error('Please fill in all the required fields', {
                style : {background : '#d9534f'},} )
            return;
        }
    
        if (imgsrc) {
            await uploadPhotos();
        } else {
            await addPostWithoutPhoto();
        }
    }
    
    async function uploadPhotos() {
        
        const userId = account?.currentUser?.uid;
        const fileName = imgsrc.name;
        const filePath = `postPics/${userId}/${fileName}`;
        const fileRef = ref(storage, filePath);
    
        try {
            toast.loading('Uploading Post...', {
                style : {background : '#292b2c'},} )
            await uploadBytes(fileRef, imgsrc);
            const imageURL = await getDownloadURL(fileRef);
            setUsername(account?.currentUser?.displayName)
            await addDoc(postsCollection, {
                userId: userId,
                username : account?.currentUser?.displayName,
                title: title,
                body: content,
                imageURL: imageURL,
                timestamp: serverTimestamp(),
                profilePhoto : account?.currentUser?.photoURL || 'https://gravatar.com/avatar/5142c06675d78f0bbca30f750662b8ea?s=400&d=robohash&r=x'
            });
            toast.dismiss()
            toast.success('Post uploaded successfully', {
                style : {background : '#5cb85c'},} )
            fetchData();
            setTitle("");
            setContent("");
            document.querySelector('.crfile').value = '';
        } catch (error) {
            // console.error("Error uploading image:", error);
            
            toast.error('Error uploading image', {
                style : {background : '#d9534f'},} )
        }
    }
    
    async function addPostWithoutPhoto() {
        toast.loading('Uploading Post...', {
            style : {background : '#292b2c'},} )
        const userId = account?.currentUser?.uid;
        let profilePic = null
        let username = account?.currentUser?.displayName 
        if(account?.currentUser?.photoURL){
            profilePic = account?.currentUser?.photoURL 
        }
        else{
            profilePic = 'https://gravatar.com/avatar/0fd3bfeaeca3b8ae6826d7e69915b4f5?s=400&d=robohash&r=x'
        }
        

    
        try {
            await addDoc(postsCollection, {
                title: title,
                body: content,
                userId: userId,
                timestamp: serverTimestamp(),
                username : account?.currentUser?.displayName ,
                profilePhoto : profilePic
            });
            toast.dismiss()
            toast.success('Post added successfully', {
                style : {background : '#5cb85c'},} )
            fetchData();
            setTitle("");
            setContent("");
        } catch (error) {
            // console.error("Error adding post:", error);
            toast.error('Error uploading post', {
                style : {background : '#d9534f'},} )
        }
    }

    const deletePost = async (postId) => {
        
        try {
            toast.loading('Deleteing Post...', {
                style : {background : '#292b2c'},} )
            await deleteDoc(doc(db, 'posts', postId)); // Delete the post with the given post ID
            fetchData(); // Fetch the updated list of posts
            toast.success('Post deleted successfully', {
                style : {background : '#5cb85c'},} )
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error('Failed to delete Post, please Try again later', {
                style : {background : '#d9534f'},} )
        }
    }

    const toggleNav = () => {
        setIsSideNavOpen(prevState => !prevState);
    };

    return (
      <>
        <Toaster richColors position="top-right" expand={true} />

        <div className="blogContainer">
          {isLoggedin ? (
            <button onClick={toggleNav} className="roundedToggleMobile">
              <i className="fa-solid fa-pen"></i>
            </button>
          ) : (
            <></>
          )}
          <form
            className="querySection"
            onSubmit={handleSearch}
          >
            <h1>Search</h1>
            <br />
            <input
              type="text"
              placeholder="Search Blog"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button style={{cursor : "pointer"}}>
              <i className="fa fa-search"></i>
            </button>
            {query === "" && match === 0 && (
              <h1 className="match">No Blogs Searched</h1>
            )}
            {query !== "" && match === 0 && (
              <h1 className="match">No Blogs Found</h1>
            )}
            {match > 0 && <h1 className="match">{match} Blogs Found</h1>}
          </form>
          <div className="blogSection">
            <h1>Posts</h1>
            <div className="BlogsAll">
              {isLoading ? (
                <h1 style={{ marginTop: "30px" }}>Loading...</h1>
              ) : (
                filteredBlogs.map((blog) => (
                  <div className="blogCard" key={blog.id}>
                    <div className="blogProfile">
                      <div className="blogAuthorInfo">
                        <img src={blog.profilePhoto} alt="" />
                        <p>{blog.username}</p>
                      </div>
                      <div className="blogDatePosted">
                        {new Date(blog.timestamp.seconds * 1000).toLocaleString(
                          "en-US",
                          { dateStyle: "short", timeStyle: "short" }
                        )}
                      </div>
                    </div>
                    <div className="blogContent">
                      {blog.imageURL && <img src={blog.imageURL} alt="" />}
                      <h2>{blog.title}</h2>
                      <p>{blog.body}</p>
                    </div>
                    <br />
                    {blog.userId === account?.currentUser?.uid && (
                      <button
                        onClick={() => deletePost(blog.id)}
                        className="button"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))
              )}
              {!isLoading && BlogsData.length === 0 &&  <h1>No Posts Found</h1>}
              
            </div>
          </div>
          {isLoggedin ? (
            <div className="createBlogSection">
              <h1>Create New Blog</h1>
              <form action="" onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter Title"
                />
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter Content"
                ></textarea>
                <input
                  type="file"
                  accept="image/*"
                  className="crfile"
                  onChange={(e) => setImageSrc(e.target.files[0])}
                />
                <button className="button">Post</button>
              </form>
            </div>
          ) : (
            <div className="createBlogSection">
              <h1 style={{ marginTop: "200px" }}>Login To Post A Blog!</h1>
              <Link to="/login">
                <button
                  className="button"
                  style={{ margin: "10px 50px 0% 60px", width: "60%" }}
                >
                  Login
                </button>
              </Link>
            </div>
          )}

          <div
            id="createBlogMobile"
            className={`createBlogMobile ${isSideNavOpen ? "open" : ""}`}
          >
            <h1>Create New Blog</h1>
            <a
              href="javascript:void(0)"
              className="closebtn"
              onClick={toggleNav}
            >
              &times;
            </a>
            <form action="" onSubmit={handleSubmit}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Title"
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter Content"
              ></textarea>
              <input
                type="file"
                accept="image/*"
                className="crfile"
                onChange={(e) => setImageSrc(e.target.files[0])}
              />
              <br></br>
              <button className="button">Post</button>
            </form>
          </div>
        </div>
      </>
    );
}

export default BlogsData;
