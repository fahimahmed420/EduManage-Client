import React from 'react';
import Banner from '../components/Banner';
import PartnersSlider from '../components/PartnersSlider';
import InspireTeachers from '../components/InspireTeachers';
import FAQ from '../components/FAQ';
import BlogTips from '../components/BlogTips';
import PopularClassesSection from '../components/PopularClassesSection';

const Home = () => {
    return (
      <>
      <Banner/>
      <PartnersSlider/>
      <PopularClassesSection/>
      <InspireTeachers/>
      <BlogTips/>
      <FAQ/>
      </>
    );
};

export default Home;