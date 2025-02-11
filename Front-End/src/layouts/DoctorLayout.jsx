import DoctorLayoutContextProvider from "../DoctorLayout/context/DoctorLayoutContext";
import HomeDoctor from "../DoctorLayout/Home";
 
const DoctorLayout=()=>{
    return(
        <>
            <DoctorLayoutContextProvider> 
             <HomeDoctor/>
             </DoctorLayoutContextProvider>
        </>
    
      
    )
};
export default DoctorLayout ;