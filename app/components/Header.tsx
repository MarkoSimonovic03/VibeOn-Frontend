import { NavLink } from 'react-router-dom';
import HeaderNavLink from './HeaderNavLink';

interface HeaderUserDto {
  username: string;
  profileImageUrl: string;
}

interface HeaderProps {
  isLoggedIn: boolean;
  user: HeaderUserDto | null;
}

export default function Header({ isLoggedIn, user }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 h-24 bg-vibeon text-white w-screen md:px-6 lg:px-16 flex justify-between items-center z-50">
      <NavLink to="/" className="text-4xl font-bold">VibeOn</NavLink>

      {isLoggedIn && (
        <>
          <div className='flex items-center'>
            <HeaderNavLink to='/' name='Home' />
            <HeaderNavLink to='/friends' name='Friends' />
            <HeaderNavLink to='/create' name='Create' />
            <HeaderNavLink to='/chats' name='Chats' />

            {/* <div className="relative">
              <input
                className="bg-white rounded-xl text-black p-0.5 pl-2 w-50 focus:outline-none"
                type="text"
                name="searchInput"
              />
              <img
                src="search.png"
                className="w-6 h-6 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer z-4"
                alt="search icon"
                onClick={() => { console.log('search') }}>
              </img>
            </div> */}
          </div>

          <NavLink to={user?.username ? `/profile/${user.username}` : "/"} className='flex items-center'>
            <div className="mr-3 text-2xl font-bold">{user?.username ?? 'username'}</div>
            <img className='w-12 h-12 rounded-full object-cover' src={`http://localhost:8080/images/${user?.profileImageUrl ?? "profile.png"}`} alt="profil" />
          </NavLink>
        </>
      )}

      {!isLoggedIn && (
        <div className="flex items-center">
          <HeaderNavLink to='/login' name='Login' />
          <HeaderNavLink to='/register' name='Register' />
        </div>
      )}
    </header>
  );
}