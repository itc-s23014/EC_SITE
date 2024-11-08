
import { Inter } from "next/font/google";

import LoginPage from "@/pages/login";


const inter = Inter({ subsets: ["latin"] });

export default function pages() {
    return (
        <>
            <LoginPage/>
        </>
    );
}
