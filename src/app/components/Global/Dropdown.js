import React, {useState, useEffect, useRef} from 'react'

import { View, Text, Image } from 'src/framework/Design'

import { Link } from 'react-router-dom'

const Dropdown = ({type, name, handleSelect, children, ...props}) => {
    const [display, setDisplay] = useState(false)

    const ref = useRef()

    useEffect(() => {
        const onBodyClick = (event) => {
            if (ref.current.contains(event.target)) {
                return;
            }
            setDisplay(false)
        }
        document.body.addEventListener('click', onBodyClick)
        return () => {
            document.body.removeEventListener("click", onBodyClick)
        }
    },[])

    const show = display ? "sub-menu" : "sub-close"
    const arrowSet = display ? <Image icon type="caret-down" /> : <Image icon type="caret-right" />

    return (
        <div ref={ref}>
            <Link to="#" style={{display:'flex', alignItems:'center'}} onClick={() => setDisplay(!display)}>
                <Image icon type={type} /><Text p style={{flex: '1'}}>{name}</Text> <span> {arrowSet} </span>
            </Link>

            <ul className={`${show}`}>
                {children}
            </ul>
        </div>
    )
}

export default Dropdown