import * as React from 'react';
import { Avatar, Button, Card, Text, Appbar } from 'react-native-paper';

const HeaderComponent = () => (
  <Appbar.Header  >
    <Appbar.BackAction onPress={() => {}} />
    <Appbar.Content title="Title" />
    <Appbar.Action icon="calendar" onPress={() => {}} />
    <Appbar.Action icon="magnify" onPress={() => {}} />
  </Appbar.Header>

);

export default HeaderComponent;

