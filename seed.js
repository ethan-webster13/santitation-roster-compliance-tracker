import { createClient } from 'redis';

const client = createClient({
    url: 'process.env.REDIS_URL' // Change this to your production URL if needed
});

const fakeEmployees = [
    { id: "1", firstName: "James", lastName: "Smith", role: "Manager", zone: "Zone A", hWorked: 38 },
    { id: "2", firstName: "Maria", lastName: "Garcia", role: "Supervisor", zone: "Zone B", hWorked: 40 },
    { id: "3", firstName: "David", lastName: "Smith", role: "Associate", zone: "Zone A", hWorked: 32 },
    { id: "4", firstName: "Robert", lastName: "Johnson", role: "Associate", zone: "Zone C", hWorked: 24 },
    { id: "5", firstName: "Michael", lastName: "Rodriguez", role: "Technician", zone: "Zone B", hWorked: 45 },
    { id: "6", firstName: "Emma", lastName: "Wilson", role: "Associate", zone: "Zone A", hWorked: 16 },
    { id: "7", firstName: "William", lastName: "Thomas", role: "Security", zone: "Gate 1", hWorked: 42 },
    { id: "8", firstName: "Olivia", lastName: "Martinez", role: "Associate", zone: "Zone C", hWorked: 30 },
    { id: "9", firstName: "Alexander", lastName: "Anderson", role: "Technician", zone: "Zone C", hWorked: 38 },
    { id: "10", firstName: "Sophia", lastName: "Taylor", role: "Supervisor", zone: "Zone A", hWorked: 40 }
];

async function seedDatabase() {
    try {
        console.log('Connecting to Redis...');
        await client.connect();

        // Redis only stores strings, so we must stringify the array
        await client.set('liveRoster', JSON.stringify(fakeEmployees));
        
        console.log('Successfully seeded 10 fake employees into "liveRoster"!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await client.disconnect();
        console.log('Disconnected from Redis.');
    }
}

seedDatabase();