import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { EventHighlights } from './components/EventHighlights';
import { Activities } from './components/Activities';
import { Games } from './components/Games';
import { Gallery } from './components/Gallery';
import { Volunteer } from './components/Volunteer';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main>
        <Hero />
        <EventHighlights />
        <Activities />
        <Games />
        <Gallery />
        <Volunteer />
      </main>
      <Footer />
    </div>
  );
}

export default App;
