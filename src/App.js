/** @format */

import React from 'react';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	useLocation,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import SubmitQuiz from './pages/SubmitQuiz';
import AdminDashboard from './pages/AdminDashboard';
import BrowseQuizzes from './pages/BrowseQuizzes';
import Documentation from './pages/Documentation';

import './styles/App.css';

// Scroll to top component
function ScrollToTop() {
	const location = useLocation();

	React.useEffect(() => {
		window.scrollTo(0, 0);
	}, [location]);

	return null;
}

function App() {
	return (
		<Router>
			<ScrollToTop />
			<div className='app'>
				<Navbar />
				<main className='main-content'>
					<Routes>
						<Route
							path='/'
							element={<Home />}
						/>
						<Route
							path='/submit'
							element={<SubmitQuiz />}
						/>
						<Route
							path='/admin'
							element={<AdminDashboard />}
						/>
						<Route
							path='/browse'
							element={<BrowseQuizzes />}
						/>
						<Route
							path='/docs'
							element={<Documentation />}
						/>
						<Route
							path='/docs/*'
							element={<Documentation />}
						/>
					</Routes>
				</main>
				<ToastContainer
					position='bottom-right'
					theme='dark'
				/>
			</div>
		</Router>
	);
}

export default App;
