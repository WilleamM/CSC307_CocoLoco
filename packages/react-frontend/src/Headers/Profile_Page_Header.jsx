// this will be the header for the profile page 

import "./Profile_Page_Header.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse,faUserGroup, faUsers, faArrowUp  } from '@fortawesome/free-solid-svg-icons'


function Profile_Page_Header(){
   return(
    <header className="front-page-header">
       <div className="left-section">
           <div className="main-logo">
               <img src="/Locobook.png" alt="Logo" />
           </div>
           <div className="search-bar">
               <input type="text" placeholder="Search Locobook" />
           </div>
       </div>


       <div className="middle-section">
           <button className="friends-only-icon"> <FontAwesomeIcon icon={faUsers}/> </button>
            <button className="home-icon"><FontAwesomeIcon icon={faHouse}/></button>
            <button className="groups-icon"><FontAwesomeIcon icon={faUserGroup}/></button>
       </div>


       <div className="right-section">
           <div className="upload">
               <button>
                   <div className="up-arrow"><FontAwesomeIcon icon={faArrowUp}/></div>
                   <span className="upload-text">Upload</span>
               </button>
           </div>
       </div>
   </header>
);


}


export default Profile_Page_Header;