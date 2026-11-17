import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  Headphones,
  PackageCheck,
  BadgePercent,
  Globe,
  ChevronDown,
} from "lucide-react";
import PageContainer from "./PageContainer";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  return (
    <div className="hidden md:block bg-[#0b511d] text-white text-[13px] border-b border-green-800">
      <PageContainer>
        <div className="h-8 flex items-center justify-between">

          {/* Left */}
          <div className="flex items-center gap-4 font-medium">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-white" />
              <span>Deliver to: 122, Sollaikkolaimedu, Tamil Nadu 635802</span>
            </div>
            <a href="tel:+918940450960" className="flex items-center gap-1.5 hover:text-yellow-300 transition">
              <Phone size={14} />
              <span>+91 8940450960</span>
            </a>
            <a href="mailto:dhivakarp305@gmail.com" className="flex items-center gap-1.5 hover:text-yellow-300 transition">
              <Mail size={14} />
              <span>dhivakarp305@gmail.com</span>
            </a>
          </div>

          {/* Right */}
          <div className="flex items-center gap-6">

            <button className="flex items-center gap-2 hover:text-yellow-300 transition">
              <Headphones size={16} />
              <span>Customer Support</span>
            </button>

            <button onClick={() => navigate('/ordersmain')} className="flex items-center gap-2 hover:text-yellow-300 transition">
              <PackageCheck size={16} />
              <span>Track Order</span>
            </button>

            <button className="flex items-center gap-2 hover:text-yellow-300 transition">
              <BadgePercent size={16} />
              <span>Today's Offers</span>
            </button>

            <button className="flex items-center gap-1 hover:text-yellow-300 transition">
              <Globe size={16} />
              <span>English</span>
              <ChevronDown size={14} />
            </button>

          </div>

        </div>
      </PageContainer>
    </div>
  );
};

export default Header;