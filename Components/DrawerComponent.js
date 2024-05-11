import * as React from 'react';
import { Drawer } from 'react-native-paper';

const DrawerComponent = () => (
  <Drawer.Section title="Section Title">
    <Drawer.CollapsedItem
      focusedIcon="inbox"
     // unfocusedIcon="inbox-outline"
      label="Inbox"
    />
    <Drawer.CollapsedItem
      focusedIcon="star"
      //unfocusedIcon="star-outline"
      label="Starred"
    />
    <Drawer.CollapsedItem
      focusedIcon="send"
     // unfocusedIcon="send-outline"
      label="Sent Mail"
    />
   
    <Drawer.CollapsedItem
      focusedIcon="delete"
      //unfocusedIcon="delete-outline"
      label="Trash"
    />
  </Drawer.Section>
);

export default DrawerComponent;
