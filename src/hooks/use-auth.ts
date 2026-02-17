import {useContext} from 'react';
import {AuthContext} from "../providers/AuthProvider.tsx";

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};