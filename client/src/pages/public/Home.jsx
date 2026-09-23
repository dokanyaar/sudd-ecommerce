import BestSeller from '../../components/public/BestSeller';
import Hero from '../../components/public/Hero';
import LatestCollection from '../../components/public/LatestCollection';
import NewsLetter from '../../components/public/NewsLetter';

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollection />
      <BestSeller />
    </div>
  );
};
export default Home;
