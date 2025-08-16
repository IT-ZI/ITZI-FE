import banner1 from "../../assets/img/banner.png"
import banner2 from "../../assets/img/banner2.png"
import alarm from "../../assets/img/alarm.png"
import profile from "../../assets/img/profile.png"
import { useState } from "react"


const Nav = () => {

    const [activeTab, setActiveTab] = useState("benefits");

    const handleClickTab = (name) => {
        setActiveTab(name);
    }

    return (
    <div className='nav'>
        <div className="container">
            <div className="nav_left">
                <div className="banner">
                    <img src={banner1} alt="" />
                    <img src={banner2} alt="" />
                </div>
                <div className="button_container">
                    <button role="tab" onClick={() => handleClickTab("benefits")}>혜택이 잇ZI</button>
                    <p>|</p>
                    <button role="tab" onClick={() => handleClickTab("cooperation")}>제휴를 잇ZI</button>
                </div>
            </div>
            <div className="nav_right">
                <div className="icon_container">
                    <img src={alarm} alt="" />
                    <img src={profile} alt="" />
                </div>
            </div>
        </div>
    </div>
    )
}

export default Nav
