import { RiFacebookFill, RiInstagramFill, RiTwitterFill } from 'react-icons/ri';
import { MenuLinks } from './interfaces';

export const socialDetails = [
    { url: "https://facebook.com", icon: <RiFacebookFill className='footer-section-socials-icon' size={36} /> },
    { url: "https://instagram.com", icon: <RiInstagramFill className='footer-section-socials-icon' size={36} /> },
    { url: "https://twitter.com", icon: <RiTwitterFill className='footer-section-socials-icon' size={36} /> },
];

export const footerLinksMore: MenuLinks[] = [
    { text: "Contact Us", url: "/contact" },
    { text: "About Us", url: "/about" },
    { text: "Privacy Policy", url: "/privacy" },
];

export const footerLinksAbout: MenuLinks[] = [
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
    { text: "Profile", url: "/profile", isProtected: true, IsVisible: false },
    { text: "Dashboard", url: "/dashboard", isProtected: true, IsVisible: true },
    { text: "Contact School", url: "/actions/contact", isProtected: true, IsVisible: true },
]

//SU - SuperUser | HU = HighUser | SG = Special Guest | User = User
export const RolesWithAuthority = [
    { role: "Owner", authorityLevel: "SU" },
    { role: "Teacher", authorityLevel: "HU" },
    { role: "Admin", authorityLevel: "HU" },
    { role: "Parent", authorityLevel: "SG" },
    { role: "Student", authorityLevel: "User" },
    { role: "General", authorityLevel: "User" }
];

export const DashboardLinks: MenuLinks[] =[
    { text: "Attendance", Description: "Mark attendance of your students", url: '/actions/update/attendance/students', isProtected: true, ProtectionLevel: ["Admin", "Teacher"] },
    { text: "Attendance", Description: "Mark attendance of your staff", url: '/actions/update/attendance/staff', isProtected: true, ProtectionLevel: ["Owner", "Admin"] },
    { text: "Class", Description: "Create class or assign teachers to your class", url: "/actions/create/class", isProtected: true, ProtectionLevel: ["Owner"] },
    { text: "Subjects", Description: "Create subjects or assign subjects to teachers", url: "/actions/create/subjects", isProtected: true, ProtectionLevel: ["Owner", "Admin"] },
    { text: "Create User", Description: "Create a new user for your school", url: "/actions/create/user", isProtected: true, ProtectionLevel: ["Owner", "Admin"] },
    { text: "Students", Description: "View students or assign students to class", url: "/actions/update/students", isProtected: true, ProtectionLevel: ["Owner", "Admin"]},
    { text: "Update Parent", Description: "Assign parents to your students", url: "/actions/update/parent", isProtected: true, ProtectionLevel: ["Owner", "Admin"] },
    { text: "Pay Fee", url: '/actions/pay/', isProtected: true, ProtectionLevel: ["Owner", "Admin"] },
    { text: "Diaries", Description: "Create diaries for your students", url: "/actions/create/diary", isProtected: true, ProtectionLevel: ["Owner", "Admin", "Teacher"] },
    { text: "Post Diaries", Description: "Post the created diaries, to be shown to students", url: "/actions/update/diary", isProtected: true, ProtectionLevel: ["Owner", "Admin"] },
    { text: "Diaries", Description: "View posted diaries", url: "/view/diary", isProtected: true, ProtectionLevel: ["Parent", "Student"] },
    { text: "Monthly Tests", Description: "Get Summary of tests throughout month", url: "/view/tests", isProtected: true, ProtectionLevel: ["Parent", "Student"] },
]

export const SALT_LENGTH = 12;
export const SESSION_AGE = 60 * 60 * 24; // 24 hours
export const TIMEZONE_OFFSET = 60000;
export const AVATAR_LINK = "/img/avatar.png";

export const boxVariants = {
    hidden: { opacity: 0, x: 400 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.3
        }
    })
};

//Testing
//mongodb://alimalik:xjXG0IYgxf0ilkwd@studify-shard-00-00.84ytz.mongodb.net:27017,studify-shard-00-01.84ytz.mongodb.net:27017,studify-shard-00-02.84ytz.mongodb.net:27017/studify?ssl=true&replicaSet=atlas-vq1m0t-shard-0&authSource=admin&retryWrites=true&w=majority&appName=studify