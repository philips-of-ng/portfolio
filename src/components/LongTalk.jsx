import React from 'react'
import '../css/longtalk.css'

const LongTalk = ({ color, talk1, talk2 }) => {
  return (
    <div className='long-talk' style={{
      color: `${color}`,      
    }}>


      <p>
        { talk1 }
      </p>

      <p>
        { talk2 }
      </p>


    </div>
  )
}

export default LongTalk