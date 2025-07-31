"use client";

import {motion} from "framer-motion";

export default function Page() {
    return (
        <div className={"grid grid-cols-2 grid-rows-1 gap-4"}>
            <section
                className="text-white"
            >
                <div className={"flex flex-col h-screen text-black mx-32 justify-center"}>
                    <h1 className={"font-black text-4xl text-center py-8"}>Connexion</h1>

                    <form>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <p className={"text-gray-400 underline float-end my-3 cursor-pointer"}>Mot de passe oublié</p>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 cursor-pointer"
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
                className="h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-r from-blue-400 to-blue-950 text-white"
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