import {useReducer, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import axios from "../config/axios";
import UserContext from "../context/UserContext"; 

const userReducer = (state, action) => {
    switch(action.type){
        case 'LOGIN' : {
            return {...state, isLoggedIn: true, user: action.payload}
        }
        case 'LOGOUT': {
            return {...state, isLoggedIn: false, user: null}
        }
        case 'SET_ERRORS': {
            return {...state, serverErrors: action.payload };
        }
        default: {
            return{ ...state};
        }   
    } 
}
export default function AuthProvider(props){
    const navigate = useNavigate();
    const [state, dispatch] = useReducer(userReducer, {
        user: null,
        isLoggedIn: false,
        serverErrors: ""
    });

    useEffect(() => {
        if(localStorage.getItem('token')) {
            const fetchUser = async () => {
                try{
                    const response = await axios.get('/users/account', { headers: {Authorization: localStorage.getItem('token')}});
                    dispatch({type: "LOGIN", payload: response.data})
                    try{ localStorage.setItem('user', JSON.stringify(response.data)); }catch(e){}
                }catch(err){
                    console.log(err.message)
                }
            }
            fetchUser();
        }
    }, [])
    

    const handleRegister = async (formData, setFieldError) => {
        try{
            const response = await axios.post('/users/register', formData);
            console.log(response.data);
            alert("Successfully registered");
            dispatch({type: 'SET_ERRORS', payload: ''});
            navigate('/login');
            return true;
            // return {success: true};
        } catch(err){
            const error = err?.response?.data?.error;
            if(error === "Email already taken"){
                setFieldError("email", error);
            } else if(error === "Admin account already exists"){
                setFieldError("role", error);
            } else {
                dispatch({ type: "SET_ERRORS", payload: err?.response?.data?.error || 'Registration failed' });
                console.log(err.message)
            }
             return false;
            
        }
    }

    const handleLogin = async (formData, setFieldError) => {
        try{
            const response = await axios.post('/users/login', formData);
            localStorage.setItem('token', response.data.token);
            const userResponse = await axios.get('/users/account', { headers: {Authorization: localStorage.getItem('token')}})
            console.log(userResponse.data)
            
            alert('successfully logged in');
            dispatch({type: 'LOGIN', payload: userResponse.data})
            try{ localStorage.setItem('user', JSON.stringify(userResponse.data)); }catch(e){}
            navigate('/dashboard')
        }catch(err){
            const error = err?.response?.data?.error;
            if(error === "Invalid Password"){
                setFieldError("password", error);
            } else if(error === "Invalid Email"){
                setFieldError("email", error);
            } else {
                dispatch({type: "SET_ERRORS", payload: err?.response?.data?.error || 'Login failed'})
                console.log(err.message)
            }
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        try{ localStorage.removeItem('user'); }catch(e){}
        dispatch({type: "LOGOUT"})
    };

    return (
        <UserContext.Provider value={{...state, handleRegister, handleLogin, handleLogout}}>
            {props.children}
        </UserContext.Provider>
    )
}