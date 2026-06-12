import { useState, useEffect } from 'react';

export default function Roster() {
    const [liveRoster, setLiveRoster] = useState([]);
    const [loading, setLoading] = useState(true);

useEffect(() => {
    // Relative URL: automatically routes to localhost in dev and your Vercel URL in production
    fetch('/api/roster') 
        .then(res => res.json())
        .then(data => {
            if (data.success) setLiveRoster(data.roster);
        })
        .catch(err => console.error("Error:", err));
}, []);

    if (loading) return <p>Loading roster...</p>;

    return (
        <table>
            <thead>
                <tr>
                    <th>Employee Name</th>
                    <th>Role</th>
                </tr>
            </thead>
            <tbody>
                {liveRoster.map(employee => (
                    <tr key={employee.id}>
                        <td>{employee.firstName} {employee.lastName}</td>
                        <td>{employee.role}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}   