
import { Inter } from "next/font/google";

import Catalog from "@/pages/Catalog";


const inter = Inter({ subsets: ["latin"] });

export default function pages() {
    return (
        <>
            <Catalog/>
        </>
    );
}
