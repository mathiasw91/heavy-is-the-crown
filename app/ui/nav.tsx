'use client'

import { useState } from 'react'

export default function Nav() {

  const [mobileOpen, setMobileOpen] = useState(false);
  const linkClasses = (active = false) => `block py-2 px-3 rounded ${active ? 'bg-highlight' : ''} md:hover:bg-highlight md:border-0 md:p-0 text-secondary`;

  return (
    <nav className="border-secondary bg-primary border-b-2">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="self-center text-2xl font-semibold whitespace-nowrap text-secondary">Heavy is the Crown</div>
        <button data-collapse-toggle="navbar-default" type="button" onClick={() => setMobileOpen(!mobileOpen)}
          className="unstyled inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-secondary rounded-lg md:hidden hover:bg-highlight focus:outline-none focus:ring-2 focus:ring-highlight" aria-controls="navbar-default" aria-expanded="false">
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
            </svg>
        </button>
        <div className={`${mobileOpen ? '' : 'hidden'} w-full md:block md:w-auto`}>
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-highlight rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-gray-900">
            <li>
              <a href="#" className={linkClasses(true)}>Standings</a>
            </li>
            <li>
              <a href="#" className={linkClasses()}>Games</a>
            </li>
            <li>
              <a href="#" className={linkClasses()}>Players</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}