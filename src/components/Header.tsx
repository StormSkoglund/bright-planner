import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 p-4 flex flex-col items-start gap-2">
      <nav>
        <Link to="/" className="mr-4 text-blue-600 hover:underline">
          Hjem
        </Link>
        <span>|</span>
        <Link to="/about" className="ml-4 text-blue-600 hover:underline">
          Om
        </Link>
      </nav>
      <h1 className="text-2xl font-bold">Dagens Opskrifter</h1>
    </header>
  );
}
