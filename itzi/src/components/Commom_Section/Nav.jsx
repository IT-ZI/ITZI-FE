import React from 'react'
import styles from "../../assets/scss/section/nav.module.scss"
import banner1 from "../../assets/img/banner.png"
import banner2 from "../../assets/img/banner2.png"
import alarm from "../../assets/img/alarm.png"
import profile from "../../assets/img/profile.png"

const Nav = () => {
  return (
    <div className='body'>
      <div className={styles.container}>
        <div className={styles.nav_left}>
            <div className={styles.banner}>
                <img src={banner1} alt="" />
                <img src={banner2} alt="" />
            </div>
            <div className={styles.button_container}>
                <button>혜택이 잇ZI</button>
                <p>|</p>
                <button>제휴를 잇ZI</button>
            </div>
        </div>
        <div className={styles.nav_right}>
            <div className={styles.icon_container}>
                <img src={alarm} alt="" />
                <img src={profile} alt="" />
            </div>
        </div>
      </div>
    </div>
  )
}

export default Nav
