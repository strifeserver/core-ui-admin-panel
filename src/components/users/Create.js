import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector, useStore } from "react-redux";


import { adminuserCreate, adminuserClear } from 'src/data/components/users/Store'
import { initProcess, createProcess } from 'src/data/components/users/Thunk'


const Component = (props) => {

    const state = useSelector(state => state.adminuser)
    const dispatch = useDispatch();
    const store = useStore();

    const [ errors, setError ] = useState([]);

    useEffect(() => {
        async function init(){
            
            dispatch(adminuserCreate(true))
            await dispatch(initProcess())
            
        }

        init();
    }, [dispatch]);

    const onError = (errors) => {
        setError(errors)
    }

    const onSubmit = async (values) => {
        const { history } = props
        const item = {
            name: values.name,
            username: values.username,
            level_id: values.level_id,
            email_address: values.email_address,
            password: values.password,
            is_enabled: values.is_enabled,
        }

        
        await dispatch(createProcess(item))
        const data = store.getState().adminuser.status
        if (data) {
            history.push("/users")
        }
        

        setTimeout(() => {
            dispatch(adminuserClear())
        }, 5000)
    }

    const is_enabled = [
        {value: 1, text: "Enabled"},
        {value: 0, text: "Disabled"},
    ]

    return (
        <div row>
            <p>Create Page</p>
        </div>
    );
}

export default Component;