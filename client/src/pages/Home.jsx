import React from "react";
import { Link } from "react-router-dom";
import { Car, Leaf, Shield, Eye, Users, Zap, Droplet, Trash2 } from "lucide-react";

const Home = () => {
  const facilityDetails = [
    { name: "Parking Area", icon: Car },
    { name: "Green Garden", icon: Leaf },
    { name: "24x7 Security", icon: Shield },
    { name: "CCTV Surveillance", icon: Eye },
    { name: "Community Hall", icon: Users },
    { name: "Power Backup", icon: Zap },
    { name: "Water Supply", icon: Droplet },
    { name: "Waste Management", icon: Trash2 },
  ];

  const gallery = [
    "https://images.unsplash.com/photo-1460317442991-0ec209397118",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    "https://images.unsplash.com/photo-1448630360428-65456885c650",
    "https://images.unsplash.com/photo-1494526585095-c41746248156",
  ];

  return (
    <div className="bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-slate-900/90 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-amber-400">
            Green Valley Society
          </h1>

          <ul className="hidden md:flex gap-8 font-medium">
            <li>
              <a href="#home" className="hover:text-amber-400">
                Home
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-amber-400">
                About
              </a>
            </li>
            <li>
              <a href="#facilities" className="hover:text-amber-400">
                Facilities
              </a>
            </li>
            <li>
              <a href="#gallery" className="hover:text-amber-400">
                Gallery
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-amber-400">
                Contact
              </a>
            </li>
          </ul>

          <Link
            to="/login"
            className="px-5 py-1 border-2 border-white rounded-lg text-white font-medium text-lg hover:bg-amber-400 hover:text-black hover:border-amber-400 transition-all duration-300"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative text-center px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Welcome To
            <span className="text-amber-400"> Green Valley Society</span>
          </h1>

          <p className="max-w-3xl mx-auto text-lg text-gray-300 mb-8">
            Safe, Secure and Modern Community Living with Premium Infrastructure
            and Comfortable Lifestyle.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="#about"
              className=" text-white border-white border-2   px-8 py-3 rounded-lg font-semibold hover:bg-amber-400 hover:text-black hover:border-amber-400 transition-all duration-300"
            >
              Explore Society
            </a>

            <button className="">
              <Link
                to="/login"
                className="px-8 py-3 border-2 border-white rounded-lg text-white font-semibold text-lg hover:bg-amber-400 hover:text-black hover:border-amber-400 transition-all duration-300"
              >
                Login
              </Link>
            </button>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-amber-400 mb-12">
            About Our Society
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <img
              src="https://images.unsplash.com/photo-1484154218962-a197022b5858"
              alt=""
              className="rounded-2xl"
            />

            <div>
              <p className="text-gray-300 leading-8">
                Green Valley Society is a modern residential community designed
                for safe and peaceful living. We provide quality infrastructure,
                secure surroundings and excellent facilities for all residents.
              </p>

              <div className="mt-8 space-y-4">
                <p>✅ Safe Environment</p>
                <p>✅ Modern Infrastructure</p>
                <p>✅ Community Living</p>
                <p>✅ Resident Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section id="facilities" className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-amber-400 mb-12">
            Society Facilities
          </h2>

          <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6">
            {facilityDetails.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-slate-950/60 border border-slate-800/80 p-6 rounded-xl hover:scale-105 hover:border-amber-400/50 hover:shadow-lg hover:shadow-amber-400/5 transition-all duration-300 flex flex-col items-center text-center group"
                >
                  <div className="p-3 bg-slate-800 text-amber-400 rounded-xl mb-4 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all duration-300">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-200 group-hover:text-white transition-colors">
                    {item.name}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-amber-400 mb-12">
            Society Living Process
          </h2>

          <div className="grid md:grid-cols-5 gap-6">
            {[
              "Resident Registration",
              "Flat Allocation",
              "Community Access",
              "Events Participation",
              "Secure Living",
            ].map((step, index) => (
              <div
                key={index}
                className="bg-slate-950/60 p-6 rounded-xl border border-slate-800/80 hover:scale-105 hover:border-amber-400/50 hover:shadow-lg hover:shadow-amber-400/5 transition-all duration-300 relative overflow-hidden group text-center flex flex-col justify-center min-h-[140px]"
              >
                <div className="absolute -top-2 -right-2 text-5xl font-black text-slate-800/40 group-hover:text-amber-400/10 transition-colors select-none">
                  {index + 1}
                </div>
                <h3 className="font-semibold text-sm text-slate-300 group-hover:text-white relative z-10">
                  {step}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-6 text-center">
            {[
              { label: "Residents", value: "500+" },
              { label: "Flats", value: "200+" },
              { label: "Blocks", value: "10+" },
              { label: "Security", value: "24x7" },
              { label: "Visitors", value: "1000+" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-8 hover:scale-105 hover:border-amber-400/50 hover:shadow-lg hover:shadow-amber-400/5 transition-all duration-300 flex flex-col items-center justify-center"
              >
                <span className="text-3xl font-black text-amber-400 mb-1">{stat.value}</span>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-amber-400 mb-12">
            Society Gallery
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {gallery.map((img, index) => (
              <div key={index} className="overflow-hidden rounded-xl group border border-slate-800/80 hover:border-amber-400/50 hover:shadow-lg hover:shadow-amber-400/5 transition-all duration-300">
                <img
                  key={index}
                  src={img}
                  alt=""
                  className="h-72 w-full object-cover group-hover:scale-110 transition duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-amber-400 mb-12">
            Contact Us
          </h2>

          <div className="bg-slate-950/60 border border-slate-800/80 hover:border-amber-400/30 hover:shadow-xl hover:shadow-amber-400/5 transition-all duration-300 rounded-2xl p-10">
            <p className="mb-4 text-xl">👤 Society Admin : Rohit Sharma</p>

            <p className="mb-4">📞 Mobile : +91 9876543210</p>

            <p className="mb-4">📧 Email : admin@greenvalleysociety.com</p>

            <p>📍 Address : Green Valley Society, Jaipur, Rajasthan, India</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-6 text-center">
        <p className="text-gray-400">
          © 2026 Green Valley Society. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
