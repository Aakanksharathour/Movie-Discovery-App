import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import WishlistPage from './pages/WishlistPage';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main className="app__main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/movies/:id" element={<MovieDetailsPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
