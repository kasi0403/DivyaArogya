import React from 'react';
import { Disclosure } from '@headlessui/react';
import { Link, useLocation } from 'react-router-dom';

const navigation = [
  { name: 'Home', href: '/', visibleTo: ['doctor', 'Care Taker'] },
  { name: 'LogIn', href: '/Login', visibleTo: ['guest'] },
  { name: 'Reports', href: '/Reports', visibleTo: ['doctor', 'Care Taker'] },
  { name: 'Admin', href: '/Admin', visibleTo: ['admin'] },
  { name: 'Logout', href: '#', visibleTo: ['doctor', 'Care Taker', 'admin'] },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Header = ({ handleLogout }) => {
  const location = useLocation();
  const userType = sessionStorage.getItem('userType') || 'guest';
  const filteredNavigation = navigation.filter((item) => (item.visibleTo || []).includes(userType));

  return (
    <Disclosure as="nav" className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[90%] z-50 shadow-lg rounded-lg backdrop-blur-md bg-black/80">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="hidden sm:block">
                  <div className="flex space-x-4">
                    {filteredNavigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          item.href === location.pathname
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'rounded-md px-4 py-2 text-sm font-medium transition-all'
                        )}
                        onClick={item.name === 'Logout' ? handleLogout : null}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              {/* Display User Role */}
              {userType !== 'guest' && (
                <div className="text-gray-300 text-sm font-medium px-4 py-2 bg-gray-800 rounded-md">
                  Role: {userType}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
};

export default Header;
