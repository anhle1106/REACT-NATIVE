export const getTodayStart = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
};

export const parseDate = (dateStr: string): Date | null => {
  if (!dateStr || typeof dateStr !== 'string') return null;

  const parts = dateStr.trim().split('/');
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  if (month < 1 || month > 12) return null;
  if (year < 1900 || year > 2100) return null;

  // Lấy số ngày tối đa thực tế của tháng để kiểm tra ngày có thật (vd 31/02)
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) return null;

  return new Date(year, month - 1, day, 0, 0, 0, 0);
};

export const validateDueDate = (
  dateStr: string,
  isEditing: boolean = false
): string | null => {
  if (!dateStr.trim()) {
    return 'Vui lòng nhập hạn hoàn thành';
  }

  const formatRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!formatRegex.test(dateStr.trim())) {
    return 'Hạn hoàn thành phải đúng định dạng dd/mm/yyyy (ví dụ: 30/11/2026)';
  }

  const parsed = parseDate(dateStr);
  if (!parsed) {
    return 'Ngày này không có thật (ví dụ 31/02/2026 là sai)';
  }

  if (!isEditing) {
    const today = getTodayStart();
    if (parsed.getTime() < today.getTime()) {
      return 'Hạn hoàn thành không được trước ngày hôm nay';
    }
  }

  return null;
};

export const isTaskOverdue = (dueDateStr: string, done: boolean): boolean => {
  if (done) return false;
  const parsed = parseDate(dueDateStr);
  if (!parsed) return false;

  const today = getTodayStart();
  return parsed.getTime() < today.getTime();
};

export const getDueStatusText = (dueDateStr: string): string => {
  const parsed = parseDate(dueDateStr);
  if (!parsed) return dueDateStr;

  const today = getTodayStart();
  const diffTime = parsed.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    return `Còn ${diffDays} ngày`;
  } else if (diffDays === 0) {
    return 'Hạn hôm nay';
  } else {
    return `Quá hạn ${Math.abs(diffDays)} ngày`;
  }
};
