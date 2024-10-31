"use client";

import Link from "next/link";
import React from "react";
// import { LuLogIn, LuUser } from "react-icons/lu";
import Icon from "./Icon";
// import roadmapState from "@/lib/state";
// import { getAccount } from "@/lib/appwrite/api";
// import { useUserContext } from "@/context/AuthContext";
// import { toast } from "react-toastify";
// import Profile from "./Profile";
// import { useUserContext } from "@/context/AuthContext";

const Navbar = () => {
  return (
    <nav className="w-full flex items-center justify-between">
      <div className="flex items-center justify-start gap-4">
        <Link href="/">
          <Icon title="DevPath" />
        </Link>

        {/* <span>
          <Link href="/roadmaps">Roadmaps</Link>
        </span>
        <span>
          <Link href="/roadmaps">Resources</Link>
        </span>
        <span>
          <Link href="/roadmaps">About</Link>
        </span> */}
      </div>
      {/* <Profile user={user} /> */}
    </nav>
  );
};

export default Navbar;
