import { useState } from 'react';
import  AppPage  from './AppPage.tsx';
import LandingPage from './LandingPage.tsx';

export const Page = () => {
	const [isApp, setIsApp] = useState(false);

	return <> 
		{isApp ? (
        <AppPage />
      ) : (
        <LandingPage setIsApp={setIsApp} />
      )}
	
	</>;
};