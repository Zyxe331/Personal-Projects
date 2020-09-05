import { UserGroup } from './user-group';
import { Group } from './group';
import { User } from './user';
import { UserPlan } from './user-plan';

export interface GroupInformation {
    currentUserHasGroup: UserGroup,
    currentGroup: Group,
    groupUsers: User[],
    userHasPlans: UserPlan[]
}
