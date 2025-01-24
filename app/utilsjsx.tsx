import { toast } from "react-toastify";

export const ShowToast = (Title: string, Body: string, Foot2: string | null, Foot1?: string) => {
    toast(
        <div className='notification' >
            <div className="notification-title">{Title}</div>
            < div className="notification-body">{Body}</div>
            < div className="notification-footer" >
                <div className="notification-footer-in" >{Foot1}</div>
                < div className="notification-footer-in text-right" >{Foot2 === null ? (new Date).toLocaleString() : Foot2}</div>
            </div>
        </div>, {
        className: "toastcustom",
        closeButton: false
    });
}