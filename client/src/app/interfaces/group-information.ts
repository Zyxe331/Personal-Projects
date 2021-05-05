import { UserGroup } from './user-group';
import { Group } from './group';
import { User } from './user';
import { UserPlan } from './user-plan';

export class GroupInformation {
    currentUserHasGroup: UserGroup
    currentUserHasPlan: UserPlan
    currentGroup: Group
    groupUsers: User[]
    userHasPlans: UserPlan[]
}
