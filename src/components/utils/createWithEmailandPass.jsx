import { createUserWithEmailAndPassword } from 'firebase/auth';
import { account } from './firebase';

const createWithEmail = async (email, password) => {
    try {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }
        const userCredential = await createUserWithEmailAndPassword(account, email, password);
        
        return userCredential.user;
    } catch (error) {
        // Handle errors
        console.error('Error creating user:', error.message);
        throw error;
    }
}

export default createWithEmail;
