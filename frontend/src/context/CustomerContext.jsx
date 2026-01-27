import { createContext, useContext, useState, useEffect } from 'react';
import { useAuthenticateContext } from './AuthenticateContext';
import { get_customers_service } from '../services/customer';

const CustomerContext = createContext({});

const CustomerProvider = ({ children }) => {
    const { authUser } = useAuthenticateContext();
    const [customers, setCustomers] = useState([]);
    
    useEffect(() => {
        if (authUser?.roles === 'admin') getCustomers();
    }, [authUser]);

    const getCustomers = async () => {
        const res = await get_customers_service();
        if (res.status === 200) setCustomers(res.data);
    };

    const values = { customers, getCustomers };
    return (
        <CustomerContext.Provider value={values}>
            {children}
        </CustomerContext.Provider>
    )
};

const useCustomerContext = () => useContext(CustomerContext);
export { CustomerProvider, useCustomerContext }