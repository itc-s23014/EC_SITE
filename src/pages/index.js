
import { Inter } from "next/font/google";

import Catalog from "@/pages/Catalog";
import Home_Page from "@/pages/Home_ page";


const inter = Inter({ subsets: ["latin"] });

export default function pages() {
    return (
        <>
            <Home_Page />
        </>
    );
}
