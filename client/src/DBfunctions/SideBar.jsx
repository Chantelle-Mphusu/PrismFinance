import { 
  HomeIcon, 
  DocumentDuplicateIcon, 
  CogIcon,
  CreditCardIcon,
  PowerIcon,
  BanknotesIcon,
} from '@heroicons/react/24/solid'; 

export const SidebarData = [
  {
    title: 'Home',
    path: '/dashboard',
    icon: <HomeIcon className="w-6 h-6 text-gray" />,
    cName: 'nav-text',
  },

  {
    title: 'Transactions',
    path: '/Transactions',
    icon: <CreditCardIcon className="w-6 h-6 text-gray" />,
    cName: 'nav-text',
  },

  {
    title: 'Budgets',
    path: '/budgets',
    icon: <BanknotesIcon className="w-6 h-6 text-gray" />,
    cName: 'nav-text',
  },

  {
    title: 'Reports',
    path: '/Reports',
    icon: <DocumentDuplicateIcon className="w-6 h-6 text-gray" />,
    cName: 'nav-text',
  },

  {
    title: 'Settings',
    path:'/Settings',
    icon: <CogIcon className='w-6 h-6 text-gray'/>,
    cName: 'nav-text',
  },

  {
    title: 'Log Out',
    path:'/logout',
    icon: <PowerIcon className='w-6 h-6 text-gray'/>,
    cName: 'nav-text',
  }
];
