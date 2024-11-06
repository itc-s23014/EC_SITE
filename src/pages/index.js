import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import Home from "@/pages/Catalog";
import LoginPage from "@/pages/login";


const inter = Inter({ subsets: ["latin"] });

export default function pages() {
    return (
        <>
            <LoginPage/>
        </>
    );
}
