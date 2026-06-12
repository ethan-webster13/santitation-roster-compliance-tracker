import { useState } from "react";

const NewUser = () => {
    const [newEmp, setNewEmp] = useState({
        userName: '',
        password: '',
        role: ''
    })

    const inputChange = (e) => {
        const {name, value} = e.target
        setNewEmp({...newEmp, [name]: value})

    }


    return(
        <>
        <div>
            <form>
                <label htmlFor="userName">UserName:</label>
                <input name="userName" value={newEmp.userName} onChange={(e)=>inputChange(e)} /><br />

                <label>Password:</label>
                <input /><br/>
                
                <label>Re-type Password:</label>
                <input /><br />

                <button>Sign Up!</button>
            </form>
        </div>
        </>
    )


}

export default NewUser;