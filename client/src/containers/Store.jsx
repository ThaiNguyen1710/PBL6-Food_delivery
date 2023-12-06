import React from 'react'
import { ShopLeftSection, ShopRightSection } from '../components';


const Store = () => {
  return (
    <div className="w-screen h-screen flex items-center bg-primary">
      <ShopLeftSection />
      <ShopRightSection />
    </div>
  );
}

export default Store