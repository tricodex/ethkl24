import Link from 'next/link';

async function TopNav() {
    return (
    <nav className="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-[#2e026d] to-[#15162c] text-white">
      <div>
        <Link href="/" className="mr-4">PMA</Link>
        <Link href="/about" className="mr-4">About</Link>
        <Link href="/contact">Contact</Link>
      </div>
      </nav>
    );
}

export default TopNav;