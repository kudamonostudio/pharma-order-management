import { Collaborator, CollaboratorAssignment } from "@prisma/client";

export interface AssignmentWithCollaborator extends CollaboratorAssignment {
  collaborator: Collaborator;
}

export interface LocationWithCollaborators extends Location {
  collaboratorAssignments: AssignmentWithCollaborator[];
}
