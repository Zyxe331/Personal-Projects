import { Plan } from './plan';
import { Section } from './section';
import { UserPlan } from './user-plan';

export interface PlanInformation {
    currentPlan: Plan,
    allSections: Section[],
    currentUserHasPlan: UserPlan,
    sectionTagsBySection: object,
    sectionJournalsBySection: object,
    sectionPrayersBySection: object
}
