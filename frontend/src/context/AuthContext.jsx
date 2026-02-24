import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            try {
                const storedUser = localStorage.getItem('userInfo');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        checkUserLoggedIn();
    }, []);

    // Send OTP to user's identifier (email or mobile)
    const sendOtp = async (identifier) => {
        const { data } = await api.post('/auth/send-otp', { identifier });
        return data;
    };

    // Verify OTP and login
    const verifyOtp = async (identifier, otp) => {
        const { data } = await api.post('/auth/verify-otp', { identifier, otp });
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        return data;
    };

    const register = async (name, email, password, role, mobile) => {
        const { data } = await api.post('/auth/register', { name, email, password, role, mobile });
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        return data;
    };

    const logout = async () => {
        await api.post('/auth/logout');
        setUser(null);
        localStorage.removeItem('userInfo');
    };

    return (
        <AuthContext.Provider value={{ user, sendOtp, verifyOtp, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
