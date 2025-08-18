import React from 'react';
import Banner from '../components/Banner';
import PartnersSlider from '../components/PartnersSlider';
import InspireTeachers from '../components/InspireTeachers';
import FAQ from '../components/FAQ';
import BlogTips from '../components/BlogTips';
import PopularClassesSection from '../components/PopularClassesSection';
import FeedBacks from '../components/FeedBacks';
import FreeResources from '../components/FreeResources';
import CareerInvestSection from '../components/CareerInvestSection';

const Home = () => {
  return (
    <>
      <Banner />
      <PartnersSlider />

      <div className="section-1">
        <CareerInvestSection />
        <PopularClassesSection />
        <FeedBacks />
      </div>

      <div className="section-2">
        <InspireTeachers />
      </div>

      <div className="section-3">
        <FreeResources />
        <BlogTips />
      </div>

      <FAQ />
    </>

  );
};

export default Home;