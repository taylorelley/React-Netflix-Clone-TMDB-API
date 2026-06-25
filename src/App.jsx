import './App.css';
import Header from './components/Header/Header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CombinedContextProvider from './context/index';
import HomePage from './pages/HomePage/HomePage';
import MovieDetails from './pages/MovieDetails/MovieDetails';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';

/**
 * Application root. Sets up routing and global providers.
 * No props — all configuration comes from env vars and context.
 */
function App() {
    return (
        <BrowserRouter>
            <CombinedContextProvider>
                <Header />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/moviedetails/:movieid" element={<MovieDetails />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/signin" element={<SignIn />} />
                </Routes>
            </CombinedContextProvider>
        </BrowserRouter>
    );
}

export default App;