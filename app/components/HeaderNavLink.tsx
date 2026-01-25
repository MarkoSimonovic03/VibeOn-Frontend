import { NavLink } from 'react-router'

export default function HeaderNavLink({to, name}: { to : string; name : string }) {
    return (
        <NavLink to={to} className={({ isActive }) => `text-2xl mr-4 ${isActive ? 'font-bold' : 'font-normal'}`}>{name}</NavLink>
    )
}
