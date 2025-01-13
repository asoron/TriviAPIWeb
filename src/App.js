/** @format */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import SubmitQuiz from './pages/SubmitQuiz';
import AdminDashboard from './pages/AdminDashboard';
import BrowseQuizzes from './pages/BrowseQuizzes';

import './styles/App.css';

function App() {
	return (
		<Router>
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
