"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
    title: string;
    value: number; // Pourcentage actuel
    previousValue?: number; // Pourcentage de la campagne précédente
    icon?: React.ReactNode;
    className?: string;
}

export function StatCard({
                             title,
                             value,
                             previousValue,
                             icon,
                             className
                         }: StatCardProps) {
    // Calculer la tendance
    const getTrend = () => {
        if (previousValue === undefined || previousValue === null) {
            return { type: "neutral", diff: 0 };
        }

        const diff = value - previousValue;

        if (diff > 0) return { type: "up", diff };
        if (diff < 0) return { type: "down", diff };
        return { type: "neutral", diff: 0 };
    };

    const trend = getTrend();

    // Déterminer la couleur selon le contexte
    // Pour "Mails ouverts" et "Liens cliqués" : Augmentation = Mauvais (rouge), Diminution = Bon (vert)
    // Pour "Données envoyées" : Idem
    const getColor = () => {
        if (trend.type === "neutral") return "bg-gray-500";

        // Pour les métriques de phishing, une augmentation est mauvaise
        if (trend.type === "up") return "bg-red-500";
        return "bg-green-500";
    };

    const getTrendIcon = () => {
        if (trend.type === "up") return <TrendingUp className="h-5 w-5" />;
        if (trend.type === "down") return <TrendingDown className="h-5 w-5" />;
        return <Minus className="h-5 w-5" />;
    };

    return (
        <Card className={cn("relative overflow-hidden", className)}>
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    {icon}
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Bloc de pourcentage principal */}
                <div
                    className={cn(
                        "rounded-lg p-6 relative transition-colors",
                        getColor()
                    )}
                >
                    <div className="flex items-center justify-between text-white">
                        <div>
                            <div className="text-4xl font-bold">{value}%</div>
                            {previousValue !== undefined && (
                                <div className="text-sm opacity-90 mt-1 flex items-center gap-1">
                                    {trend.type !== "neutral" && (
                                        <>
                                            {getTrendIcon()}
                                            {Math.abs(trend.diff).toFixed(1)}% vs dernière campagne
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Flèche de tendance en bas à droite */}
                    <div className="absolute bottom-2 right-2 opacity-30">
                        {trend.type === "up" && (
                            <TrendingUp className="h-12 w-12" />
                        )}
                        {trend.type === "down" && (
                            <TrendingDown className="h-12 w-12" />
                        )}
                    </div>
                </div>

                {/* Comparaison avec la campagne précédente */}
                {previousValue !== undefined && (
                    <div className="mt-3 text-xs text-muted-foreground">
                        Campagne précédente : {previousValue}%
                    </div>
                )}
            </CardContent>
        </Card>
    );
}