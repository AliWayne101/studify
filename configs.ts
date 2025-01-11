export const socialDetails = [
    { url: "https://facebook.com" },
    { url: "https://instagram.com" },
    { url: "https://twitter.com" },
];

export const footerLinks = [
    { text: "Link 1", url: "#" },
    { text: "Link 2", url: "#" },
    { text: "Link 3", url: "#" },
    { text: "Link 4", url: "#" },
    { text: "Link 5", url: "#" },
];

export const WebDetails = {
    webName: "Studify",
    webMotto: `Stay connected to your child's academic journey with real-time updates. Empower their success with instant access to grades, attendance, and progress.`,
    webMeta: {
        title: "Studify - Stay Connected to Your Child's Academic Journey",
        description: "Studify provides real-time updates on your child's grades, attendance, and progress. Empower their success with instant access to academic information.",
        keywords: "Studify, academic updates, grades, attendance, student progress",
        author: "Ali Wains",
        authors: [{ name: "Ali Wains" }],
    }
}

export const DashLinks = [
    { text: "Attendance", url: '/actions/update/attendance', role: ["Teacher", "Admin", "Parent"] },
    { text: "Attendance", url: '/actions/update/attendance', role: ["Teacher", "Admin", "Parent"] },
    { text: "Attendance", url: '/actions/update/attendance', role: ["Teacher", "Admin", "Parent"] },
    { text: "Attendance", url: '/actions/update/attendance', role: ["Teacher", "Admin", "Parent"] },
]

export const SALT_LENGTH = 12;
export const SESSION_AGE = 60 * 60 * 24; // 24 hours

//Testing
//mongodb://alimalik:xjXG0IYgxf0ilkwd@studify-shard-00-00.84ytz.mongodb.net:27017,studify-shard-00-01.84ytz.mongodb.net:27017,studify-shard-00-02.84ytz.mongodb.net:27017/studify?ssl=true&replicaSet=atlas-vq1m0t-shard-0&authSource=admin&retryWrites=true&w=majority&appName=studify