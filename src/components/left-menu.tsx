"use client";

import { useState, useEffect,ReactElement } from "react";
import { Button } from "@/components/ui/button";

import { useNavigate } from "react-router-dom";
import {
  Users,
  Menu,
} from "lucide-react";
import Modules from '@/types/modules';
import axios from "axios";
import {getIcon} from "@/helper/icon"


export default function LeftMenu({ children }: {children : ReactElement }) {

  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const navigate = useNavigate();

  const [menuItems, setModules] = useState<Modules[]>([]);

  const getData = async () => {
    let dataModules = await axios.get(`${import.meta.env.VITE_NEXT_PUBLIC_API_BASE_URL}/modules`);
    setModules(dataModules.data as Modules[]);
  };

  useEffect(() => {
    getData();
  }, []);

const newObj  = {...children,props: {OnLoadModules: getData} };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Menu */}
      <div
        className={`bg-white p-4 shadow-lg transition-all duration-300 ${
          isMenuExpanded ? "w-64" : "w-20"
        }`}
      >
        <Button
          variant="ghost"
          className="mb-4 w-full justify-start"
          onClick={() => setIsMenuExpanded(!isMenuExpanded)}
        >
          <Menu className="h-5 w-5" />
          {isMenuExpanded && <span className="ml-2">Menu</span>}
        </Button>
        <nav>

        <Button
              key="1"
              variant="ghost"
              className="mb-2 w-full justify-start"
              onClick={() => {
                navigate(`/HomePage`);
              }}
            >
              <Users className="h-5 w-5" />
              {isMenuExpanded && <span className="ml-2">Home</span>}
            </Button>

          {menuItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className="mb-2 w-full justify-start"
              onClick={() => {
                navigate(`/List/${item.name}`);
              }}
            >
              {getIcon(item.icon)}
              {isMenuExpanded && <span className="ml-2">{item.label}</span>}
            </Button>
          ))}
          <Button
            key="modules"
            variant="ghost"
            className="mb-2 w-full justify-start"
            onClick={() => {
              navigate(`/ModulesList`);
            }}
          >
            <Users className="h-5 w-5" />
            {isMenuExpanded && <span className="ml-2">Modules</span>}
          </Button>
        </nav>
      </div>
      {newObj}
    </div>
  );
}
