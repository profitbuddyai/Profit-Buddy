import React from 'react'
import styles from './Loader.module.css'

const Loader = () => {
    return (
        <div className='flex flex-col gap-2 items-center justify-center fixed top-0 left-0 bg-primary w-screen h-screen z-[3000]'>
            <p className='text-lText text-xl'>Loading...</p>
            <div className='w-[80%] max-w-[300px] h-1 bg-border/90 rounded-full relative overflow-hidden'>
                <div className='w-full bg-accent h-1 rounded-full loaderLineAnimation'></div>
            </div>
            {/* <div className={`${styles?.loader}`}></div> */}
        </div>
    )
}

export default Loader