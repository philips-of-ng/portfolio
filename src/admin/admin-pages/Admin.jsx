import React, { useRef, useState } from 'react'

import '../../css/upload-info.css'
import NewProject from '../admin-components/NewProject'
import InvoiceStudio from '../admin-components/InvoiceStudio'

const Admin = () => {

  const [authorized, setAuthorized] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [accessDenied, setAccessDenied] = useState(false)
  
  // MODAL STATE FOR INVOICE STUDIO
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)

  // AESTHETICS
  const [greenKey, setGreenKey] = useState('white-key')
  const [redKey, setRedKey] = useState('white-key')

  const passwordRef = useRef()
  const modelPassword = 'thehighisglorious'

  const GrantAccess = (e) => {
    e.preventDefault()

    setVerifying(true)

    if (passwordRef.current.value === modelPassword) {
      setGreenKey('green-key')

      setTimeout(() => {
        setAuthorized(true)
        setVerifying(false)
      }, 3000);

    } else {
      setRedKey('red-key')

      setTimeout(() => {
        setAccessDenied(true)
        setVerifying(false)

        setTimeout(() => {
          setAccessDenied(false)
          setRedKey('white-key')
        }, 5000);

      }, 2000);
      
    }

  }

  return (
    <>
      {
        authorized ? (
          <>
            <div className='admin-dashboard'>

              <div className='page-head flex justify-between items-center mb-6'>
                <h2>Welcome, Admin.</h2>
                <button 
                  onClick={() => setShowInvoiceModal(true)}
                  className='bg-[#E8724A] hover:bg-[#d5613a] text-white font-bold px-4 py-2 rounded-lg text-sm transition flex items-center gap-2 shadow-md'
                >
                  <i className='bx bx-receipt text-lg'></i>
                  Open Invoice Studio
                </button>
              </div>

              <NewProject />

              {/* INVOICE STUDIO MODAL */}
              {showInvoiceModal && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto'>
                  <div className='relative w-full max-w-5xl bg-[#0A0B0D] border border-[#22242A] rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto p-2'>
                    
                    {/* Modal Close Button */}
                    <button 
                      onClick={() => setShowInvoiceModal(false)}
                      className='absolute top-4 right-4 z-10 bg-[#131417] hover:bg-[#22242A] text-[#7E848F] hover:text-white p-2 rounded-full transition border border-[#22242A]'
                    >
                      <i className='bx bx-x text-2xl'></i>
                    </button>

                    <InvoiceStudio />

                  </div>
                </div>
              )}

            </div>
          </>
        ) : (
          <>
            <div className='password-page'>
              <div>

                <h2>Welcome, Admin</h2>
                {
                  accessDenied ? (
                    <>
                      <p className='warning'>Incorrect Password. Access Denied!</p>
                    </>
                  ) : (
                    <>
                      <p>Please input password to access locked page...</p>
                    </>
                  )
                }

                <form onSubmit={GrantAccess}>
                  <div className='pw-input'>
                    <input ref={passwordRef} type="password" placeholder='Input Password' required />
                    <i className={`${greenKey === 'green-key' ? 'green-key' : redKey === 'red-key' ? 'red-key' : 'white-key'} bx bx-lock`}></i>
                  </div>

                  <button className='sec-btn' type='submit'>
                    {
                      verifying ? (
                        <>
                          <i className='bx bx-loader spin-loader' ></i>
                        </>
                      ) : (
                        <>Grant Access</>
                      )
                    }
                  </button>
                </form>
              </div>
            </div>
          </>
        )
      }
    </>
  )
}

export default Admin