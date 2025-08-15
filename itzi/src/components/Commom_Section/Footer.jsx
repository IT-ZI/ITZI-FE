import React from 'react'
import styles from "../../assets/scss/section/footer.module.scss"
import instargram from "../../assets/img/instargram.png"
import blog from "../../assets/img/blog.png"

const Footer = () => {
  return (
    <div className='body'>
      <div className={styles.container}>
        <div className={styles.top}>
            <p>이용가이드</p>
            <p>고객문의</p>
        </div>
        <div className={styles.bottom}>
            <img src={instargram} alt="" />
            <img src={blog} alt="" />
        </div>
      </div>
    </div>
  )
}

export default Footer
