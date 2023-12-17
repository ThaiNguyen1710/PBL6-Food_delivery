import React from 'react'


import ContactLeftSection from '../components/Contact/ContactLeftSection';
import ContactRightSection from '../components/Contact/ContactRightSection';
import Footer from '../components/Footer';



const Contact = () => {
  return (
    <div className="w-screen h-screen flex items-center bg-primary">
      
      <ContactLeftSection/>
      <ContactRightSection />
     
    </div>
    
  );
}

export default Contact