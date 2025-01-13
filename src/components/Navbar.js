/** @format */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
	const location = useLocation();

	return (
		<nav className='navbar'>
			<div className='navbar-container'>
				<div className='navbar-brand'>
					<div className='navbar-logo-container'>
						<svg
							className='navbar-logo'
							viewBox='0 0 24 24'
						>
							<path
								fill='currentColor'
								d='M20.5,11H19V7C19,5.89 18.1,5 17,5H13V3.5A2.5,2.5 0 0,0 10.5,1A2.5,2.5 0 0,0 8,3.5V5H4A2,2 0 0,0 2,7V10.8H3.5C5,10.8 6.2,12 6.2,13.5C6.2,15 5,16.2 3.5,16.2H2V20A2,2 0 0,0 4,22H7.8V20.5C7.8,19 9,17.8 10.5,17.8C12,17.8 13.2,19 13.2,20.5V22H17A2,2 0 0,0 19,20V16H20.5A2.5,2.5 0 0,0 23,13.5A2.5,2.5 0 0,0 20.5,11Z'
							/>
						</svg>
						<div className='logo-glow'></div>
					</div>
					<Link
						to='/'
						className='navbar-title'
					>
						TriviAPI
					</Link>
				</div>
				<div className='navbar-links'>
					<Link
						to='/'
						className={`nav-link ${
							location.pathname === '/' ? 'active' : ''
						}`}
					>
						<span className='nav-icon'>🏠</span>
						<span className='nav-text'>Ana Sayfa</span>
					</Link>
					<Link
						to='/submit'
						className={`nav-link ${
							location.pathname === '/submit' ? 'active' : ''
						}`}
					>
						<span className='nav-icon'>➕</span>
						<span className='nav-text'>Soru Ekle</span>
					</Link>
					<Link
						to='/browse'
						className={`nav-link ${
							location.pathname === '/browse' ? 'active' : ''
						}`}
					>
						<span className='nav-icon'>🎯</span>
						<span className='nav-text'>Sorular</span>
					</Link>
					<Link
						to='/docs'
						className={`nav-link ${
							location.pathname === '/docs' ? 'active' : ''
						}`}
					>
						<span className='nav-icon'>📚</span>
						<span className='nav-text'>Dokümantasyon</span>
					</Link>
					<Link
						to='/admin'
						className={`nav-link ${
							location.pathname === '/admin' ? 'active' : ''
						}`}
					>
						<span className='nav-icon'>⚙️</span>
						<span className='nav-text'>Yönetici</span>
					</Link>
				</div>
			</div>
		</nav>
	);
}

export default Navbar;
