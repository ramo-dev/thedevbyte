import React, { useEffect } from 'react'
import './Loader.css'

const loader = () => {


  return (
    <div className="pre-Loader">
      <div className="pre-Loader-wrapper">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="shadow"></div>
        <div className="shadow"></div>
        <div className="shadow"></div>
      </div>
    </div>
  );
}

export default loader
