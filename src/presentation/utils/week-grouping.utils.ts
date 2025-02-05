export function getWeekGroup(dateStr: string): 'current' | 'next' | 'future' {
    const today = new Date();
    const date = new Date(dateStr);
    
    // Get the start of the current week (Monday)
    const currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() - today.getDay() + 1);
    currentWeekStart.setHours(0, 0, 0, 0);
    
    // Get the start of next week
    const nextWeekStart = new Date(currentWeekStart);
    nextWeekStart.setDate(currentWeekStart.getDate() + 7);
    
    // Get the start of the week after next
    const futureWeekStart = new Date(nextWeekStart);
    futureWeekStart.setDate(nextWeekStart.getDate() + 7);
    
    if (date >= currentWeekStart && date < nextWeekStart) {
        return 'current';
    } else if (date >= nextWeekStart && date < futureWeekStart) {
        return 'next';
    } else {
        return 'future';
    }
}

export function getWeekGroupTitle(group: 'current' | 'next' | 'future'): string {
    switch (group) {
        case 'current':
            return 'Cette semaine';
        case 'next':
            return 'La semaine prochaine';
        case 'future':
            return 'Les semaines suivantes';
    }
}