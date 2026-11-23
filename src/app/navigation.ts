export type ApplicationId =
  | 'job-runner'
  | 'hardware-manager'
  | 'task-manager'
  | 'settings'
  | 'shop'
  | 'research-lab';

export type NavigationCommand = {
  type: 'focus-application';
  applicationId: ApplicationId;
};

export type Navigate = (command: NavigationCommand) => void;
