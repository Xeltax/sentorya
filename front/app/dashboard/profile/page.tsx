"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    User as UserIcon,
    Mail,
    Phone,
    Calendar,
    Clock,
    Building2,
    Users,
    Shield,
    Crown,
    MapPin,
    Activity
} from "lucide-react";
import { getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { UserJWT } from "@/types/UserJWT";
import Client from "@/utils/client";
import { ROUTES } from "@/utils/routes";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {$} from "kleur/colors";
import {Button} from "@/components/ui/button";
import ChangePasswordPopup from "@/components/Popup/ChangePasswordPopup/ChangePasswordPopup";

interface User {
    id: string;
    email: string;
    name: string;
    phoneNumber?: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    lastLogin?: string;
    firstConnection: boolean;
}

interface Organization {
    id: string;
    name: string;
    address?: string;
    email: string;
    phoneNumber?: string;
    ownerId: string;
    createdAt: string;
    isOwner: boolean;
    memberRole: string;
    memberCount?: number;
}

interface OrganizationMember {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    role: string;
}

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [members, setMembers] = useState<Record<string, OrganizationMember[]>>({});
    const [loading, setLoading] = useState(true);
    const [userJWT, setUserJWT] = useState<UserJWT | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try {
            setLoading(true);

            // Récupérer l'ID depuis le JWT
            const jwtCookie = getCookie("JWT");
            if (!jwtCookie) return;

            const decoded: UserJWT = jwtDecode(jwtCookie as string);
            setUserJWT(decoded);
            const userId = decoded.userId;

            console.log("Chargement du profil pour l'utilisateur ID:", userId);

            const userResponse = await Client.get(ROUTES.BACK.USER.GET_BY_ID(userId));
            setUser(userResponse.data);

            // Charger les Entreprises
            const orgsResponse = await Client.get(ROUTES.BACK.USER.ORGANIZATIONS(userId));
            for (const org of orgsResponse.data) {
                if (org.ownerId === userId) {
                    org.isOwner = true
                }
            }
            console.log(orgsResponse.data)
            setOrganizations(orgsResponse.data);

            // Pour chaque organisation dont l'utilisateur est owner, charger les membres
            for (const org of orgsResponse.data) {
                if (org.ownerId === userId) {
                    const membersResponse = await Client.get(
                        ROUTES.BACK.ORGANIZATION.GET_MEMBERS(org.id)
                    );
                    console.log(membersResponse)
                    setMembers(prev => ({
                        ...prev,
                        [org.id]: membersResponse.data
                    }));
                }
            }
        } catch (error) {
            console.error("Erreur chargement profil:", error);
        } finally {
            // setLoading(false);
        }
    };

    console.log(members)

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const formatDate = (date: string) => {
        return format(new Date(date), "d MMMM yyyy 'à' HH:mm", { locale: fr });
    };

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case "ADMIN":
            case "OWNER":
                return "default";
            case "MODERATOR":
                return "secondary";
            default:
                return "outline";
        }
    };

    const handleSubmit = (data: any) => {
        console.log(data)
    }

    if (loading) {
        return (
            <div className="flex mx-auto items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-muted-foreground">Impossible de charger le profil</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 space-y-6">
            {/* Header avec avatar et nom */}
            <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                    <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-primary to-primary/60">
                        {getInitials(user.name)}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-4xl font-bold">{user.name}</h1>
                        {user.firstConnection && (
                            <Badge variant="outline" className="text-xs">
                                Première connexion
                            </Badge>
                        )}
                    </div>
                    <p className="text-muted-foreground flex items-center gap-2 mb-4">
                        <Mail className="h-4 w-4" />
                        {user.email}
                    </p>
                    <div className="flex gap-2">
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                            <Shield className="h-3 w-3 mr-1" />
                            {user.role}
                        </Badge>
                        <Badge variant={user.isActive ? "default" : "secondary"}>
                            <Activity className="h-3 w-3 mr-1" />
                            {user.isActive ? "Actif" : "Inactif"}
                        </Badge>
                    </div>

                    <Button variant={"outline"} className={"mt-2"} onClick={() => setIsOpen(true)}>
                        Changer votre mot de passe
                    </Button>
                </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Informations personnelles */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserIcon className="h-5 w-5" />
                            Informations personnelles
                        </CardTitle>
                        <CardDescription>
                            Vos informations de compte
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Téléphone */}
                        {user.phoneNumber && (
                            <div className="flex items-start gap-3">
                                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Téléphone</p>
                                    <p className="text-sm text-muted-foreground">{user.phoneNumber}</p>
                                </div>
                            </div>
                        )}

                        {/* Date de création */}
                        <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="text-sm font-medium">Membre depuis</p>
                                <p className="text-sm text-muted-foreground">
                                    {formatDate(user.createdAt)}
                                </p>
                            </div>
                        </div>

                        {/* Dernière connexion */}
                        {user.lastLogin && (
                            <div className="flex items-start gap-3">
                                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Dernière connexion</p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDate(user.lastLogin)}
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Entreprises */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Mes Entreprises
                        </CardTitle>
                        <CardDescription>
                            Entreprises dont vous êtes membre
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {organizations.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>Vous n&apos;appartenez à aucune entreprise</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {organizations.map((org) => (
                                    <Card key={org.id} className="border-2">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <CardTitle className="text-lg flex items-center gap-2">
                                                        {org.name}
                                                        {org.isOwner && (
                                                            <Badge variant="default" className="gap-1">
                                                                <Crown className="h-3 w-3" />
                                                                Propriétaire
                                                            </Badge>
                                                        )}
                                                        {!org.isOwner && (
                                                            <Badge variant="outline">
                                                                {org.memberRole}
                                                            </Badge>
                                                        )}
                                                    </CardTitle>
                                                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                                                        <Mail className="h-3 w-3" />
                                                        {org.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            {/* Informations de l'organisation */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                {org.address && (
                                                    <div className="flex items-start gap-2">
                                                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                                        <span className="text-muted-foreground">{org.address}</span>
                                                    </div>
                                                )}
                                                {org.phoneNumber && (
                                                    <div className="flex items-start gap-2">
                                                        <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                                                        <span className="text-muted-foreground">{org.phoneNumber}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-start gap-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                                                    <span className="text-muted-foreground">
                                                        Créée le {format(new Date(org.createdAt), "d MMM yyyy", { locale: fr })}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Membres (si propriétaire) */}
                                            {org.isOwner && members[org.id] && members[org.id].length > 0 && (
                                                <>
                                                    <Separator />
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <Users className="h-4 w-4 text-muted-foreground" />
                                                            <span className="text-sm font-medium">
                                                                Membres ({members[org.id].length})
                                                            </span>
                                                        </div>
                                                        <div className="space-y-2">
                                                            {members[org.id].map((member : OrganizationMember) => (
                                                                <div
                                                                    key={member.id}
                                                                    className="flex items-center justify-between p-3 rounded-lg border bg-muted/20"
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <Avatar className="h-8 w-8">
                                                                            <AvatarFallback className="text-xs">
                                                                                {getInitials(member.name)}
                                                                            </AvatarFallback>
                                                                        </Avatar>
                                                                        <div>
                                                                            <p className="text-sm font-medium">
                                                                                {member.name}
                                                                            </p>
                                                                            <p className="text-xs text-muted-foreground">
                                                                                {member.email}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <Badge variant="outline" className="text-xs">
                                                                        {member.role}
                                                                    </Badge>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            <ChangePasswordPopup isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} userJWT={userJWT}/>
        </div>
    );
}