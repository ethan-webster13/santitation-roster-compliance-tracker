import { useState } from "react";
import { formatPhone } from "../utils/formatPhone";
import { useNavigate } from "react-router-dom";
import { useRoster } from "../context/RosterContext";

const NewEmp = ( {onEmpAdd} ) => {
    const navigate = useNavigate();
    const {addEmployee} = useRoster();
    const [nextId, setNextId] = useState(23)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        role: 'new hire',
        zone: 'unassigned',
        hWorked: 0
    });


    
    const phoneRegex = /^(\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}$/
    const isPhoneValid = phoneRegex.test(formData.phone.replace(/\D/g, ''));


    const inputChange = (e) => {
        const {name, value} = e.target
        if (name === 'phone') {
            const formattedPhone = formatPhone(value);
            setFormData(prev=> ({...prev, phone: formattedPhone}))
        } else {
        setFormData(prev=> ({...prev, [name]: value}))}
    };

    const handleSubmit = (e) => {
        e.preventDefault();

            const cleanPhone = formData.phone.replace(/\D/g, '');
             if (cleanPhone.length !== 10) {
            alert("Please enter a valid 10-digit phone number.");
            return;
        }

        const newEmployee = {
            ...formData, 
            id: nextId
        };

        addEmployee(newEmployee)
        setNextId(prev => prev + 1)
        navigate('/roster')

    };

    return(
        <>
        <div>
            <h3>Register New Employee:</h3>
            <form onSubmit={handleSubmit}>
                <label htmlFor="firstName">First Name: </label>
                <input id="firstName" name="firstName" value={formData.firstName} onChange={inputChange} /><br />

                <label htmlFor="lastName">Last Name:</label>
                <input id="lastName" name="lastName" value={formData.lastName} onChange={inputChange}/><br/>
                
                <label htmlFor="phone">Phone:</label>
                <input id="phone" type="tel" name="phone" value={formData.phone}  onChange={inputChange} maxLength={14} required/><br />

                <button type="submit">Add New Employee</button>
            </form>
        </div>
        </>
    )


}

export default NewEmp;