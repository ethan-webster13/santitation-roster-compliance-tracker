const initialEmployees = [
    // --- SUPERVISORS (2) ---
    {
        id: 1,
        firstName: "Fred",
        lastName: "Miller",
        role: "supervisor",
        zone: "processing & packaging floor",
        isAbsent: false
    },
    {
        id: 2,
        firstName: "Arthur",
        lastName: "Morgan",
        role: "supervisor",
        zone: "cut floor",
        isAbsent: false
    },

    // --- LEADS (4) ---
    {
        id: 3,
        firstName: "Sarah",
        lastName: "Jenkins",
        role: "sanitation lead",
        zone: "processing line",
        isAbsent: false
    },
    {
        id: 4,
        firstName: "Mike",
        lastName: "Chen",
        role: "sanitation lead",
        zone: "packaging",
        isAbsent: false
    },
    {
        id: 5,
        firstName: "Maria",
        lastName: "Santos",
        role: "sanitation lead",
        zone: "kill floor",
        isAbsent: false
    },
    {
        id: 6,
        firstName: "David",
        lastName: "Torres",
        role: "sanitation lead",
        zone: "fabrication & boning",
        isAbsent: false
    },

    // --- PROCESSING LINE CREW (4) ---
    {
        id: 7,
        firstName: "Luis",
        lastName: "Garcia",
        role: "laborer",
        zone: "processing line",
        isAbsent: false
    },
    {
        id: 8,
        firstName: "James",
        lastName: "Smith",
        role: "laborer",
        zone: "processing line",
        isAbsent: false
    },
    {
        id: 9,
        firstName: "Elena",
        lastName: "Rostova",
        role: "laborer",
        additionalRole: "chemical specialist", 
        zone: "processing line",
        isAbsent: false
    },
    {
        id: 10,
        firstName: "Omar",
        lastName: "Hassan",
        role: "laborer",
        zone: "processing line",
        isAbsent: false
    },

    // --- PACKAGING CREW (4) ---
    {
        id: 11,
        firstName: "Jackson",
        lastName: "Brooks",
        role: "laborer",
        zone: "packaging",
        isAbsent: false
    },
    {
        id: 12,
        firstName: "Marcus",
        lastName: "Vance",
        role: "laborer",
        zone: "packaging",
        isAbsent: false
    },
    {
        id: 13,
        firstName: "Chloe",
        lastName: "Davis",
        role: "laborer",
        zone: "packaging",
        isAbsent: false
    },
    {
        id: 14,
        firstName: "Liam",
        lastName: "O'Connor",
        role: "laborer",
        zone: "packaging",
        isAbsent: false
    },

    // --- KILL FLOOR CREW (4) ---
    {
        id: 15,
        firstName: "Jose",
        lastName: "Ramirez",
        role: "laborer",
        zone: "kill floor",
        isAbsent: false
    },
    {
        id: 16,
        firstName: "DeAndre",
        lastName: "Washington",
        role: "laborer",
        zone: "kill floor",
        isAbsent: false
    },
    {
        id: 17,
        firstName: "Carlos",
        lastName: "Mendoza",
        role: "laborer",
        zone: "kill floor",
        isAbsent: false
    },
    {
        id: 18,
        firstName: "Anita",
        lastName: "Patel",
        role: "laborer",
        zone: "kill floor",
        isAbsent: false
    },

    // --- FABRICATION & BONING CREW (4) ---
    {
        id: 19,
        firstName: "William",
        lastName: "Taylor",
        role: "laborer",
        zone: "fabrication & boning",
        isAbsent: false
    },
    {
        id: 20,
        firstName: "Jessica",
        lastName: "Nguyen",
        role: "laborer",
        zone: "fabrication & boning",
        isAbsent: false
    },
    {
        id: 21,
        firstName: "Thomas",
        lastName: "Wright",
        role: "laborer",
        zone: "fabrication & boning",
        isAbsent: false
    },
    {
        id: 22,
        firstName: "Robert",
        lastName: "Evans",
        role: "laborer",
        additionalRole: "chemical specialist",
        zone: "fabrication & boning",
        isAbsent: false
    }
];

export default initialEmployees;