import { Mail, Linkedin, Github } from "lucide-react";
import iii from "./photo(2).png"; // ✅ import your photo

const Self = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4">Connect with Me</h1>

      {/* Profile Photo */}
      <div className="flex justify-center mb-6">
        <img
          src={iii}
          alt="Subrata Mandal"
          className="w-[100px] h-[108px] rounded-full border-2 border-green-500 shadow-md"
        />
      </div>

      {/* Social Links */}
      <div className="flex justify-center gap-6">
        <a
          href="mailto:subratamandal3328@gmail.com"
          className="w-12 h-12 flex items-center justify-center rounded-full border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition"
        >
          <Mail className="w-6 h-6" />
        </a>
        <a
          href="https://www.linkedin.com/in/subrata-mandal-2930b52ab"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 flex items-center justify-center rounded-full border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition"
        >
          <Linkedin className="w-6 h-6" />
        </a>
        <a
          href="https://github.com/Subrata-003"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-700 text-gray-700 hover:bg-gray-700 hover:text-white transition"
        >
          <Github className="w-6 h-6" />
        </a>
      </div>
    </div>
  );
};

export default Self;
