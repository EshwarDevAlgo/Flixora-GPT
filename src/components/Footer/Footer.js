import React from "react";

const Footer = () => (
  <footer className="mt-16 py-8 px-4 md:px-8 border-t border-gray-800 text-center">
    <p className="text-gray-500 text-sm">
      © {new Date().getFullYear()} FlixoraGPT — AI-Powered Streaming Discovery
    </p>
    <p className="text-gray-600 text-xs mt-1">
      Powered by TMDB &amp; OpenAI · Not a streaming service
    </p>
  </footer>
);

export default Footer;
