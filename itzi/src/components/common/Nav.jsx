import banner1 from "../../assets/img/banner.png"
import banner2 from "../../assets/img/banner2.png"
import alarm from "../../assets/img/alarm.png"
import profile from "../../assets/img/profile2.png"
import { useEffect, useState } from "react"
import ProfileDropdown from "./ProfileDropdown"


const Nav = () => {

    const [activeTab, setActiveTab] = useState("benefits");
    const [isOpen, setIsOpen] = useState(false);

    const handleClickTab = (name) => {
        setActiveTab(name);
    }

    const toggleProfile = () => {
        setIsOpen(v => !v);
    }

    useEffect(() => {
        console.log("activeTab :", activeTab)
    },[activeTab])

    return (
    <div className='nav'>
        <div className="container">
            <div className="nav_left">
                <div className="banner">
                    <img className="banner1" src={banner1} alt="" />
                    <img className="banner2" src={banner2} alt="" />
                </div>
                <div className="button_container">
                    <button className={`tab ${activeTab==="benefits"? "active" : ""}`} role="tab" onClick={() => handleClickTab("benefits")}>혜택이 잇ZI</button>
                    <p>|</p>
                    <button className={`tab ${activeTab==="cooperation"? "active" : ""}`} role="tab" onClick={() => handleClickTab("cooperation")}>제휴를 잇ZI</button>
                </div>
            </div>
            <div className="nav_right">
                <div className="icon_container">
                    <img className="alarm" src={alarm} alt="" />
                    <img className="profile" src={profile} onClick={toggleProfile} alt="" />
                </div>
            </div>
        </div>
        <div className="toggle">
            {isOpen && <ProfileDropdown/>}
        </div>
    </div>
    )
}

export default Nav
