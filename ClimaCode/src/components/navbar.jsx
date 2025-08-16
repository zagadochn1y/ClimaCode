import logo from '../images/main_logo.png'
import "../styles/navbar.css"
export default function Navbar() {
    return (
        <header className='navbar'>
            <a href="#" className='logo'><img src={logo} alt="" /> ClimaCode</a>
            <a href="#" className='nav-btn'>ClimaScan</a>
            <a href="#" className='nav-btn'>EcoDev School</a>
            <a href="#" className='nav-btn'>ClimaOffset</a>
            <a href="#" className='nav-login'>Log in</a>
        </header>
    )
}