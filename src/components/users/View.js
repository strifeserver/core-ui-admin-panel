import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector, useStore } from "react-redux";


import { adminuserDelete, adminuserClear } from 'src/data/components/Adminuser/Store'
import { initProcess, loadProcess, updateProcess, deleteProcess } from 'src/data/components/Adminuser/Thunk'

import { Config } from 'src/config/Config'

import useTitle from '../Global/useTitle';

const Component = (props) => {
    useTitle("Update User");

    const state = useSelector(state => state.adminuser)
    const dispatch = useDispatch();
    const store = useStore();
    const id = props.match.params.id

    const [ errors, setError ] = useState([]);

    const app = useSelector(state => state.app)

    const initVal = {
        name: "",
        username: "",
        level_id: 0,
        email_address: "",
        password: "",
        is_enabled: null,
    }
    const [ form, setForm ] = useState(initVal);

    useEffect(() => {
        async function init(){
            
            await dispatch(loadProcess(id))
            const item = store.getState().adminuser.item

            await dispatch(initProcess())

            setForm({
                name: item.name,
                username: item.username,
                level_id: item.level_id,
                email_address: item.email_address,
                password: item.password,
                is_enabled: item.is_enabled,
            })
            
        }
        init();

    }, [dispatch, id, store]);

    const onError = (errors) => {
        setError(errors)
    }

    const onSubmit = async (values) => {
        const { history } = props
        const item = {
            id: id,
            data: {
                name: values.name,
                username: values.username,
                level_id: values.level_id,
                email_address: values.email_address,
                password: values.password,
                is_enabled: values.is_enabled,
            }
        }

        
        await dispatch(updateProcess(item))
        const data = store.getState().adminuser.status
        if (data) {
            history.push("/users")
        }
        

        setTimeout(() => {
            dispatch(adminuserClear())
        }, 5000)
    }

    const handleDelete = async (event) => {
        event.preventDefault()
        const { history } = props

        
        dispatch(adminuserDelete(true))
        await dispatch(deleteProcess(id))
        const data = store.getState().adminuser.status
        if (data) {
            history.push("/users")
        }
        

        setTimeout(() => {
            dispatch(adminuserClear())
        }, 5000)
    }

    const onCancel = async (event) => {
        event.preventDefault()
        const { history } = props

        history.push("/users/" + id)
    }

    const is_enabled = [
        {value: 1, text: "Enabled"},
        {value: 0, text: "Disabled"},
    ]

    return (
        <div>
            <p>VIEW JS</p>
        </div>
    );
}

export default Component;