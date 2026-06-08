import React from 'react'
import VerifyAccountPage from './VerifyAccountPage'
import Image from 'next/image';
export default function VerifyAccountPageWrapper() {
    
  return (
    <div className="verifycontent bgV">
        <div className="head">
          <VerifyAccountPage />
        </div>
        <img
        src="/images/verifyAccountImg.png"
        alt="Verify Account Image"
        
        />
    </div>
  )
}
