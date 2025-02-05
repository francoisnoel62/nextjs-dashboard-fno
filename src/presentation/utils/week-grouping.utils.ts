export function getWeekGroup(dateStr: string): 'current' | 'next' | 'future' {
    const today = new Date();
    const date = new Date(dateStr);
    
    // Reset hours to compare dates properly
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    // Calculate days difference
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
        return 'current'; // Past dates are shown in current week
    } else if (diffDays < 7) {
        return 'current';
    } else if (diffDays < 14) {
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