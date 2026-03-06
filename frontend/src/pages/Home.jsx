import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Classes from '../components/Classes';
import Pricing from '../components/Pricing';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Home = () => {
    return (
        <div className='bg-beige min-h-screen selection:bg-orange/20'>
            <Navbar />
            <main>
                <Hero />
                <section id='about'><About/></section>
                <section id='classes'><Classes/></section>
                <section id='pricing'><Pricing/></section>
                <section id='contact'><Contact/></section>
            </main>
            <Footer />
        </div>
    )
};

export default Home;
