"use client";

import Client from "@/utils/client";
import {motion} from "framer-motion";
import {useState} from "react";
import {ROUTES} from "@/utils/routes";
import {setCookie} from "cookies-next";
import {toast} from "sonner";

export default function Page() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Handle form submission logic here
        const credentials = {
            email: email,
            password: password
        }

        Client.post(ROUTES.BACK.AUTH.LOGIN, credentials).then((response) => {
            console.log(response);
            if (response.status === 200 && response.data.token) {
                const token = response.data.token;
                localStorage.setItem("JWT", token);
                setCookie("JWT", token, {
                    maxAge: 60 * 60 * 24 * 7, // 7 days
                })
                if (response.data.hasOrganization) {
                    localStorage.setItem("organizationId", response.data.organizationId);
                }
                if (response.data.user.role === "ADMIN") {
                    window.location.href = "/admin"; // Change this to your desired route
                } else {
                    window.location.href = "/dashboard"; // Change this to your desired route
                }
            } else {
                // Handle login failure (e.g., show an error message)
                alert("Login failed: " + response.data.error);
            }
        }).catch((error) => {
            console.log(error);
            toast.error("Connexion échoué : " + error.response.data.error);
        })
    };

    return (
        <div className={"grid grid-cols-2 grid-rows-1 gap-4"}>
            <section
                className="text-white"
            >
                <div className={"flex flex-col h-screen text-black mx-32 justify-center"}>
                    <h1 className={"font-black text-4xl text-center py-8"}>Connexion</h1>

                    <form onSubmit={onSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setEmail(event.target.value)}}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium mb-2">Mot de passe</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setPassword(event.target.value)}}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <p className={"text-gray-400 underline float-end my-3 cursor-pointer"}>Mot de passe oublié</p>
                        <button
                            type="submit"
                            className="w-full bg-orange-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 cursor-pointer"
                        >
                            Se connecter
                        </button>
                    </form>
                </div>

            </section>
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-r from-orange-400 to-orange-800 text-white"
            >
                <div className="container mx-16 px-4 py-8">
                    <h1 className="text-4xl font-bold mb-4 text-center">Espace client Sentorya</h1>
                    {/*<p className="text-lg mb-6">*/}
                    {/*    Solutions clés en mains pour votre entreprise. Découvrez nos services et comment nous pouvons vous aider à atteindre vos objectifs.*/}
                    {/*</p>*/}
                    {/*<ul className="list-disc pl-5 space-y-2">*/}
                    {/*    <li>Consultation personnalisée</li>*/}
                    {/*    <li>Développement de logiciels</li>*/}
                    {/*    <li>Intégration de systèmes</li>*/}
                    {/*    <li>Support technique 24/7</li>*/}
                    {/*</ul>*/}
                </div>
            </motion.section>
        </div>
    )
}