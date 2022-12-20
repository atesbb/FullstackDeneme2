import { NOTIFICATION_TYPE, Store } from 'react-notifications-component';

export const showNotification = (type: NOTIFICATION_TYPE, title: string) => {
  Store.addNotification({
    title,
    type,
    insert: 'bottom',
    container: 'bottom-right',
    animationIn: ['animate__animated', 'animate__fadeIn'],
    animationOut: ['animate__animated', 'animate__fadeOut'],
    dismiss: {
      duration: 3000,
      onScreen: false,
    },
  });
};
