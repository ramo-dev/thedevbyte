import { account, googleProvider } from "../../firebase/firebase";
import {signInWithPopup}  from "firebase/auth";
import { toast } from "sonner";
const signInWithGoogle = async () => {
    
  try {
    const user = await signInWithPopup(account, googleProvider);
    if (user) {
        toast.success('Sign in Successful')
    } else {
      toast.error('Error signing in');
    }
  } catch (error) {
    console.error("Error signing in with Google:", error);
    toast.error('Error signing in with Google');
  }
};

export default signInWithGoogle;
