import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Classes from '../components/Classes';
import Pricing from '../components/Pricing';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchScheduledSessions } from '../redux/sessionsSlice';
import ScheduleModal from '../modals/ScheduleModal';

const Home = () => {
    const dispatch = useDispatch();
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);

    const handleOpenSchedule = (classTitle) => {
        setSelectedClass(classTitle);
        setIsScheduleOpen(true);
        dispatch(fetchScheduledSessions()); // Fetch live data
    };

    return (
        <div className='bg-beige min-h-screen selection:bg-orange/20'>
            <Navbar />
            <main>
                <Hero />
                <section id='about'><About/></section>
                <section id='classes'><Classes onBookClick={handleOpenSchedule} /></section>
                <section id='pricing'><Pricing/></section>
                <section id='contact'><Contact/></section>
            </main>
            <Footer />

            {/* Modals */}
            <ScheduleModal 
                isOpen={isScheduleOpen} 
                classType={selectedClass}
                onClose={() => setIsScheduleOpen(false)} 
            />
        </div>
    )
};

export default Home;
