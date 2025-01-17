import { RiFacebookFill, RiInstagramFill, RiTwitterFill } from 'react-icons/ri';
import { MenuLinks } from './interfaces';

export const socialDetails = [
    { url: "https://facebook.com", icon: <RiFacebookFill className='footer-section-socials-icon' size={36} /> },
    { url: "https://instagram.com", icon: <RiInstagramFill className='footer-section-socials-icon' size={36} /> },
    { url: "https://twitter.com", icon: <RiTwitterFill className='footer-section-socials-icon' size={36} /> },
];

export const footerLinksMore:MenuLinks[] = [
    { text: "Contact Us", url: "/contact" },
    { text: "About Us", url: "/about" },
    { text: "Privacy Policy", url: "/privacy" },
];

export const footerLinksAbout:MenuLinks[] = [
    { text: "Sitemap", url: "/sitemap" },
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

export const NavLinks: MenuLinks[] = [
    { text: "Dashboard", url: "/dashboard", isProtected: true },
    { text: "Contact Us", url: "/actions/contact", isProtected: true },
    { text: "Home", url: "/", isProtected: false },
]

// export const Roles = ["Owner", "Teacher", "Admin", "Parent", "Student"];

//SU - SuperUser | HU = HighUser | SG = Special Guest | User = User
export const RolesWithAuthority = [
    { role: "Owner", authorityLevel: "SU" },
    { role: "Teacher", authorityLevel: "HU" },
    { role: "Admin", authorityLevel: "HU" },
    { role: "Parent", authorityLevel: "SG" },
    { role: "Student", authorityLevel: "User" },
];

export const TeacherLinks:MenuLinks[] = [
    { text: "Mark Attendance", url: '/actions/update/attendance/students' },
    { text: "123", url: '/actions/update/attendance' },
    { text: "123", url: '/actions/update/attendance' },
    { text: "123", url: '/actions/update/attendance' },
]

export const SALT_LENGTH = 12;
export const SESSION_AGE = 60 * 60 * 24; // 24 hours
export const AVATAR_LINK = "/img/avatar.png";

//Testing
//mongodb://alimalik:xjXG0IYgxf0ilkwd@studify-shard-00-00.84ytz.mongodb.net:27017,studify-shard-00-01.84ytz.mongodb.net:27017,studify-shard-00-02.84ytz.mongodb.net:27017/studify?ssl=true&replicaSet=atlas-vq1m0t-shard-0&authSource=admin&retryWrites=true&w=majority&appName=studify