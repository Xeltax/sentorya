import { createContext, useContext, useState, ReactNode } from 'react';
import {OrganizationsWithMembers} from "@/types/OrganizationsWithMembers";
import {User} from "@/types/User";

type OrganizationContextType = {
    organizations: OrganizationsWithMembers[];
    addOrganization: (org: OrganizationsWithMembers) => void;
    updateOrganization: (id: string, org: Partial<OrganizationsWithMembers>) => void;
    deleteOrganization: (id: string) => void;
    addMember: (orgId: string, member: User) => void;
    removeMember: (orgId: string, memberEmail: string) => void;
};

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const OrganizationProvider = ({
                                         children,
                                         initialOrganizations
                                     }: {
    children: ReactNode;
    initialOrganizations: OrganizationsWithMembers[]
}) => {
    const [organizations, setOrganizations] = useState(initialOrganizations);

    const addOrganization = (org: OrganizationsWithMembers) => {
        setOrganizations(prev => [...prev, org]);
    };

    const updateOrganization = (id: string, updates: Partial<OrganizationsWithMembers>) => {
        setOrganizations(prev =>
            prev.map(org => (org.id === id ? { ...org, ...updates } : org))
        );
    };

    const deleteOrganization = (id: string) => {
        setOrganizations(prev => prev.filter(org => org.id !== id));
    };

    const addMember = (orgId: string, member: User) => {
        setOrganizations(prev =>
            prev.map(org =>
                org.id === orgId
                    ? { ...org, member: [...(org.member || []), member.email] }
                    : org
            )
        );
    };

    const removeMember = (orgId: string, memberEmail: string) => {
        setOrganizations(prev =>
            prev.map(org =>
                org.id === orgId
                    ? {
                            ...org,
                            member: org.member?.filter(email => email !== memberEmail) || []
                        }
                    : org
            )
        );
    };

    return (
        <OrganizationContext.Provider
            value={{
                organizations,
                addOrganization,
                updateOrganization,
                deleteOrganization,
                addMember,
                removeMember,
            }}
        >
            {children}
        </OrganizationContext.Provider>
    );
};

export const useOrganizations = () => {
    const context = useContext(OrganizationContext);
    if (!context) {
        throw new Error('useOrganizations must be used within OrganizationProvider');
    }
    return context;
};