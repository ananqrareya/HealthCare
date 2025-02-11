import { Outlet } from "react-router-dom"
import Navbar from "../user/components/Home/Navbar"
import Footer from "../user/components/Home/Footer"
import { Chat } from "stream-chat-react";
import { StreamChat } from "stream-chat";
import ClinicContextProvider from "../user/context/ClinicContext";
import DoctorContextProvider from "../user/context/DoctorContext";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContextProvider";

const apiKey = "8ghmxrx2v98h";
const client = StreamChat.getInstance(apiKey);
const UserLayout = () => {
    const { userData } = useContext(UserContext);

    useEffect(() => {

        if (userData && userData.role_id === 3) {
            window.location.href = "/dashboard-doctor";  // توجيه الدكتور إلى لوحة التحكم الخاصة به
        }
    }, [userData]);

    if (userData && userData.role_id === 3) {
        return null;
    }
    return (
        <>
            <ClinicContextProvider>
                <DoctorContextProvider>



                    <Chat client={client}>
                        <Navbar />
                    </Chat>

                    <Outlet />
                    <Footer />

                </DoctorContextProvider>
            </ClinicContextProvider>
        </>
    )
}
export default UserLayout 