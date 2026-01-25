import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import Header from '~/components/Header';

export default function Layout() {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/');
        }
    }, [navigate]);

    return (
        <>
            <Header isLoggedIn={false} user={null} />
            <div className="flex h-screen w-screen pt-24 items-center justify-center">
                <div className="flex lg:flex-1 flex-col lg:flex-row items-center justify-center gap-16">
                    <div className='flex text-vibeon text-5xl tracking-wide items-center justify-center '>
                        <div>
                            <h1 className="mb-4"><b>VibeOn</b> - Welcome!</h1>
                            <h1>Connect With People!</h1>
                        </div>
                    </div>

                    <Outlet />
                </div>
            </div>
        </>
    );
}