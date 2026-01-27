import { createContext, useContext, useState, useEffect } from 'react';
import { register_user_service, login_user_service, logout_user_service, checkAuth_user_service, reset_password } from "../services/authenticate";

const AuthenticateContext = createContext({});

const AuthenticateProvider = (props) => {
	const [authUser, setAuthUser] = useState(null);
	const [trigger, setTrigger] = useState(false);
	const [isAuthChecked, setIsAuthChecked] = useState(false);

	useEffect(() => {
		checkAuthUser();
	}, [trigger]);

	const register = async (data) => {
		try {
			const result = await register_user_service(data);
			if (result.status === 201) {
				setAuthUser(result.data);
			}
			return result;
		} catch (error) {
			throw error.response.data
		}
	}

	const login = async (data) => {
		try {
			const result = await login_user_service(data);
			if (result.status === 201) {
				setAuthUser(result.data);
			}
			return result;
		} catch (error) {
			throw error.response.data;
		}
	}

	const logout = async (id, data) => {
		try {
			const result = await logout_user_service();
			if (result.data.status === 201) {
				setAuthUser({});
				setTrigger(!trigger);
			}
		} catch (error) {
			return error
		}
	}

	const checkAuthUser = async () => {
		try {
			const result = await checkAuth_user_service();
			if (result.status === 200) {
				setAuthUser(...result.data);
			} else {
				setAuthUser({});
			}
			return result;
		} catch (error) {
			setAuthUser({});
			return error;
		} finally {
			setIsAuthChecked(true);
		}
	}

	const resetPassword = async (token, password) => {
		try {
			const result = await reset_password(token, password);
			return result.data
		} catch (error) {
			throw error;
		}
	}

	const values = { authUser, register, login, logout, checkAuthUser, isAuthChecked, resetPassword };
	return (
		<AuthenticateContext.Provider value={values}>
			{props.children}
		</AuthenticateContext.Provider>
	)
}

const useAuthenticateContext = () => { return useContext(AuthenticateContext) }
export { AuthenticateProvider, useAuthenticateContext }