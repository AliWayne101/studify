import { RiFacebookFill, RiInstagramFill, RiTwitterFill } from 'react-icons/ri';

export const socialDetails = [
    { url: "https://facebook.com", icon: <RiFacebookFill className='footer-section-socials-icon' size={36} /> },
    { url: "https://instagram.com", icon: <RiInstagramFill className='footer-section-socials-icon' size={36} /> },
    { url: "https://twitter.com", icon: <RiTwitterFill className='footer-section-socials-icon' size={36} /> },
];

export const footerLinksMore = [
    { text: "Link 1", url: "#" },
    { text: "Link 2", url: "#" },
    { text: "Link 3", url: "#" },
    { text: "Link 4", url: "#" },
    { text: "Link 5", url: "#" },
];

export const footerLinksAbout = [
    { text: "Link 1", url: "#" },
    { text: "Link 2", url: "#" },
    { text: "Link 3", url: "#" },
    { text: "Link 4", url: "#" },
    { text: "Link 5", url: "#" },
]

export const WebDetails = {
    webName: "Studify",
    webMotto: `Stay connected to your child's academic journey with real-time updates. Empower their success with instant access to grades, attendance, and progress.`,
    backlink: "https://waynedev.vercel.app",
    webMeta: {
        title: "Studify - Stay Connected to Your Child's Academic Journey",
        description: "Studify provides real-time updates on your child's grades, attendance, and progress. Empower their success with instant access to academic information.",
        keywords: "Studify, academic updates, grades, attendance, student progress",
        authors: [{ name: "Ali Wains" }],
    }
}

export const NavLinks = [
    { text: "Home", url: "/", isProtect: false },
    { text: "Home", url: "/", isProtect: false },
    { text: "Home", url: "/", isProtect: false },
    { text: "Dashboard", url: "/dashboard", isProtect: true },
]

export const Roles = ["Owner", "Teacher", "Admin", "Parent", "Student"];

export const RolesWithAuthority = [
    { role: "Owner", authorityLevel: "SU" },
    { role: "Teacher", authorityLevel: "HU" },
    { role: "Admin", authorityLevel: "HU" },
    { role: "Parent", authorityLevel: "User" },
    { role: "Student", authorityLevel: "User" },
];

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