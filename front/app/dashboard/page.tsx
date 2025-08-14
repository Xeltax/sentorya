"use client";
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Line, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Users, AlertTriangle, CheckCircle, Clock, TrendingUp, Eye, MousePointer } from 'lucide-react';

const mockCampaigns = [
    {
        id: 1,
        name: "Campagne Sécurité IT",
        created_date: "2025-08-10T09:51:32.5700752Z",
        launch_date: "2025-08-10T10:00:00Z",
        status: "Completed",
        results: [
            { id: "6LuPBHE", status: "Clicked", email: "clement@test.com", first_name: "Clément", last_name: "Honoré", position: "IT Manager", send_date: "2025-08-10T10:00:00Z", reported: false },
            { id: "7MvQCIF", status: "Submitted Data", email: "marie@test.com", first_name: "Marie", last_name: "Dubois", position: "HR Director", send_date: "2025-08-10T10:00:00Z", reported: true },
            { id: "8NwRDJG", status: "Email Sent", email: "jean@test.com", first_name: "Jean", last_name: "Martin", position: "Developer", send_date: "2025-08-10T10:00:00Z", reported: false },
            { id: "9OxSEKH", status: "Email Opened", email: "sophie@test.com", first_name: "Sophie", last_name: "Bernard", position: "Designer", send_date: "2025-08-10T10:00:00Z", reported: false },
            { id: "0PyTFLI", status: "Clicked", email: "lucas@test.com", first_name: "Lucas", last_name: "Petit", position: "Sales", send_date: "2025-08-10T10:00:00Z", reported: false }
        ],
        template: { name: "Mise à jour sécuritaire urgente", subject: "Action requise: Mise à jour de sécurité" }
    },
    {
        id: 2,
        name: "Test Phishing RH",
        created_date: "2025-08-12T14:30:00Z",
        launch_date: "2025-08-12T15:00:00Z",
        status: "In progress",
        results: [
            { id: "1QzUGMJ", status: "Email Sent", email: "paul@test.com", first_name: "Paul", last_name: "Moreau", position: "Manager", send_date: "2025-08-12T15:00:00Z", reported: false },
            { id: "2RaVHNK", status: "Email Opened", email: "alice@test.com", first_name: "Alice", last_name: "Leroy", position: "Analyst", send_date: "2025-08-12T15:00:00Z", reported: false },
            { id: "3SbWIOL", status: "Submitted Data", email: "thomas@test.com", first_name: "Thomas", last_name: "Roux", position: "Intern", send_date: "2025-08-12T15:00:00Z", reported: false },
            { id: "4TcXJPM", status: "Clicked", email: "emma@test.com", first_name: "Emma", last_name: "Blanc", position: "Coordinator", send_date: "2025-08-12T15:00:00Z", reported: true }
        ],
        template: { name: "Formulaire RH", subject: "Mise à jour de vos informations personnelles" }
    },
    {
        id: 3,
        name: "Formation Sensibilisation",
        created_date: "2025-08-14T08:00:00Z",
        launch_date: "2025-08-14T09:00:00Z",
        status: "Completed",
        results: [
            { id: "5UdYKQN", status: "Email Sent", email: "julie@test.com", first_name: "Julie", last_name: "Garcia", position: "Secretary", send_date: "2025-08-14T09:00:00Z", reported: false },
            { id: "6VeZLRO", status: "Email Opened", email: "nicolas@test.com", first_name: "Nicolas", last_name: "Lopez", position: "Technician", send_date: "2025-08-14T09:00:00Z", reported: false },
            { id: "7WfAMSP", status: "Reported", email: "camille@test.com", first_name: "Camille", last_name: "Girard", position: "Security Officer", send_date: "2025-08-14T09:00:00Z", reported: true }
        ],
        template: { name: "Test de sensibilisation", subject: "Lien de formation obligatoire" }
    }
];

export default function Page() {
    // const [selectedCampaign, setSelectedCampaign] = useState(null);

    // Calcul des statistiques globales
    const totalCampaigns = mockCampaigns.length;
    const completedCampaigns = mockCampaigns.filter(c => c.status === 'Completed').length;
    const inProgressCampaigns = mockCampaigns.filter(c => c.status === 'In progress').length;

    const allResults = mockCampaigns.flatMap(c => c.results);
    const totalEmails = allResults.length;
    const clickedEmails = allResults.filter(r => r.status === 'Clicked' || r.status === 'Submitted Data').length;
    const reportedEmails = allResults.filter(r => r.reported).length;
    const openedEmails = allResults.filter(r => ['Email Opened', 'Clicked', 'Submitted Data'].includes(r.status)).length;

    // Données pour les graphiques
    const statusDistribution = [
        { name: 'Email Envoyé', value: allResults.filter(r => r.status === 'Email Sent').length, color: '#8884d8' },
        { name: 'Email Ouvert', value: allResults.filter(r => r.status === 'Email Opened').length, color: '#82ca9d' },
        { name: 'Lien Cliqué', value: allResults.filter(r => r.status === 'Clicked').length, color: '#ffc658' },
        { name: 'Données Soumises', value: allResults.filter(r => r.status === 'Submitted Data').length, color: '#ff7c7c' },
        { name: 'Signalé', value: allResults.filter(r => r.status === 'Reported').length, color: '#8dd1e1' },
        { name: 'Erreur', value: allResults.filter(r => r.status === 'Error').length, color: '#d084d0' }
    ].filter(item => item.value > 0);

    const campaignData = mockCampaigns.map(campaign => ({
        name: campaign.name,
        sent: campaign.results.length,
        opened: campaign.results.filter(r => ['Email Opened', 'Clicked', 'Submitted Data'].includes(r.status)).length,
        clicked: campaign.results.filter(r => ['Clicked', 'Submitted Data'].includes(r.status)).length,
        reported: campaign.results.filter(r => r.reported).length
    }));

    const timelineData = mockCampaigns.map((campaign, index) => ({
        date: new Date(campaign.launch_date).toLocaleDateString('fr-FR'),
        campaigns: index + 1,
        success_rate: Math.round((campaign.results.filter(r => r.reported).length / campaign.results.length) * 100)
    }));

    const getStatusColor = (status : string) => {
        switch (status) {
            case 'Completed': return 'bg-green-500';
            case 'In progress': return 'bg-blue-500';
            case 'Error': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const getResultStatusColor = (status : string) => {
        switch (status) {
            case 'Email Sent': return 'secondary';
            case 'Email Opened': return 'outline';
            case 'Clicked': return 'destructive';
            case 'Submitted Data': return 'destructive';
            case 'Reported': return 'default';
            case 'Error': return 'secondary';
            default: return 'secondary';
        }
    };

    return (
        <div className="p-6 space-y-6 min-h-screen w-full">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Tableau de bord</h1>
                    <p className="text-gray-100 mt-2">Suivi des campagnes de sensibilisation à la cybersécurité</p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>Dernière mise à jour: {new Date().toLocaleString('fr-FR')}</span>
                </div>
            </div>

            {/* Statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Campagnes Total</CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalCampaigns}</div>
                        <p className="text-xs text-muted-foreground">
                            {completedCampaigns} terminées, {inProgressCampaigns} en cours
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Emails Envoyés</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalEmails}</div>
                        <p className="text-xs text-muted-foreground">
                            {Math.round((openedEmails / totalEmails) * 100)}% d&apos;ouverture
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Taux de Clics</CardTitle>
                        <MousePointer className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{Math.round((clickedEmails / totalEmails) * 100)}%</div>
                        <p className="text-xs text-muted-foreground">
                            {clickedEmails} sur {totalEmails} emails
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Signalements</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{Math.round((reportedEmails / totalEmails) * 100)}%</div>
                        <p className="text-xs text-muted-foreground">
                            {reportedEmails} emails signalés
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
                    <TabsTrigger value="campaigns">Campagnes</TabsTrigger>
                    <TabsTrigger value="analytics">Analyses</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Graphique en secteurs */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Distribution des Statuts</CardTitle>
                                <CardDescription>Répartition des actions des utilisateurs</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={statusDistribution}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {statusDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} color={"black"} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{background : "#18181B"}} labelStyle={{color : "white"}} itemStyle={{color : "white"}} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Graphique en barres */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Performance par Campagne</CardTitle>
                                <CardDescription>Comparaison des taux d&apos;interaction</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={campaignData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                                        <YAxis />
                                        <Tooltip contentStyle={{background : "#18181B"}} />
                                        <Legend />
                                        <Bar dataKey="sent" fill="#8884d8" name="Envoyés" />
                                        <Bar dataKey="opened" fill="#82ca9d" name="Ouverts" />
                                        <Bar dataKey="clicked" fill="#ffc658" name="Cliqués" />
                                        <Bar dataKey="reported" fill="#8dd1e1" name="Signalés" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Evolution temporelle */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Évolution dans le Temps</CardTitle>
                            <CardDescription>Progression des campagnes et taux de réussite</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={timelineData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis yAxisId="left" />
                                    <YAxis yAxisId="right" orientation="right" />
                                    <Tooltip contentStyle={{background : "#18181B"}} labelStyle={{color : "white"}} />
                                    <Legend />
                                    <Area yAxisId="left" type="monotone" dataKey="campaigns" stackId="1" stroke="#8884d8" fill="#8884d8" name="Campagnes" />
                                    <Line yAxisId="right" type="monotone" dataKey="success_rate" stroke="#ff7300" name="Taux de Signalement (%)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="campaigns" className="space-y-4">
                    <div className="grid gap-6">
                        {mockCampaigns.map(campaign => (
                            <Card key={campaign.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <CardTitle>{campaign.name}</CardTitle>
                                            <CardDescription>
                                                Template: {campaign.template.name} •
                                                Lancée le {new Date(campaign.launch_date).toLocaleDateString('fr-FR')}
                                            </CardDescription>
                                        </div>
                                        <Badge className={getStatusColor(campaign.status)}>
                                            {campaign.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold">{campaign.results.length}</div>
                                            <div className="text-sm text-gray-500">Emails Envoyés</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">
                                                {campaign.results.filter(r => ['Email Opened', 'Clicked', 'Submitted Data'].includes(r.status)).length}
                                            </div>
                                            <div className="text-sm text-gray-500">Ouverts</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-orange-600">
                                                {campaign.results.filter(r => ['Clicked', 'Submitted Data'].includes(r.status)).length}
                                            </div>
                                            <div className="text-sm text-gray-500">Cliqués</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {campaign.results.filter(r => r.reported).length}
                                            </div>
                                            <div className="text-sm text-gray-500">Signalés</div>
                                        </div>
                                    </div>

                                    {/* Liste des résultats */}
                                    <div className="space-y-2">
                                        <h4 className="font-semibold">Détails des résultats:</h4>
                                        <div className="grid gap-2">
                                            {campaign.results.slice(0, 5).map(result => (
                                                <div key={result.id} className="flex justify-between items-center p-2 bg-secondary rounded">
                                                    <div>
                                                        <span className="font-medium">{result.first_name} {result.last_name}</span>
                                                        <span className="text-sm text-gray-500 ml-2">({result.position})</span>
                                                        <span className="text-sm text-gray-500 ml-2">{result.email}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Badge variant={getResultStatusColor(result.status)}>
                                                            {result.status}
                                                        </Badge>
                                                        {result.reported && (
                                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            {campaign.results.length > 5 && (
                                                <div className="text-sm text-gray-500 text-center py-2">
                                                    ... et {campaign.results.length - 5} autres résultats
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Analyse de Risque</CardTitle>
                                <CardDescription>Évaluation des vulnérabilités détectées</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <Alert>
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertDescription>
                                            <strong>Risque Élevé:</strong> {Math.round((clickedEmails / totalEmails) * 100)}% des utilisateurs ont cliqué sur les liens suspects
                                        </AlertDescription>
                                    </Alert>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center p-4 bg-red-50 rounded-lg">
                                            <div className="text-2xl font-bold text-red-600">{clickedEmails}</div>
                                            <div className="text-sm text-red-800">Utilisateurs Vulnérables</div>
                                        </div>
                                        <div className="text-center p-4 bg-green-50 rounded-lg">
                                            <div className="text-2xl font-bold text-green-600">{reportedEmails}</div>
                                            <div className="text-sm text-green-800">Utilisateurs Vigilants</div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Recommandations</CardTitle>
                                <CardDescription>Actions suggérées pour améliorer la sécurité</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-start space-x-3">
                                        <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
                                        <div>
                                            <div className="font-medium">Formation Renforcée</div>
                                            <div className="text-sm text-gray-600">Organiser des sessions pour les {clickedEmails} utilisateurs vulnérables</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <Eye className="h-5 w-5 text-green-500 mt-0.5" />
                                        <div>
                                            <div className="font-medium">Surveillance Continue</div>
                                            <div className="text-sm text-gray-600">Programmer des campagnes mensuelles de sensibilisation</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                                        <div>
                                            <div className="font-medium">Politique de Sécurité</div>
                                            <div className="text-sm text-gray-600">Réviser les procédures de signalement des emails suspects</div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tableau de bord détaillé */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Analyse Détaillée par Département</CardTitle>
                            <CardDescription>Performance par fonction dans l&apos;entreprise</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-2">Poste</th>
                                        <th className="text-left p-2">Emails Envoyés</th>
                                        <th className="text-left p-2">Taux d&apos;Ouverture</th>
                                        <th className="text-left p-2">Taux de Clic</th>
                                        <th className="text-left p-2">Signalements</th>
                                        <th className="text-left p-2">Risque</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {['IT Manager', 'HR Director', 'Developer', 'Designer', 'Sales', 'Manager', 'Analyst'].map(position => {
                                        const positionResults = allResults.filter(r => r.position?.includes(position.split(' ')[0]));
                                        const sent = positionResults.length;
                                        const opened = positionResults.filter(r => ['Email Opened', 'Clicked', 'Submitted Data'].includes(r.status)).length;
                                        const clicked = positionResults.filter(r => ['Clicked', 'Submitted Data'].includes(r.status)).length;
                                        const reported = positionResults.filter(r => r.reported).length;

                                        if (sent === 0) return null;

                                        return (
                                            <tr key={position} className="border-b">
                                                <td className="p-2 font-medium">{position}</td>
                                                <td className="p-2">{sent}</td>
                                                <td className="p-2">{sent > 0 ? Math.round((opened / sent) * 100) : 0}%</td>
                                                <td className="p-2">{sent > 0 ? Math.round((clicked / sent) * 100) : 0}%</td>
                                                <td className="p-2">{sent > 0 ? Math.round((reported / sent) * 100) : 0}%</td>
                                                <td className="p-2">
                                                    <Badge variant={clicked > reported ? 'destructive' : 'default'}>
                                                        {clicked > reported ? 'Élevé' : 'Modéré'}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}