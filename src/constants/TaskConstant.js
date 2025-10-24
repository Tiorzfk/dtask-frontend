export const TASK_STATUS = {
  'pending': 'Pending',
  'in_progress': 'In Progress',
  'done': 'Done'
}

export const MESSAGE_ALERT = (isSuccess = true) => {
  const msg = isSuccess ? {
    'add': 'Task added successfully!',
    'update': 'Task updated successfully!',
    'delete': 'Task deleted successfully!',
  } : {
    'add': 'Task unsuccessfully added!',
    'update': 'Task unsuccessfully updated!',
    'delete': 'Task unsuccessfully deleted!',
  }

  return msg;
}