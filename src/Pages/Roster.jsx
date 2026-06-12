import { useState, useEffect } from 'react';
import NavBar from '../Components/NavBar'

export default function Roster() {
    const [liveRoster, setLiveRoster] = useState([]);

    useEffect(() => {
        // Fetch data from the API route we created
        fetch('/api/roster')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setLiveRoster(data.roster);
                }
            })
            .catch(err => console.error("Error fetching roster:", err));
    }, []);

    return (
        <>
            <NavBar />
            <h3>Roster Page</h3>
            <table>
                <thead>
                    <tr>
                        <th>Employee Name</th>
                        <th>Employee Role</th>
                    </tr>
                </thead>
                <tbody>
                    {liveRoster.map(item => (
                        <tr key={item.id}>
                            <td>{item.firstName} {item.lastName}</td>
                            <td>{item.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}