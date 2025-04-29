import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isLoading: false,

    register: async (username, email, password) => {
        set({ isLoading: true });
        try {
            console.log('Registering user...');
            const response = await fetch("http://localhost:3001/api/auth/register", {               
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            });
            console.log('Response:', response);

            const data = await response.json();
            if(!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            await AsyncStorage.setItem('user', JSON.stringify(data.user));
            await AsyncStorage.setItem('token', data.token);

            set({
                user: data.user,
                token: data.token,
                isLoading: false,
            });
            return { success: true };
        } catch (error) {
            set({ isLoading: false });
            console.error('Error during registration:', error);
            return { success: false, error: error.message };
            
        }
    },

    
}));