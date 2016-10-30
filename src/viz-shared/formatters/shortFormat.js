import { formatDate } from './formatDate';
import { formatColor } from './formatColor';
import { formatNumber } from './formatNumber';
import { formatBoolean } from './formatBoolean';
import { formatToString } from './formatToString';

export function shortFormat (value, dataType = typeof value) {
    // null guards
    if (value === undefined) {
        return null;
    }
    if (dataType === 'number' && (isNaN(value) || value === 0x7FFFFFFF)) {
        return null;
    }
    if (dataType === 'string' && (value === 'n/a' || value === '\0')) {
        return null;
    }

    if (dataType === 'boolean') {
        return formatBoolean(value);
    }

    if (dataType === 'date') {
        return formatDate(value, true);
    }

    if (dataType === 'color') {
        if (!isNaN(value)) {
            value = formatColor(value);
        }
    }

    if (isNaN(value)) {
        return formatToString(value, true);
    }

    return formatNumber(value, true);
}

