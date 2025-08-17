import React from 'react';
import Banner from '../components/Banner';
import PartnersSlider from '../components/PartnersSlider';
import InspireTeachers from '../components/InspireTeachers';
import FAQ from '../components/FAQ';
import BlogTips from '../components/BlogTips';
import PopularClassesSection from '../components/PopularClassesSection';
import FeedBacks from '../components/FeedBacks';
import WebsiteStats from '../components/WebsiteStats';
import FreeResources from '../components/FreeResources';
import CareerInvestSection from '../components/CareerInvestSection';

const Home = () => {
  return (
    <>
      {/* Inspire → Show offerings → Prove credibility → Build trust → Add value → Reassure. */}
      <Banner />
      <PartnersSlider />
      <div className='bg-gradient-to-b from-white via-blue-50 to-orange-50'>
        <CareerInvestSection />
        <PopularClassesSection />
        <FeedBacks />
      </div>
      <div className='bg-gradient-to-b from-orange-50 via-white to-purple-50'>
        <WebsiteStats />
        <InspireTeachers />
      </div>
      <div className='bg-gradient-to-b from-purple-50 via-white to-green-50'>
        <FreeResources />
        <BlogTips />
      </div>
      <FAQ />

    </>
  );
};

export default Home;